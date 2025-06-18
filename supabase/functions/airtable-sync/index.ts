
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const airtableApiKey = Deno.env.get("AIRTABLE_API_KEY");
const airtableBaseId = Deno.env.get("AIRTABLE_BASE_ID");

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📊 Airtable sync processor starting...");

    if (!airtableApiKey || !airtableBaseId) {
      console.log("⚠️ Airtable credentials not configured, skipping sync");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Airtable not configured" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get pending sync jobs
    const { data: syncJobs, error: fetchError } = await supabase
      .from('airtable_sync_log')
      .select('*')
      .eq('sync_status', 'pending')
      .lt('retry_count', 3);

    if (fetchError) {
      console.error("❌ Error fetching sync jobs:", fetchError);
      throw fetchError;
    }

    console.log(`📋 Found ${syncJobs?.length || 0} sync jobs to process`);

    const results = [];

    for (const syncJob of syncJobs || []) {
      try {
        console.log(`📤 Processing sync job ${syncJob.id} for ${syncJob.record_type}`);

        if (syncJob.record_type === 'scheduled_post' && syncJob.sync_direction === 'to_airtable') {
          // Get the scheduled post data
          const { data: post, error: postError } = await supabase
            .from('scheduled_posts')
            .select('*, campaigns(name)')
            .eq('id', syncJob.record_id)
            .single();

          if (postError || !post) {
            console.error(`❌ Post not found: ${syncJob.record_id}`);
            
            await supabase
              .from('airtable_sync_log')
              .update({
                sync_status: 'failed',
                error_message: 'Post not found',
                retry_count: syncJob.retry_count + 1
              })
              .eq('id', syncJob.id);

            results.push({ sync_id: syncJob.id, status: 'failed', error: 'Post not found' });
            continue;
          }

          // Prepare Airtable record
          const airtableRecord = {
            fields: {
              'Post ID': post.id,
              'Campaign': post.campaigns?.name || 'Unknown',
              'Caption': post.caption,
              'Platforms': post.platforms.join(', '),
              'Schedule Time': post.schedule_time,
              'Status': post.status,
              'Created At': post.created_at,
              'Ayrshare Post ID': post.ayrshare_post_id || '',
              'Auto Generated': post.auto_generated || false,
              'Processing Status': post.processing_status
            }
          };

          console.log(`📡 Syncing to Airtable:`, airtableRecord);

          // Send to Airtable
          const airtableResponse = await fetch(
            `https://api.airtable.com/v0/${airtableBaseId}/Posts`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${airtableApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(airtableRecord),
            }
          );

          const airtableResult = await airtableResponse.json();

          if (airtableResponse.ok) {
            console.log(`✅ Sync job ${syncJob.id} successful`);

            // Update sync job as successful
            await supabase
              .from('airtable_sync_log')
              .update({
                sync_status: 'synced',
                airtable_record_id: airtableResult.id,
                synced_at: new Date().toISOString()
              })
              .eq('id', syncJob.id);

            // Update the scheduled post with Airtable record ID
            await supabase
              .from('scheduled_posts')
              .update({ airtable_record_id: airtableResult.id })
              .eq('id', post.id);

            results.push({ 
              sync_id: syncJob.id, 
              status: 'synced', 
              airtable_id: airtableResult.id 
            });

          } else {
            console.error(`❌ Airtable error for sync job ${syncJob.id}:`, airtableResult);

            await supabase
              .from('airtable_sync_log')
              .update({
                sync_status: 'failed',
                error_message: airtableResult.error?.message || 'Unknown Airtable error',
                retry_count: syncJob.retry_count + 1
              })
              .eq('id', syncJob.id);

            results.push({ 
              sync_id: syncJob.id, 
              status: 'failed', 
              error: airtableResult.error?.message 
            });
          }
        }

      } catch (error: any) {
        console.error(`❌ Error processing sync job ${syncJob.id}:`, error);

        await supabase
          .from('airtable_sync_log')
          .update({
            sync_status: 'failed',
            error_message: error.message,
            retry_count: syncJob.retry_count + 1
          })
          .eq('id', syncJob.id);

        results.push({ sync_id: syncJob.id, status: 'failed', error: error.message });
      }
    }

    console.log("🎯 Airtable sync completed:", results);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: results.length,
      results 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Airtable sync error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
