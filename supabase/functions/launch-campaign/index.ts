
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CampaignLaunchRequest {
  files: Array<{
    name: string;
    contentType: string;
    url?: string;
    [key: string]: any;
  }>;
  date: string;
  time: string;
  goal: string;
  tier: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    console.log('🚀 Launch campaign function called');
    
    // Parse the incoming JSON data
    const campaignData: CampaignLaunchRequest = await req.json();
    
    console.log('📋 Received campaign data:', {
      filesCount: campaignData.files?.length || 0,
      date: campaignData.date,
      time: campaignData.time,
      goal: campaignData.goal,
      tier: campaignData.tier
    });

    // Validate required fields
    if (!campaignData.date || !campaignData.time || !campaignData.goal || !campaignData.tier) {
      console.error('❌ Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: date, time, goal, tier' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Forward the entire JSON body to Make.com webhook
    console.log('📡 Forwarding to Make.com webhook...');
    
    const makeResponse = await fetch('https://hook.us2.make.com/kkaffrcwq5ldum892qtasszegim2dmqb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });

    console.log('📡 Make.com response status:', makeResponse.status);

    if (!makeResponse.ok) {
      console.error('❌ Make.com webhook failed:', makeResponse.status, makeResponse.statusText);
      
      // Try to get error details from Make.com
      let errorText = '';
      try {
        errorText = await makeResponse.text();
        console.error('❌ Make.com error details:', errorText);
      } catch (e) {
        console.error('❌ Could not read Make.com error response');
      }

      return new Response(
        JSON.stringify({ 
          error: 'Make.com webhook failed', 
          status: makeResponse.status,
          details: errorText 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get response from Make.com
    const makeResponseData = await makeResponse.text();
    console.log('✅ Make.com response:', makeResponseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Campaign launched successfully',
        makeResponse: makeResponseData 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in launch-campaign function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error) 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
