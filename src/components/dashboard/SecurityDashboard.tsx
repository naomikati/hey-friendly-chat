import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users, Activity, Eye, Fingerprint } from "lucide-react";
import { ThreatMonitor } from "./ThreatMonitor";
import { AttackSimulator } from "./AttackSimulator";
import { BiometricPanel } from "./BiometricPanel";

export const SecurityDashboard = () => {
  const [threatLevel, setThreatLevel] = useState<"low" | "medium" | "high">("low");
  const [detectedAttacks, setDetectedAttacks] = useState(0);
  const [authenticatedUsers, setAuthenticatedUsers] = useState(247);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const handleAttackDetected = () => {
    setDetectedAttacks(prev => prev + 1);
    setThreatLevel("high");
    setTimeout(() => setThreatLevel("medium"), 3000);
  };

  const getThreatColor = () => {
    switch (threatLevel) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">TrustGuard Security Center</h1>
            <p className="text-muted-foreground">Equity Bank Thika - Anti-Spoofing Protection System</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getThreatColor()}>
              Threat Level: {threatLevel.toUpperCase()}
            </Badge>
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Detected Attacks</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{detectedAttacks}</div>
              <p className="text-xs text-muted-foreground">+2 from last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protected Users</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{authenticatedUsers}</div>
              <p className="text-xs text-muted-foreground">Active sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biometric Scans</CardTitle>
              <Fingerprint className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">1,234</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Operational</div>
              <p className="text-xs text-muted-foreground">99.9% uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatMonitor onAttackDetected={handleAttackDetected} />
          <BiometricPanel />
        </div>

        {/* Attack Simulator */}
        <AttackSimulator onAttackSimulated={handleAttackDetected} />
      </div>
    </div>
  );
};