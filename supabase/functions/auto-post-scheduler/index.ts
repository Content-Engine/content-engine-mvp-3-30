
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScheduledPost {
  id: string;
  user_id: string;
  campaign_id: string;
  platforms: string[];
  caption: string;
  media_urls: string[];
  schedule_time: string;
  status: string;
  ayrshare_post_id?: string;
  retry_count: number;
  max_retries: number;
  processing_status: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Auto-post scheduler starting...");

    // Get all posts scheduled for now or earlier that haven't been posted
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('scheduled_posts')
      .select('*, campaigns(name)')
      .lte('schedule_time', new Date().toISOString())
      .eq('status', 'scheduled')
      .eq('processing_status', 'pending')
      .lt('retry_count', 3);

    if (fetchError) {
      console.error("❌ Error fetching scheduled posts:", fetchError);
      throw fetchError;
    }

    console.log(`📋 Found ${scheduledPosts?.length || 0} posts to process`);

    const results = [];

    for (const post of scheduledPosts || []) {
      try {
        console.log(`📤 Processing post ${post.id} for campaign ${post.campaign_id}`);

        // Mark as processing
        await supabase
          .from('scheduled_posts')
          .update({ processing_status: 'processing' })
          .eq('id', post.id);

        // Get user's Ayrshare API key
        const { data: clientToken, error: tokenError } = await supabase
          .from('client_tokens')
          .select('ayrshare_api_key, ayrshare_user_id')
          .eq('user_id', post.user_id)
          .eq('is_active', true)
          .single();

        if (tokenError || !clientToken?.ayrshare_api_key) {
          console.error(`❌ No Ayrshare API key found for user ${post.user_id}`);
          
          await supabase
            .from('scheduled_posts')
            .update({ 
              status: 'failed',
              processing_status: 'failed',
              last_error_message: 'Missing Ayrshare API key',
              retry_count: post.retry_count + 1
            })
            .eq('id', post.id);

          results.push({ post_id: post.id, status: 'failed', error: 'Missing API key' });
          continue;
        }

        // Prepare Ayrshare post data
        const ayrsharePayload = {
          post: post.caption,
          platforms: post.platforms,
          media_urls: post.media_urls.length > 0 ? post.media_urls : undefined,
        };

        console.log(`📡 Posting to Ayrshare:`, ayrsharePayload);

        // Post to Ayrshare
        const ayrshareResponse = await fetch('https://app.ayrshare.com/api/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken.ayrshare_api_key}`,
          },
          body: JSON.stringify(ayrsharePayload),
        });

        const ayrshareResult = await ayrshareResponse.json();

        if (ayrshareResponse.ok && ayrshareResult.status === 'success') {
          console.log(`✅ Post ${post.id} successful:`, ayrshareResult);

          // Update post as successful
          await supabase
            .from('scheduled_posts')
            .update({
              status: 'posted',
              processing_status: 'completed',
              ayrshare_post_id: ayrshareResult.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', post.id);

          // Log successful post
          await supabase
            .from('post_status_logs')
            .insert({
              scheduled_post_id: post.id,
              status: 'posted',
              message: 'Successfully posted to social media',
              response_data: ayrshareResult
            });

          results.push({ post_id: post.id, status: 'posted', ayrshare_id: ayrshareResult.id });

        } else {
          console.error(`❌ Ayrshare error for post ${post.id}:`, ayrshareResult);

          // Update post as failed
          await supabase
            .from('scheduled_posts')
            .update({
              status: 'failed',
              processing_status: 'failed',
              last_error_message: ayrshareResult.message || 'Unknown Ayrshare error',
              retry_count: post.retry_count + 1
            })
            .eq('id', post.id);

          // Log failed post
          await supabase
            .from('post_status_logs')
            .insert({
              scheduled_post_id: post.id,
              status: 'failed',
              message: ayrshareResult.message || 'Unknown error',
              response_data: ayrshareResult
            });

          results.push({ post_id: post.id, status: 'failed', error: ayrshareResult.message });
        }

      } catch (error: any) {
        console.error(`❌ Error processing post ${post.id}:`, error);

        // Update post with error
        await supabase
          .from('scheduled_posts')
          .update({
            status: 'failed',
            processing_status: 'failed',
            last_error_message: error.message,
            retry_count: post.retry_count + 1
          })
          .eq('id', post.id);

        results.push({ post_id: post.id, status: 'failed', error: error.message });
      }
    }

    console.log("🎯 Auto-post scheduler completed:", results);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: results.length,
      results 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Auto-post scheduler error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
