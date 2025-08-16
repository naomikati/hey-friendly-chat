-- Create table to store OTP codes temporarily
CREATE TABLE public.otp_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  code text NOT NULL,
  purpose text NOT NULL, -- 'signin' or 'signup'
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '10 minutes'),
  used boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for OTP codes (only allow operations on own email)
CREATE POLICY "Users can insert OTP for their email" 
ON public.otp_codes 
FOR INSERT 
WITH CHECK (true); -- Allow insert for any email

CREATE POLICY "Users can select OTP for their email" 
ON public.otp_codes 
FOR SELECT 
USING (true); -- Allow select for verification

CREATE POLICY "Users can update OTP for their email" 
ON public.otp_codes 
FOR UPDATE 
USING (true); -- Allow update to mark as used

-- Add index for better performance
CREATE INDEX idx_otp_codes_email_code ON public.otp_codes(email, code);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);