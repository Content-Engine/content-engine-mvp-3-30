
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
      tier: campaignData.tier,
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

    // First, check if content-files bucket exists
    console.log('🔍 Checking storage bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Error checking buckets:', bucketError);
    } else {
      console.log('📦 Available buckets:', buckets?.map(b => b.name) || []);
      const contentBucket = buckets?.find(b => b.name === 'content-files');
      if (!contentBucket) {
        console.warn('⚠️ content-files bucket not found. Available buckets:', buckets?.map(b => b.name));
      } else {
        console.log('✅ content-files bucket found, public:', contentBucket.public);
      }
    }

    // Process files and generate proper URLs
    const filesWithUrls = await Promise.all(
      (campaignData.files || []).map(async (file, index) => {
        let fileUrl = '';
        let fileExists = false;
        let debugInfo: any = {
          originalName: file.name,
          contentType: file.contentType || 'unknown',
          processed: new Date().toISOString(),
          index: index
        };
        
        if (file.name) {
          console.log(`🔍 Processing file ${index + 1}/${campaignData.files.length}:`, file.name);
          
          try {
            // Check if file exists in storage
            const { data: fileList, error: listError } = await supabase.storage
              .from('content-files')
              .list('', {
                limit: 1000,
                search: file.name
              });
            
            if (listError) {
              console.error(`❌ Error listing files for ${file.name}:`, listError);
              fileUrl = `Error: Could not access storage - ${listError.message}`;
              debugInfo.error = listError.message;
            } else {
              console.log(`📁 Storage list result for ${file.name}:`, fileList?.length || 0, 'files found');
              
              // Check if file exists in the list
              const fileFound = fileList?.find(f => f.name === file.name);
              
              if (fileFound) {
                // File exists, generate public URL
                const { data: urlData } = supabase.storage
                  .from('content-files')
                  .getPublicUrl(file.name);
                
                fileUrl = urlData.publicUrl;
                fileExists = true;
                debugInfo.fileSize = fileFound.metadata?.size;
                debugInfo.lastModified = fileFound.updated_at;
                
                console.log(`✅ File found: ${file.name}`);
                console.log(`🔗 Generated URL: ${fileUrl}`);
                
                // Test URL accessibility
                try {
                  const testResponse = await fetch(fileUrl, { method: 'HEAD' });
                  debugInfo.urlAccessible = testResponse.ok;
                  debugInfo.httpStatus = testResponse.status;
                  console.log(`🌐 URL test for ${file.name}: ${testResponse.status} ${testResponse.ok ? '✅' : '❌'}`);
                } catch (testError) {
                  console.warn(`⚠️ URL test failed for ${file.name}:`, testError);
                  debugInfo.urlAccessible = false;
                  debugInfo.testError = testError.message;
                }
                
              } else {
                console.warn(`⚠️ File not found in storage: ${file.name}`);
                console.log(`📝 Available files in storage:`, fileList?.map(f => f.name).slice(0, 10) || []);
                fileUrl = `Error: File not found in storage: ${file.name}`;
                debugInfo.availableFiles = fileList?.map(f => f.name).slice(0, 5) || [];
              }
            }
          } catch (error) {
            console.error(`❌ Error processing file ${file.name}:`, error);
            fileUrl = `Error processing file: ${file.name} - ${error.message}`;
            debugInfo.processingError = error.message;
          }
        } else {
          console.warn(`⚠️ File ${index} has no name property`);
          fileUrl = 'Error: Invalid file - no name';
          debugInfo.error = 'No file name provided';
        }
        
        return {
          ...file,
          url: fileUrl,
          fileExists: fileExists,
          isValidUrl: fileExists && fileUrl.startsWith('https://'),
          storageBucket: 'content-files',
          debugInfo: debugInfo
        };
      })
    );

    // Filter files for Make.com
    const validFiles = filesWithUrls.filter(file => file.isValidUrl);
    const invalidFiles = filesWithUrls.filter(file => !file.isValidUrl);
    
    console.log('📊 File processing summary:');
    console.log(`   Total files received: ${filesWithUrls.length}`);
    console.log(`   Valid files (accessible): ${validFiles.length}`);
    console.log(`   Invalid files: ${invalidFiles.length}`);
    
    if (validFiles.length > 0) {
      console.log('✅ Valid files for Make.com:');
      validFiles.forEach((file, i) => {
        console.log(`   ${i + 1}. ${file.name} -> ${file.url}`);
      });
    }
    
    if (invalidFiles.length > 0) {
      console.log('❌ Invalid files (will not be sent):');
      invalidFiles.forEach((file, i) => {
        console.log(`   ${i + 1}. ${file.name} -> ${file.url}`);
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
        contentType: file.contentType || 'application/octet-stream',
        size: file.debugInfo?.fileSize || 0
      })),
      stats: {
        totalFilesReceived: filesWithUrls.length,
        validFilesForwarded: validFiles.length,
        invalidFilesSkipped: invalidFiles.length,
        processingTimestamp: new Date().toISOString()
      },
      // Only include debug info in development-like scenarios
      debug: Deno.env.get('DENO_DEPLOYMENT_ID') ? undefined : {
        invalidFiles: invalidFiles.map(f => ({ 
          name: f.name, 
          error: f.url,
          debugInfo: f.debugInfo 
        }))
      }
    };

    console.log('📦 Payload structure for Make.com:');
    console.log(`   Campaign: ${makePayload.campaign.name}`);
    console.log(`   Files array length: ${makePayload.files.length}`);
    console.log(`   Sample file structure:`, makePayload.files[0] || 'No files');

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
          totalFiles: filesWithUrls.length,
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
