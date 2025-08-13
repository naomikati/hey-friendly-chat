import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Shield, Clock } from "lucide-react";

interface ThreatLog {
  id: string;
  type: "spoofing" | "phishing" | "anomaly";
  severity: "low" | "medium" | "high";
  source: string;
  timestamp: Date;
  status: "detected" | "blocked" | "investigating";
}

interface ThreatMonitorProps {
  onAttackDetected: () => void;
}

export const ThreatMonitor = ({ onAttackDetected }: ThreatMonitorProps) => {
  const [threats, setThreats] = useState<ThreatLog[]>([
    {
      id: "1",
      type: "spoofing",
      severity: "high",
      source: "IP: 192.168.1.45",
      timestamp: new Date(Date.now() - 5 * 60000),
      status: "blocked"
    },
    {
      id: "2",
      type: "phishing",
      severity: "medium",
      source: "Email: fake@equity.com",
      timestamp: new Date(Date.now() - 15 * 60000),
      status: "detected"
    },
    {
      id: "3",
      type: "anomaly",
      severity: "low",
      source: "User: john.doe@equity.co.ke",
      timestamp: new Date(Date.now() - 30 * 60000),
      status: "investigating"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random threat detection
      if (Math.random() > 0.8) {
        const newThreat: ThreatLog = {
          id: Date.now().toString(),
          type: ["spoofing", "phishing", "anomaly"][Math.floor(Math.random() * 3)] as any,
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          source: `IP: 192.168.1.${Math.floor(Math.random() * 255)}`,
          timestamp: new Date(),
          status: "detected"
        };
        
        setThreats(prev => [newThreat, ...prev.slice(0, 9)]);
        onAttackDetected();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [onAttackDetected]);

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
                    {threat.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <Shield className="h-4 w-4 text-primary" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};