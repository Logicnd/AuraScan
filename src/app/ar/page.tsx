'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  Flashlight,
  FlipHorizontal,
  Settings,
  Share2,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Sparkles,
  Layers,
  Eye,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, EthicsScoreBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DetectedElement {
  id: string;
  type: 'text' | 'input' | 'button' | 'form' | 'modal';
  label: string;
  ethicsScore: number;
  issues: string[];
  position: { x: number; y: number; width: number; height: number };
}

export default function ARPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [detectedElements, setDetectedElements] = useState<DetectedElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<DetectedElement | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setHasPermission(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setDetectedElements([]);
    setOverallScore(null);
  }, []);

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const simulateScan = useCallback(() => {
    if (!isActive) return;

    setIsScanning(true);

    // Simulate AR detection with mock data
    setTimeout(() => {
      const mockElements: DetectedElement[] = [
        {
          id: '1',
          type: 'form',
          label: 'Data Collection Form',
          ethicsScore: 72,
          issues: ['Missing privacy notice', 'Optional consent checkbox'],
          position: { x: 10, y: 20, width: 40, height: 30 },
        },
        {
          id: '2',
          type: 'button',
          label: 'Submit Button',
          ethicsScore: 85,
          issues: ['Consider adding confirmation step'],
          position: { x: 55, y: 60, width: 35, height: 10 },
        },
        {
          id: '3',
          type: 'text',
          label: 'Terms of Service',
          ethicsScore: 45,
          issues: [
            'Readability score: Poor',
            'Contains dark patterns',
            'Hidden data sharing clause',
          ],
          position: { x: 5, y: 75, width: 90, height: 15 },
        },
      ];

      setDetectedElements(mockElements);
      setOverallScore(
        Math.round(
          mockElements.reduce((sum, el) => sum + el.ethicsScore, 0) /
            mockElements.length
        )
      );
      setIsScanning(false);

      if (isSoundOn) {
        // Play scan complete sound
        const audio = new Audio('/sounds/scan-complete.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }, 2000);
  }, [isActive, isSoundOn]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (isActive) {
      stopCamera();
      startCamera();
    }
  }, [facingMode]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-ethics-safe border-ethics-safe';
    if (score >= 60) return 'bg-ethics-warning border-ethics-warning';
    if (score >= 40) return 'bg-ethics-danger border-ethics-danger';
    return 'bg-ethics-critical border-ethics-critical';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        className={cn(
          'absolute inset-0 w-full h-full object-cover',
          !isActive && 'hidden'
        )}
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* AR Overlay */}
      {isActive && showOverlay && (
        <div className="absolute inset-0">
          {/* Scanning animation */}
          {isScanning && (
            <motion.div
              initial={{ top: 0 }}
              animate={{ top: '100%' }}
              transition={{ duration: 2, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
              style={{ boxShadow: '0 0 20px var(--primary)' }}
            />
          )}

          {/* Detected Elements */}
          <AnimatePresence>
            {detectedElements.map(element => (
              <motion.div
                key={element.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  'absolute border-2 rounded-lg cursor-pointer transition-all',
                  getScoreColor(element.ethicsScore),
                  selectedElement?.id === element.id
                    ? 'border-opacity-100 bg-opacity-30'
                    : 'border-opacity-60 bg-opacity-10'
                )}
                style={{
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  width: `${element.position.width}%`,
                  height: `${element.position.height}%`,
                }}
                onClick={() => setSelectedElement(element)}
              >
                {/* Score badge */}
                <div className="absolute -top-3 -right-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white',
                      element.ethicsScore >= 80
                        ? 'bg-ethics-safe'
                        : element.ethicsScore >= 60
                        ? 'bg-ethics-warning'
                        : element.ethicsScore >= 40
                        ? 'bg-ethics-danger'
                        : 'bg-ethics-critical'
                    )}
                  >
                    {element.ethicsScore}
                  </div>
                </div>

                {/* Label */}
                <div className="absolute -bottom-6 left-0 whitespace-nowrap">
                  <span className="px-2 py-0.5 bg-black/70 rounded text-xs text-white">
                    {element.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Viewfinder corners */}
          <div className="absolute inset-16 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary" />
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 safe-area-top">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="glass" size="sm">
              <X className="w-5 h-5" />
            </Button>
          </Link>

          {isActive && (
            <div className="flex items-center gap-2">
              {overallScore !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <EthicsScoreBadge score={overallScore} />
                </motion.div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsSoundOn(!isSoundOn)}
            >
              {isSoundOn ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setShowOverlay(!showOverlay)}
            >
              <Layers className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Selected Element Detail */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute left-4 right-4 bottom-40 safe-area-bottom"
          >
            <Card className="glass-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center text-white',
                      selectedElement.ethicsScore >= 80
                        ? 'bg-ethics-safe'
                        : selectedElement.ethicsScore >= 60
                        ? 'bg-ethics-warning'
                        : selectedElement.ethicsScore >= 40
                        ? 'bg-ethics-danger'
                        : 'bg-ethics-critical'
                    )}
                  >
                    {getScoreIcon(selectedElement.ethicsScore)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedElement.label}</h3>
                    <Badge variant="outline">{selectedElement.type}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedElement(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {selectedElement.issues.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Issues Detected:
                  </div>
                  {selectedElement.issues.map((issue, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <AlertTriangle className="w-4 h-4 text-ethics-warning flex-shrink-0 mt-0.5" />
                      {issue}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 safe-area-bottom">
        {/* Permission denied state */}
        {hasPermission === false && (
          <Card className="glass-card p-6 text-center mb-4">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Camera Access Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please allow camera access to use the AR Ethics Lens.
            </p>
            <Button variant="neon" onClick={startCamera}>
              Grant Access
            </Button>
          </Card>
        )}

        {/* Inactive state */}
        {hasPermission !== false && !isActive && (
          <div className="text-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50 mx-auto mb-4 flex items-center justify-center">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">AR Ethics Lens</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
              Point your camera at any UI to analyze its ethical design patterns in real-time.
            </p>
          </div>
        )}

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-4">
          {isActive && (
            <>
              <Button
                variant="glass"
                size="lg"
                className="w-14 h-14 rounded-full"
                onClick={toggleCamera}
              >
                <FlipHorizontal className="w-6 h-6" />
              </Button>

              <Button
                variant={isScanning ? 'default' : 'scan'}
                size="lg"
                className="w-20 h-20 rounded-full"
                onClick={simulateScan}
                disabled={isScanning}
              >
                {isScanning ? (
                  <div className="animate-spin">
                    <Sparkles className="w-8 h-8" />
                  </div>
                ) : (
                  <Eye className="w-8 h-8" />
                )}
              </Button>

              <Button
                variant="glass"
                size="lg"
                className="w-14 h-14 rounded-full"
                onClick={stopCamera}
              >
                <X className="w-6 h-6" />
              </Button>
            </>
          )}

          {!isActive && hasPermission !== false && (
            <Button
              variant="neon"
              size="lg"
              className="px-8"
              onClick={startCamera}
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Scanning
            </Button>
          )}
        </div>

        {/* Tips */}
        {isActive && !isScanning && detectedElements.length === 0 && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 text-white/80 text-sm">
              <Info className="w-4 h-4" />
              Tap the scan button to analyze the screen
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
