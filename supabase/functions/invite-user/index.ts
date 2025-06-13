
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteUserRequest {
  email: string;
  role: 'admin' | 'social_media_manager' | 'editor' | 'user';
  inviterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if required environment variables are set
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { email, role, inviterName }: InviteUserRequest = await req.json();

    console.log('Creating affiliation with user:', email, 'with role:', role);

    // Get the inviter's user ID from the request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const { data: { user: inviter }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !inviter) {
      throw new Error('Invalid authorization token');
    }

    // Find the user by email in profiles table
    const { data: invitedProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email)
      .single();

    if (profileError || !invitedProfile) {
      throw new Error(`User with email ${email} not found. They need to sign up first.`);
    }

    // Check if affiliation already exists
    const { data: existingAffiliation, error: affiliationCheckError } = await supabaseAdmin
      .from('user_affiliations')
      .select('id, status')
      .eq('inviter_id', inviter.id)
      .eq('invited_user_id', invitedProfile.id)
      .single();

    if (existingAffiliation) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: `User affiliation already exists with status: ${existingAffiliation.status}` 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create user affiliation
    const { error: affiliationError } = await supabaseAdmin
      .from('user_affiliations')
      .insert({
        inviter_id: inviter.id,
        invited_user_id: invitedProfile.id,
        status: 'pending'
      });

    if (affiliationError) {
      throw new Error(`Failed to create user affiliation: ${affiliationError.message}`);
    }

    // Set or update the user role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: invitedProfile.id,
        role: role
      });

    if (roleError) {
      console.error('Role assignment error:', roleError);
      // Don't throw here as the affiliation was created successfully
    }

    // Send notification email if Resend API key is configured
    if (resendApiKey) {
      try {
        const { Resend } = await import("npm:resend@2.0.0");
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: "Content Engine <onboarding@resend.dev>",
          to: [email],
          subject: "You've been invited to collaborate!",
          html: `
            <h1>Collaboration Invitation</h1>
            <p>You've been invited by ${inviterName || inviter.email} to collaborate on Content Engine with the role of <strong>${role.replace('_', ' ')}</strong>.</p>
            <p>You can now access shared campaigns and work together on content projects.</p>
            <p>Log in to your Content Engine account to start collaborating!</p>
            <p>Best regards,<br>The Content Engine Team</p>
          `,
        });
        console.log('Collaboration email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('Resend API key not configured, skipping collaboration email');
    }

    console.log('User affiliation created successfully:', email);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `User ${invitedProfile.full_name || email} has been invited to collaborate` + (resendApiKey ? '' : ' (notification email not sent - configure RESEND_API_KEY)')
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in invite-user function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to invite user",
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
