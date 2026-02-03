'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EthicsScoreBadge } from '@/components/ui/badge';
import { useARStore } from '@/store';
import { hapticFeedback, supportsWebXR, hasCamera } from '@/lib/utils';
import { AR_CONFIG } from '@/config';

// Icons
const CameraIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ScanFrameIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
    {/* Corner markers */}
    <path d="M0 20 L0 0 L20 0" className="text-neon-cyan" />
    <path d="M80 0 L100 0 L100 20" className="text-neon-cyan" />
    <path d="M100 80 L100 100 L80 100" className="text-neon-cyan" />
    <path d="M20 100 L0 100 L0 80" className="text-neon-cyan" />
  </svg>
);

interface ARLensProps {
  onClose?: () => void;
  onCapture?: (imageData: string, extractedText: string) => void;
  className?: string;
}

export const ARLens: React.FC<ARLensProps> = ({
  onClose,
  onCapture,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    score: number;
  }>>([]);

  const {
    setARActive,
    setARPermission,
    setARCapabilities,
    setCurrentARScan,
  } = useARStore();

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const hasCam = await hasCamera();
      const hasXR = await supportsWebXR();
      
      setARCapabilities({
        hasCamera: hasCam,
        hasWebXR: hasXR,
      });

      if (!hasCam) {
        setError('No camera detected on this device');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsInitialized(true);
        setARPermission(true);
        setARActive(true);
        hapticFeedback();
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError('Failed to access camera. Please grant camera permissions.');
      setARPermission(false);
    }
  }, [setARCapabilities, setARPermission, setARActive]);

  // Cleanup camera
  const cleanupCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setARActive(false);
    setIsInitialized(false);
  }, [setARActive]);

  // Capture and analyze frame
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    hapticFeedback();

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    // Simulate OCR and analysis (in production, use actual OCR service)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate detected text regions with ethics scores
    const simulatedBoxes = [
      {
        x: 0.1,
        y: 0.2,
        width: 0.3,
        height: 0.1,
        label: 'AI Generated Content',
        score: 65,
      },
      {
        x: 0.4,
        y: 0.5,
        width: 0.25,
        height: 0.15,
        label: 'Potential Bias',
        score: 45,
      },
    ];

    // Calculate overall score from detected regions
    const avgScore = simulatedBoxes.length > 0
      ? simulatedBoxes.reduce((sum, box) => sum + box.score, 0) / simulatedBoxes.length
      : 100;

    setBoundingBoxes(simulatedBoxes);
    setCurrentScore(avgScore);

    const extractedText = 'Simulated extracted text from AR scan';

    setCurrentARScan({
      imageData,
      extractedText,
      analysis: null,
    });

    onCapture?.(imageData, extractedText);
    setIsAnalyzing(false);

    // Clear bounding boxes after delay
    setTimeout(() => {
      setBoundingBoxes([]);
      setCurrentScore(null);
    }, 3000);
  }, [isAnalyzing, setCurrentARScan, onCapture]);

  // Real-time analysis loop
  useEffect(() => {
    if (!isInitialized) return;

    const intervalId = setInterval(() => {
      // Simulate real-time analysis every 500ms
      if (Math.random() > 0.7) {
        const score = 50 + Math.random() * 50;
        setCurrentScore(score);
      }
    }, AR_CONFIG.analysisInterval);

    return () => clearInterval(intervalId);
  }, [isInitialized]);

  // Initialize on mount
  useEffect(() => {
    initializeCamera();
    return cleanupCamera;
  }, [initializeCamera, cleanupCamera]);

  const handleClose = useCallback(() => {
    cleanupCamera();
    onClose?.();
  }, [cleanupCamera, onClose]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return AR_CONFIG.boundingBoxColors.safe;
    if (score >= 60) return AR_CONFIG.boundingBoxColors.warning;
    if (score >= 40) return AR_CONFIG.boundingBoxColors.danger;
    return AR_CONFIG.boundingBoxColors.critical;
  };

  return (
    <div className={cn('fixed inset-0 z-50 bg-black', className)}>
      {/* Video feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* AR Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scan frame */}
        <div className="absolute inset-8">
          <ScanFrameIcon />
        </div>

        {/* Scanning line animation */}
        {isAnalyzing && (
          <motion.div
            className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
            initial={{ top: '10%' }}
            animate={{ top: '90%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Bounding boxes for detected content */}
        <AnimatePresence>
          {boundingBoxes.map((box, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute border-2 rounded-lg"
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`,
                borderColor: getScoreColor(box.score),
                boxShadow: `0 0 10px ${getScoreColor(box.score)}`,
              }}
            >
              <div
                className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: getScoreColor(box.score) }}
              >
                {box.label} ({box.score}%)
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current score indicator */}
        {currentScore !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 left-1/2 -translate-x-1/2"
          >
            <EthicsScoreBadge score={currentScore} size="lg" />
          </motion.div>
        )}
      </div>

      {/* Controls overlay */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-auto">
        <div className="safe-area-inset-bottom bg-gradient-to-t from-black/80 to-transparent p-6">
          {/* Status */}
          <div className="text-center mb-4">
            <p className="text-white/80 text-sm">
              {isAnalyzing
                ? 'Analyzing content...'
                : isInitialized
                ? 'Point camera at AI-generated content'
                : 'Initializing camera...'}
            </p>
          </div>

          {/* Capture button */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <CloseIcon />
            </Button>

            <button
              onClick={captureFrame}
              disabled={!isInitialized || isAnalyzing}
              className={cn(
                'w-20 h-20 rounded-full border-4 border-white',
                'flex items-center justify-center',
                'transition-all duration-200',
                'disabled:opacity-50',
                isAnalyzing
                  ? 'bg-neon-cyan animate-pulse'
                  : 'bg-white/20 hover:bg-white/30 active:scale-95'
              )}
            >
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>

            <Button
              variant="ghost"
              size="icon-lg"
              className="text-white hover:bg-white/20 opacity-0 pointer-events-none"
            >
              {/* Placeholder for symmetry */}
            </Button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <div className="text-center p-6 max-w-sm">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-bold text-white mb-2">Camera Access Required</h3>
            <p className="text-white/70 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={initializeCamera}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AR Lens Launcher Button
interface ARLensButtonProps {
  className?: string;
}

export const ARLensButton: React.FC<ARLensButtonProps> = ({ className }) => {
  const [showLens, setShowLens] = useState(false);

  return (
    <>
      <Button
        variant="neon"
        size="lg"
        onClick={() => setShowLens(true)}
        leftIcon={<CameraIcon />}
        className={className}
      >
        AR Ethics Lens
      </Button>

      <AnimatePresence>
        {showLens && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ARLens onClose={() => setShowLens(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ARLens;
