
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CampaignLaunchRequest {
  files: Array<{
    name: string;
    url: string;
    contentType: string;
    size: number;
    [key: string]: any;
  }>;
  date: string;
  time: string;
  goal: string;
  tier: string;
  campaignName: string;
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
      tier: campaignData.tier,
      campaignName: campaignData.campaignName,
      fileNames: campaignData.files?.map(f => f.name) || []
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

    // Process files - they should already have valid URLs from Step 2
    const processedFiles = campaignData.files?.map((file, index) => {
      console.log(`🔍 Processing file ${index + 1}:`, {
        name: file.name,
        url: file.url,
        hasValidUrl: !!file.url && file.url.startsWith('https://'),
        size: file.size
      });

      return {
        name: file.name,
        url: file.url,
        contentType: file.contentType || 'application/octet-stream',
        size: file.size || 0,
        isValidUrl: !!file.url && file.url.startsWith('https://'),
        editorNotes: file.editorNotes || '',
        assignedEditor: file.assignedEditor || 'unassigned',
        viralityScore: file.viralityScore || 1
      };
    }) || [];

    // Filter files with valid URLs
    const validFiles = processedFiles.filter(file => file.isValidUrl);
    const invalidFiles = processedFiles.filter(file => !file.isValidUrl);
    
    console.log('📊 File processing summary:');
    console.log(`   Total files received: ${processedFiles.length}`);
    console.log(`   Valid files (with URLs): ${validFiles.length}`);
    console.log(`   Invalid files (no URLs): ${invalidFiles.length}`);
    
    if (validFiles.length > 0) {
      console.log('✅ Valid files for Make.com:');
      validFiles.forEach((file, i) => {
        console.log(`   ${i + 1}. ${file.name} -> ${file.url}`);
      });
    }
    
    if (invalidFiles.length > 0) {
      console.log('❌ Invalid files (will not be sent):');
      invalidFiles.forEach((file, i) => {
        console.log(`   ${i + 1}. ${file.name} -> No URL provided`);
      });
    }

    // Create optimized payload for Make.com
    const makePayload = {
      campaign: {
        name: campaignData.campaignName || `Campaign ${campaignData.goal}`,
        goal: campaignData.goal,
        tier: campaignData.tier,
        launchDate: campaignData.date,
        launchTime: campaignData.time,
        timestamp: new Date().toISOString()
      },
      files: validFiles.map(file => ({
        name: file.name,
        url: file.url,
        contentType: file.contentType,
        size: file.size,
        downloadReady: true // Flag for Make.com to know these are ready to download
      })),
      stats: {
        totalFilesReceived: processedFiles.length,
        validFilesForwarded: validFiles.length,
        invalidFilesSkipped: invalidFiles.length,
        processingTimestamp: new Date().toISOString()
      }
    };

    console.log('📦 Payload structure for Make.com:');
    console.log(`   Campaign: ${makePayload.campaign.name}`);
    console.log(`   Files array length: ${makePayload.files.length}`);
    console.log(`   Sample file:`, makePayload.files[0] || 'No files');

    // Forward to Make.com webhook
    console.log('📡 Sending to Make.com webhook...');
    
    const makeResponse = await fetch('https://hook.us2.make.com/kkaffrcwq5ldum892qtasszegim2dmqb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(makePayload),
    });

    console.log(`📡 Make.com response: ${makeResponse.status} ${makeResponse.statusText}`);

    if (!makeResponse.ok) {
      const errorText = await makeResponse.text();
      console.error('❌ Make.com webhook failed:', errorText);

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

    const makeResponseData = await makeResponse.text();
    console.log('✅ Make.com accepted payload:', makeResponseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Campaign launched successfully',
        makeResponse: makeResponseData,
        summary: {
          totalFiles: processedFiles.length,
          validFiles: validFiles.length,
          invalidFiles: invalidFiles.length,
          sentToMake: validFiles.length > 0
        }
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
