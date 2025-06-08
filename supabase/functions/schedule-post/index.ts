
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { 
      platforms, 
      caption, 
      media_urls, 
      schedule_time, 
      campaign_id,
      boost_enabled 
    } = await req.json()

    // Get client token
    const { data: clientToken } = await supabaseClient
      .from('client_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!clientToken) {
      return new Response('No Ayrshare token found', { status: 400, headers: corsHeaders })
    }

    // Create scheduled post record
    const { data: scheduledPost, error: insertError } = await supabaseClient
      .from('scheduled_posts')
      .insert({
        user_id: user.id,
        campaign_id,
        platforms,
        caption,
        media_urls,
        schedule_time,
        boost_enabled,
        status: 'scheduled'
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Call Ayrshare API
    const ayrshareResponse = await fetch('https://app.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${clientToken.ayrshare_api_key}`
      },
      body: JSON.stringify({
        user_id: clientToken.ayrshare_user_id,
        post: caption,
        platforms,
        mediaUrls: media_urls,
        scheduleDate: schedule_time
      })
    })

    const ayrshareData = await ayrshareResponse.json()

    // Log the response
    await supabaseClient
      .from('post_status_logs')
      .insert({
        scheduled_post_id: scheduledPost.id,
        status: ayrshareResponse.ok ? 'posted' : 'failed',
        message: ayrshareResponse.ok ? 'Successfully scheduled via Ayrshare' : 'Failed to schedule via Ayrshare',
        response_data: ayrshareData
      })

    // Update scheduled post with Ayrshare ID if successful
    if (ayrshareResponse.ok && ayrshareData.id) {
      await supabaseClient
        .from('scheduled_posts')
        .update({ 
          ayrshare_post_id: ayrshareData.id,
          status: 'posted'
        })
        .eq('id', scheduledPost.id)
    }

    return new Response(
      JSON.stringify({ 
        success: ayrshareResponse.ok, 
        data: ayrshareData,
        scheduled_post: scheduledPost
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: ayrshareResponse.ok ? 200 : 400
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
