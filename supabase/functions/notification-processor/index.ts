
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const slackWebhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");

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
    console.log("🔔 Notification processor starting...");

    // Get pending notifications
    const { data: notifications, error: fetchError } = await supabase
      .from('notification_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .lt('retry_count', 3);

    if (fetchError) {
      console.error("❌ Error fetching notifications:", fetchError);
      throw fetchError;
    }

    console.log(`📋 Found ${notifications?.length || 0} notifications to process`);

    const results = [];

    for (const notification of notifications || []) {
      try {
        console.log(`📤 Processing notification ${notification.id} of type ${notification.notification_type}`);

        let success = false;

        switch (notification.notification_type) {
          case 'slack':
            if (slackWebhookUrl) {
              const slackPayload = {
                text: `🎵 ${notification.title}`,
                attachments: [{
                  color: notification.title.includes('Failed') ? 'danger' : 'good',
                  fields: [{
                    title: notification.title,
                    value: notification.message,
                    short: false
                  }]
                }]
              };

              const slackResponse = await fetch(slackWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slackPayload),
              });

              success = slackResponse.ok;
              console.log(`📱 Slack notification ${success ? 'sent' : 'failed'}`);
            }
            break;

          case 'in_app':
            // In-app notifications are already stored in the notifications table
            // We just mark them as sent so they appear in the UI
            success = true;
            console.log(`📲 In-app notification marked as sent`);
            break;

          case 'email':
            // TODO: Implement email notifications using Resend
            console.log(`📧 Email notifications not implemented yet`);
            success = true; // Mark as success for now
            break;

          default:
            console.log(`❓ Unknown notification type: ${notification.notification_type}`);
            success = false;
        }

        // Update notification status
        await supabase
          .from('notification_queue')
          .update({
            status: success ? 'sent' : 'failed',
            sent_at: success ? new Date().toISOString() : null,
            retry_count: notification.retry_count + 1
          })
          .eq('id', notification.id);

        results.push({ 
          notification_id: notification.id, 
          type: notification.notification_type,
          status: success ? 'sent' : 'failed' 
        });

      } catch (error: any) {
        console.error(`❌ Error processing notification ${notification.id}:`, error);

        await supabase
          .from('notification_queue')
          .update({
            status: 'failed',
            retry_count: notification.retry_count + 1
          })
          .eq('id', notification.id);

        results.push({ 
          notification_id: notification.id, 
          status: 'failed', 
          error: error.message 
        });
      }
    }

    console.log("🎯 Notification processor completed:", results);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: results.length,
      results 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Notification processor error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
