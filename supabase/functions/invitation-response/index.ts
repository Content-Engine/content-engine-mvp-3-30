
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const url = new URL(req.url);
    const action = url.searchParams.get('action'); // 'accept' or 'reject'
    const affiliationId = url.searchParams.get('id');

    if (!action || !affiliationId) {
      throw new Error('Missing action or affiliation ID');
    }

    if (!['accept', 'reject'].includes(action)) {
      throw new Error('Invalid action. Must be "accept" or "reject"');
    }

    // Update the affiliation status
    const { data: updatedAffiliation, error: updateError } = await supabaseAdmin
      .from('user_affiliations')
      .update({
        status: action === 'accept' ? 'accepted' : 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', affiliationId)
      .select('inviter_id, invited_user_id')
      .single();

    if (updateError) {
      throw new Error(`Failed to update affiliation: ${updateError.message}`);
    }

    console.log(`Invitation ${action}ed for affiliation:`, affiliationId);

    // Return an HTML response that can be displayed to the user
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invitation ${action === 'accept' ? 'Accepted' : 'Declined'}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              margin: 0; 
              background-color: #f5f5f5; 
            }
            .container { 
              text-align: center; 
              background: white; 
              padding: 2rem; 
              border-radius: 8px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
              max-width: 400px;
            }
            .success { color: #22c55e; }
            .error { color: #ef4444; }
            h1 { margin-bottom: 1rem; }
            p { color: #666; line-height: 1.6; }
            .button {
              display: inline-block;
              margin-top: 1.5rem;
              padding: 0.75rem 1.5rem;
              background: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
            }
            .button:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="${action === 'accept' ? 'success' : 'error'}">
              Invitation ${action === 'accept' ? 'Accepted!' : 'Declined'}
            </h1>
            <p>
              ${action === 'accept' 
                ? 'Great! You have successfully accepted the collaboration invitation. You can now access shared campaigns and work together on content projects.' 
                : 'You have declined the collaboration invitation. No further action is required.'}
            </p>
            ${action === 'accept' 
              ? '<a href="/" class="button">Go to Content Engine</a>' 
              : '<p>You can safely close this window.</p>'}
          </div>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { 
        "Content-Type": "text/html",
        ...corsHeaders 
      },
    });

  } catch (error: any) {
    console.error("Error in invitation-response function:", error);
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: system-ui; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .container { text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .error { color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">Error</h1>
            <p>Something went wrong while processing your invitation response. Please try again or contact support.</p>
          </div>
        </body>
      </html>
    `;
    
    return new Response(errorHtml, {
      status: 500,
      headers: { 
        "Content-Type": "text/html",
        ...corsHeaders 
      },
    });
  }
};

serve(handler);
