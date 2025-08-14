import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Shield, Clock } from "lucide-react";
import { useThreats } from "@/hooks/useThreats";

interface ThreatMonitorProps {
  onAttackDetected: () => void;
}

export const ThreatMonitor = ({ onAttackDetected }: ThreatMonitorProps) => {
  const { threats, loading, addThreat } = useThreats();

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random threat detection
      if (Math.random() > 0.8) {
        const threatTypes = ["spoofing", "phishing", "anomaly"] as const;
        const severityLevels = ["low", "medium", "high"] as const;
        
        const newThreat = {
          type: threatTypes[Math.floor(Math.random() * 3)],
          severity: severityLevels[Math.floor(Math.random() * 3)],
          source: `IP: 192.168.1.${Math.floor(Math.random() * 255)}`,
          status: "detected" as const
        };
        
        addThreat(newThreat);
        onAttackDetected();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [onAttackDetected, addThreat]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked": return "default";
      case "detected": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Real-Time Threat Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading threats...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {threats.map((threat) => (
                <div key={threat.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(threat.severity)}>
                        {threat.type.toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusColor(threat.status)}>
                        {threat.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{threat.source}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(threat.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <Shield className="h-4 w-4 text-primary" />
                </div>
              ))}
              {threats.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No threats detected yet
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};