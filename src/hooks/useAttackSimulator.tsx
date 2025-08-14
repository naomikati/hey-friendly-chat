import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface AttackSimulation {
  id: string;
  attack_type: string;
  attack_label: string;
  blocked: boolean;
  created_at: string;
}

export const useAttackSimulator = () => {
  const { user } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastResult, setLastResult] = useState<{ type: string; blocked: boolean; } | null>(null);

  const simulateAttack = async (attackType: string, attackLabel: string, onComplete?: () => void) => {
    if (!user || isSimulating) return;

    setIsSimulating(true);
    
    // Simulate detection time
    setTimeout(async () => {
      const blocked = Math.random() > 0.1; // 90% block rate
      
      try {
        const { error } = await supabase
          .from('attack_simulations')
          .insert([{
            user_id: user.id,
            attack_type: attackType,
            attack_label: attackLabel,
            blocked
          }]);

        if (error) throw error;

        setLastResult({
          type: attackLabel,
          blocked
        });

        onComplete?.();
      } catch (error) {
        console.error('Error saving attack simulation:', error);
      } finally {
        setIsSimulating(false);
      }
    }, 2000);
  };

  const getSimulationHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('attack_simulations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching simulation history:', error);
      return [];
    }
  };

  return {
    isSimulating,
    lastResult,
    simulateAttack,
    getSimulationHistory
  };
};