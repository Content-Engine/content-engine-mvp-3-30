
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

    // Process files and generate proper URLs
    const filesWithUrls = await Promise.all(
      (campaignData.files || []).map(async (file) => {
        let fileUrl = '';
        let fileExists = false;
        
        if (file.name) {
          console.log('🔍 Processing file:', file.name);
          
          try {
            // Check if file exists in storage using the list method
            const { data: fileList, error: listError } = await supabase.storage
              .from('content-files')
              .list('', {
                limit: 1000,
                search: file.name
              });
            
            if (listError) {
              console.error('❌ Error listing files:', listError);
              fileUrl = `Error: Could not access storage - ${listError.message}`;
            } else {
              // Check if file exists in the list
              const fileFound = fileList?.find(f => f.name === file.name);
              
              if (fileFound) {
                // File exists, generate public URL
                const { data: urlData } = supabase.storage
                  .from('content-files')
                  .getPublicUrl(file.name);
                
                fileUrl = urlData.publicUrl;
                fileExists = true;
                console.log('✅ File found, URL generated:', fileUrl);
                
                // Validate URL format
                if (!fileUrl.startsWith('https://')) {
                  console.warn('⚠️ Generated URL does not start with https:', fileUrl);
                  fileUrl = `https://qpaomtgbpjxvnamtqhtv.supabase.co/storage/v1/object/public/content-files/${file.name}`;
                }
              } else {
                console.warn('⚠️ File not found in storage:', file.name);
                fileUrl = `File not found: ${file.name}`;
              }
            }
          } catch (error) {
            console.error('❌ Error processing file:', file.name, error);
            fileUrl = `Error processing file: ${file.name}`;
          }
        } else {
          console.warn('⚠️ File has no name property');
          fileUrl = 'Invalid file: no name';
        }
        
        return {
          ...file,
          url: fileUrl,
          fileExists: fileExists,
          isValidUrl: fileExists && fileUrl.startsWith('https://'),
          storageBucket: 'content-files',
          debugInfo: {
            originalName: file.name,
            contentType: file.contentType || 'unknown',
            processed: new Date().toISOString(),
            urlValid: fileExists && fileUrl.startsWith('https://')
          }
        };
      })
    );

    // Filter out invalid files for Make.com webhook
    const validFiles = filesWithUrls.filter(file => file.isValidUrl);
    const invalidFiles = filesWithUrls.filter(file => !file.isValidUrl);
    
    console.log('📊 File processing summary:', {
      totalFiles: filesWithUrls.length,
      validFiles: validFiles.length,
      invalidFiles: invalidFiles.length,
      invalidFileNames: invalidFiles.map(f => f.name)
    });

    // Create the payload with only valid files
    const payloadToMake = {
      ...campaignData,
      files: validFiles, // Only send files with valid URLs
      invalidFiles: invalidFiles.map(f => ({ 
        name: f.name, 
        error: f.url,
        contentType: f.contentType 
      })), // Track invalid files for debugging
      stats: {
        totalFilesReceived: filesWithUrls.length,
        validFilesForwarded: validFiles.length,
        invalidFilesSkipped: invalidFiles.length,
        timestamp: new Date().toISOString()
      }
    };

    console.log('📦 Sending payload to Make.com:', {
      validFilesCount: validFiles.length,
      invalidFilesCount: invalidFiles.length,
      sampleValidFile: validFiles[0]?.url || 'none',
      campaignData: {
        date: campaignData.date,
        time: campaignData.time,
        goal: campaignData.goal,
        tier: campaignData.tier
      }
    });

    // Forward to Make.com webhook
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

    const makeResponseData = await makeResponse.text();
    console.log('✅ Make.com response:', makeResponseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Campaign launched successfully',
        makeResponse: makeResponseData,
        filesProcessed: {
          total: filesWithUrls.length,
          valid: validFiles.length,
          invalid: invalidFiles.length,
          validUrls: validFiles.map(f => f.url),
          invalidFiles: invalidFiles.map(f => ({ name: f.name, error: f.url }))
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
