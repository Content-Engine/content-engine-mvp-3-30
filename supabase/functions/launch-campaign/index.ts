
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
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

    // Check if files are actually stored in Supabase and construct proper URLs
    const filesWithUrls = await Promise.all(
      (campaignData.files || []).map(async (file) => {
        let fileUrl = '';
        
        // Check if the file exists in storage
        if (file.name) {
          console.log('🔍 Checking file in storage:', file.name);
          
          // Try to get the file from storage
          const { data: fileData, error: fileError } = await supabase.storage
            .from('content-files')
            .list('', {
              search: file.name
            });
            
          if (fileError) {
            console.error('❌ Error checking file in storage:', fileError);
            // If storage bucket doesn't exist or file not found, use a placeholder
            fileUrl = `File not found in storage: ${file.name}`;
          } else if (fileData && fileData.length > 0) {
            // File exists in storage, construct public URL
            const { data: urlData } = supabase.storage
              .from('content-files')
              .getPublicUrl(file.name);
            
            fileUrl = urlData.publicUrl;
            console.log('✅ File found in storage, URL:', fileUrl);
          } else {
            // File not found in storage
            console.warn('⚠️ File not found in storage:', file.name);
            fileUrl = `File not uploaded to storage: ${file.name}`;
          }
        }
        
        return {
          ...file,
          url: fileUrl,
          storageBucket: 'content-files',
          fileExists: fileUrl.startsWith('https://'),
          debugInfo: {
            originalName: file.name,
            contentType: file.contentType,
            checkTime: new Date().toISOString()
          }
        };
      })
    );

    // Create the payload with updated files array
    const payloadToMake = {
      ...campaignData,
      files: filesWithUrls,
      debug: {
        totalFiles: filesWithUrls.length,
        filesWithValidUrls: filesWithUrls.filter(f => f.fileExists).length,
        timestamp: new Date().toISOString()
      }
    };

    console.log('📦 Payload with file URLs:', {
      filesCount: filesWithUrls.length,
      validUrls: filesWithUrls.filter(f => f.fileExists).length,
      sampleFile: filesWithUrls[0]
    });

    // Forward the entire JSON body to Make.com webhook
    console.log('📡 Forwarding to Make.com webhook...');
    
    const makeResponse = await fetch('https://hook.us2.make.com/kkaffrcwq5ldum892qtasszegim2dmqb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadToMake),
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
        makeResponse: makeResponseData,
        filesProcessed: filesWithUrls.length,
        validFileUrls: filesWithUrls.filter(f => f.fileExists).length
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
