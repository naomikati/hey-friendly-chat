import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Play, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAttackSimulator } from "@/hooks/useAttackSimulator";

interface AttackSimulatorProps {
  onAttackSimulated: () => void;
}

export const AttackSimulator = ({ onAttackSimulated }: AttackSimulatorProps) => {
  const [selectedAttack, setSelectedAttack] = useState<string>("");
  const { isSimulating, lastResult, simulateAttack } = useAttackSimulator();
  const { toast } = useToast();

  const attackTypes = [
    { value: "spoofing", label: "Identity Spoofing Attack", description: "Simulate fake identity verification" },
    { value: "phishing", label: "Phishing Attempt", description: "Fake banking login page" },
    { value: "behavioral", label: "Behavioral Anomaly", description: "Unusual transaction patterns" },
    { value: "biometric", label: "Biometric Bypass", description: "Fake biometric data injection" },
    { value: "session", label: "Session Hijacking", description: "Unauthorized session takeover" }
  ];

  const handleSimulateAttack = () => {
    if (!selectedAttack) return;
    
    const attackType = attackTypes.find(a => a.value === selectedAttack);
    if (!attackType) return;
    
    simulateAttack(selectedAttack, attackType.label, () => {
      onAttackSimulated();
      
      toast({
        title: lastResult?.blocked ? "Attack Blocked!" : "Attack Detected!",
        description: `${attackType.label} was ${lastResult?.blocked ? 'successfully blocked' : 'detected but not blocked'}`,
        variant: lastResult?.blocked ? "default" : "destructive"
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Attack Simulation & Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Attack Type:</label>
            <Select value={selectedAttack} onValueChange={setSelectedAttack}>
              <SelectTrigger>
                <SelectValue placeholder="Choose attack to simulate" />
              </SelectTrigger>
              <SelectContent>
                {attackTypes.map((attack) => (
                  <SelectItem key={attack.value} value={attack.value}>
                    <div>
                      <div className="font-medium">{attack.label}</div>
                      <div className="text-xs text-muted-foreground">{attack.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Simulation Control:</label>
            <Button 
              onClick={handleSimulateAttack}
              disabled={!selectedAttack || isSimulating}
              className="w-full"
              variant={isSimulating ? "secondary" : "default"}
            >
              {isSimulating ? (
                <>
                  <StopCircle className="h-4 w-4 mr-2" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Launch Attack Simulation
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results Display */}
        {lastResult && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Last Simulation Result:</h4>
              <Badge variant={lastResult.blocked ? "default" : "destructive"}>
                {lastResult.blocked ? "BLOCKED" : "DETECTED"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {lastResult.blocked ? (
                <Shield className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <span>{lastResult.type}</span>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              {lastResult.blocked 
                ? "TrustGuard successfully identified and blocked the attack attempt."
                : "Attack was detected but requires manual intervention."
              }
            </p>
          </div>
        )}

        {/* Demo Instructions */}
        <div className="text-xs text-muted-foreground bg-accent/10 p-3 rounded">
          <p className="font-medium mb-1">Demo Instructions:</p>
          <ul className="space-y-1">
            <li>• Select different attack types to show system capabilities</li>
            <li>• Demonstrate real-time detection and blocking</li>
            <li>• Show how the system logs and responds to threats</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};