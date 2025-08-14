import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ThreatLog {
  id: string;
  type: "spoofing" | "phishing" | "anomaly";
  severity: "low" | "medium" | "high";
  source: string;
  status: "detected" | "blocked" | "investigating";
  created_at: string;
  updated_at: string;
}

export const useThreats = () => {
  const { user } = useAuth();
  const [threats, setThreats] = useState<ThreatLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('threats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setThreats((data || []) as ThreatLog[]);
    } catch (error) {
      console.error('Error fetching threats:', error);
    } finally {
      setLoading(false);
    }
  };

  const addThreat = async (threat: Omit<ThreatLog, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('threats')
        .insert([{
          ...threat,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setThreats(prev => [data as ThreatLog, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Error adding threat:', error);
    }
  };

  const updateThreatStatus = async (id: string, status: ThreatLog['status']) => {
    try {
      const { error } = await supabase
        .from('threats')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setThreats(prev => 
        prev.map(threat => 
          threat.id === id ? { ...threat, status } : threat
        )
      );
    } catch (error) {
      console.error('Error updating threat status:', error);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, [user]);

  return {
    threats,
    loading,
    addThreat,
    updateThreatStatus,
    refetch: fetchThreats
  };
};