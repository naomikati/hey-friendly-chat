-- Create threats table for threat monitoring
CREATE TABLE public.threats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('spoofing', 'phishing', 'anomaly')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('detected', 'blocked', 'investigating')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attack_simulations table for attack simulator
CREATE TABLE public.attack_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attack_type TEXT NOT NULL,
  attack_label TEXT NOT NULL,
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create biometric_scans table for biometric authentication
CREATE TABLE public.biometric_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL CHECK (scan_type IN ('fingerprint', 'face', 'voice')),
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attack_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_scans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for threats
CREATE POLICY "Users can view their own threats" 
ON public.threats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own threats" 
ON public.threats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threats" 
ON public.threats 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for attack_simulations
CREATE POLICY "Users can view their own attack simulations" 
ON public.attack_simulations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attack simulations" 
ON public.attack_simulations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for biometric_scans
CREATE POLICY "Users can view their own biometric scans" 
ON public.biometric_scans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own biometric scans" 
ON public.biometric_scans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_threats_updated_at
BEFORE UPDATE ON public.threats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_threats_user_id ON public.threats(user_id);
CREATE INDEX idx_threats_created_at ON public.threats(created_at DESC);
CREATE INDEX idx_attack_simulations_user_id ON public.attack_simulations(user_id);
CREATE INDEX idx_biometric_scans_user_id ON public.biometric_scans(user_id);