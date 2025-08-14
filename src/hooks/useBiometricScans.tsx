import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface BiometricScan {
  id: string;
  scan_type: "fingerprint" | "face" | "voice";
  success: boolean;
  created_at: string;
}

export const useBiometricScans = () => {
  const { user } = useAuth();
  const [scanningStates, setScanningStates] = useState({
    fingerprint: false,
    face: false,
    voice: false
  });

  const recordScan = async (scanType: BiometricScan['scan_type'], success: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('biometric_scans')
        .insert([{
          user_id: user.id,
          scan_type: scanType,
          success
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording biometric scan:', error);
    }
  };

  const startScan = (scanType: BiometricScan['scan_type'], duration: number, successRate: number): Promise<boolean> => {
    setScanningStates(prev => ({ ...prev, [scanType]: true }));
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        const success = Math.random() > (1 - successRate);
        await recordScan(scanType, success);
        setScanningStates(prev => ({ ...prev, [scanType]: false }));
        resolve(success);
      }, duration);
    });
  };

  const getScanHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('biometric_scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching scan history:', error);
      return [];
    }
  };

  return {
    scanningStates,
    startScan,
    recordScan,
    getScanHistory
  };
};