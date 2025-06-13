
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

    console.log('Inviting user:', email, 'with role:', role);

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    
    if (existingUser.user) {
      // User exists, just update their role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({
          user_id: existingUser.user.id,
          role: role
        });

      if (roleError) {
        throw new Error(`Failed to update user role: ${roleError.message}`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'User already exists, role updated successfully' 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create new user with invite
    const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: role,
        invited_by: inviterName || 'Admin'
      },
      redirectTo: `https://qpaomtgbpjxvnamtqhtv.supabase.co/auth/v1/verify`
    });

    if (inviteError) {
      throw new Error(`Failed to invite user: ${inviteError.message}`);
    }

    // Set the user role
    if (newUser.user) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: newUser.user.id,
          role: role
        });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        // Don't throw here as the user was created successfully
      }
    }

    // Send welcome email only if Resend API key is configured
    if (resendApiKey) {
      try {
        const { Resend } = await import("npm:resend@2.0.0");
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: "Content Engine <onboarding@resend.dev>",
          to: [email],
          subject: "Welcome to Content Engine!",
          html: `
            <h1>Welcome to Content Engine!</h1>
            <p>You've been invited to join Content Engine with the role of <strong>${role.replace('_', ' ')}</strong>.</p>
            <p>You should receive a separate email with your login credentials shortly.</p>
            <p>If you have any questions, please don't hesitate to reach out to your administrator.</p>
            <p>Best regards,<br>The Content Engine Team</p>
          `,
        });
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('Resend API key not configured, skipping welcome email');
    }

    console.log('User invited successfully:', email);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User invited successfully' + (resendApiKey ? '' : ' (welcome email not sent - configure RESEND_API_KEY)')
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
