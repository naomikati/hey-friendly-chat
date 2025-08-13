import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Eye, Mic, CheckCircle, XCircle } from "lucide-react";

export const BiometricPanel = () => {
  const [scanningFingerprint, setScanningFingerprint] = useState(false);
  const [scanningFace, setScanningFace] = useState(false);
  const [scanningVoice, setScanningVoice] = useState(false);
  const [fingerprintMatch, setFingerprintMatch] = useState<boolean | null>(null);
  const [faceMatch, setFaceMatch] = useState<boolean | null>(null);
  const [voiceMatch, setVoiceMatch] = useState<boolean | null>(null);

  const simulateFingerprint = () => {
    setScanningFingerprint(true);
    setFingerprintMatch(null);
    
    setTimeout(() => {
      setScanningFingerprint(false);
      setFingerprintMatch(Math.random() > 0.2); // 80% success rate
    }, 3000);
  };

  const simulateFaceRecognition = () => {
    setScanningFace(true);
    setFaceMatch(null);
    
    setTimeout(() => {
      setScanningFace(false);
      setFaceMatch(Math.random() > 0.15); // 85% success rate
    }, 2500);
  };

  const simulateVoiceRecognition = () => {
    setScanningVoice(true);
    setVoiceMatch(null);
    
    setTimeout(() => {
      setScanningVoice(false);
      setVoiceMatch(Math.random() > 0.25); // 75% success rate
    }, 4000);
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
          
          {scanningFingerprint && (
            <div className="space-y-2">
              <Progress value={66} className="w-full" />
              <p className="text-sm text-muted-foreground">Scanning fingerprint...</p>
            </div>
          )}
          
          <Button 
            onClick={simulateFingerprint} 
            disabled={scanningFingerprint}
            variant="outline"
            className="w-full"
          >
            {scanningFingerprint ? "Scanning..." : "Start Fingerprint Scan"}
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
          
          {scanningFace && (
            <div className="space-y-2">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground">Analyzing facial features...</p>
            </div>
          )}
          
          <Button 
            onClick={simulateFaceRecognition} 
            disabled={scanningFace}
            variant="outline"
            className="w-full"
          >
            {scanningFace ? "Analyzing..." : "Start Face Recognition"}
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
          
          {scanningVoice && (
            <div className="space-y-2">
              <Progress value={50} className="w-full" />
              <p className="text-sm text-muted-foreground">Processing voice pattern...</p>
            </div>
          )}
          
          <Button 
            onClick={simulateVoiceRecognition} 
            disabled={scanningVoice}
            variant="outline"
            className="w-full"
          >
            {scanningVoice ? "Processing..." : "Start Voice Recognition"}
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