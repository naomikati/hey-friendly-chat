import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Eye, Mic, CheckCircle, XCircle } from "lucide-react";
import { useBiometricScans } from "@/hooks/useBiometricScans";

export const BiometricPanel = () => {
  const { scanningStates, startScan } = useBiometricScans();
  const [fingerprintMatch, setFingerprintMatch] = useState<boolean | null>(null);
  const [faceMatch, setFaceMatch] = useState<boolean | null>(null);
  const [voiceMatch, setVoiceMatch] = useState<boolean | null>(null);

  const simulateFingerprint = async () => {
    setFingerprintMatch(null);
    startScan("fingerprint", 3000, 0.8).then((success) => {
      setFingerprintMatch(success);
    });
  };

  const simulateFaceRecognition = async () => {
    setFaceMatch(null);
    startScan("face", 2500, 0.85).then((success) => {
      setFaceMatch(success);
    });
  };

  const simulateVoiceRecognition = async () => {
    setVoiceMatch(null);
    startScan("voice", 4000, 0.75).then((success) => {
      setVoiceMatch(success);
    });
  };

  const getMatchIcon = (match: boolean | null) => {
    if (match === null) return null;
    return match ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-destructive" />;
  };

  const getMatchBadge = (match: boolean | null) => {
    if (match === null) return null;
    return (
      <Badge variant={match ? "default" : "destructive"}>
        {match ? "Verified" : "Failed"}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Biometric Authentication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fingerprint Authentication */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              <span className="font-medium">Fingerprint Scan</span>
              {getMatchIcon(fingerprintMatch)}
            </div>
            {getMatchBadge(fingerprintMatch)}
          </div>
          
          {scanningStates.fingerprint && (
            <div className="space-y-2">
              <Progress value={66} className="w-full" />
              <p className="text-sm text-muted-foreground">Scanning fingerprint...</p>
            </div>
          )}
          
          <Button 
            onClick={simulateFingerprint} 
            disabled={scanningStates.fingerprint}
            variant="outline"
            className="w-full"
          >
            {scanningStates.fingerprint ? "Scanning..." : "Start Fingerprint Scan"}
          </Button>
        </div>

        {/* Face Recognition */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="font-medium">Face Recognition</span>
              {getMatchIcon(faceMatch)}
            </div>
            {getMatchBadge(faceMatch)}
          </div>
          
          {scanningStates.face && (
            <div className="space-y-2">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground">Analyzing facial features...</p>
            </div>
          )}
          
          <Button 
            onClick={simulateFaceRecognition} 
            disabled={scanningStates.face}
            variant="outline"
            className="w-full"
          >
            {scanningStates.face ? "Analyzing..." : "Start Face Recognition"}
          </Button>
        </div>

        {/* Voice Recognition */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              <span className="font-medium">Voice Recognition</span>
              {getMatchIcon(voiceMatch)}
            </div>
            {getMatchBadge(voiceMatch)}
          </div>
          
          {scanningStates.voice && (
            <div className="space-y-2">
              <Progress value={50} className="w-full" />
              <p className="text-sm text-muted-foreground">Processing voice pattern...</p>
            </div>
          )}
          
          <Button 
            onClick={simulateVoiceRecognition} 
            disabled={scanningStates.voice}
            variant="outline"
            className="w-full"
          >
            {scanningStates.voice ? "Processing..." : "Start Voice Recognition"}
          </Button>
        </div>

        {/* Overall Status */}
        {(fingerprintMatch !== null || faceMatch !== null || voiceMatch !== null) && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-medium">Authentication Status:</span>
              <Badge variant={
                (fingerprintMatch && faceMatch && voiceMatch) ? "default" : 
                (fingerprintMatch || faceMatch || voiceMatch) ? "secondary" : "destructive"
              }>
                {(fingerprintMatch && faceMatch && voiceMatch) ? "Full Access" :
                 (fingerprintMatch || faceMatch || voiceMatch) ? "Partial Access" : "Access Denied"}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};