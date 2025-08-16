import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  purpose: 'signin' | 'signup';
}

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, purpose }: SendOTPRequest = await req.json();

    if (!email || !purpose) {
      return new Response(
        JSON.stringify({ error: "Email and purpose are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate 6-digit OTP
    const otpCode = generateOTP();

    // Store OTP in database
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        email,
        code: otpCode,
        purpose,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
      });

    if (insertError) {
      console.error('Error storing OTP:', insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // For now, we'll log the OTP (in production, you'd send this via email service like Resend)
    console.log(`OTP for ${email}: ${otpCode}`);

    // In a real implementation, you would integrate with an email service here
    // For demo purposes, we'll just return success
    // You can integrate with Resend, SendGrid, or another email service

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully",
        // Remove this in production - only for demo
        otp: otpCode 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);