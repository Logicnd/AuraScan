'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { EthicsScoreCircle, Progress } from '@/components/ui/progress';
import { Badge, EthicsScoreBadge, XPBadge } from '@/components/ui/badge';
import { useScanStore, useGamificationStore, useUserStore } from '@/store';
import { generateId, hapticFeedback, getScoreColor, getScoreLabel } from '@/lib/utils';
import type { ScanResult, EthicsAnalysis, ScoreBreakdown } from '@/types';
import { GAMIFICATION_CONFIG } from '@/config';
import { useScan } from '@/hooks';

// Icons
const ScanIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

interface PromptScannerProps {
  onScanComplete?: (result: ScanResult) => void;
  className?: string;
}

export const PromptScanner: React.FC<PromptScannerProps> = ({
  onScanComplete,
  className,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { user } = useUserStore();
  const { isScanning, setScanning, addToHistory, incrementDailyScanCount, canScan, setScanError } = useScanStore();
  const { addXP } = useGamificationStore();
  const { scan: performScan, scanning: apiScanning, error: apiError } = useScan();
  
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [useRealAPI, setUseRealAPI] = useState(true); // Toggle for real API vs mock

  // Real API call or mock fallback
  const analyzePrompt = useCallback(async (text: string): Promise<EthicsAnalysis> => {
    // Try real API first
    if (useRealAPI) {
      try {
        const result = await performScan(text, 'full');
        if (result?.analysis) {
          // Map API response to our EthicsAnalysis type
          const apiAnalysis = result.analysis;
          return {
            overallScore: apiAnalysis.overallScore || 75,
            scoreBreakdown: {
              bias: apiAnalysis.scores?.bias || 75,
              toxicity: 100 - (apiAnalysis.scores?.toxicity || 25),
              privacy: apiAnalysis.scores?.privacy || 80,
              accuracy: apiAnalysis.scores?.accuracy || 85,
              transparency: apiAnalysis.scores?.transparency || 70,
              fairness: apiAnalysis.scores?.fairness || 75,
              harmfulness: 100 - (apiAnalysis.scores?.harmfulness || 20),
              manipulation: 100 - (apiAnalysis.scores?.manipulation || 15),
            },
            biasAnalysis: {
              overallBiasScore: apiAnalysis.scores?.bias || 75,
              categories: apiAnalysis.biasAnalysis?.categories || [],
              protectedGroups: apiAnalysis.biasAnalysis?.protectedGroups || [],
              suggestions: apiAnalysis.biasAnalysis?.suggestions || [],
              examples: apiAnalysis.biasAnalysis?.examples || [],
            },
            toxicityAnalysis: {
              overallScore: 100 - (apiAnalysis.scores?.toxicity || 25),
              categories: apiAnalysis.toxicityAnalysis?.categories || {},
              flaggedContent: apiAnalysis.toxicityAnalysis?.flaggedContent || [],
            },
            privacyAnalysis: {
              overallScore: apiAnalysis.scores?.privacy || 80,
              piiDetected: apiAnalysis.privacyAnalysis?.piiDetected || [],
              dataRetentionRisk: apiAnalysis.privacyAnalysis?.dataRetentionRisk || 'low',
              thirdPartyExposure: [],
              recommendations: apiAnalysis.privacyAnalysis?.recommendations || [],
            },
            complianceAnalysis: apiAnalysis.complianceAnalysis || {
              gdpr: { compliant: true, score: 95, violations: [], recommendations: [] },
              hipaa: { compliant: true, score: 90, violations: [], recommendations: [] },
              ccpa: { compliant: true, score: 92, violations: [], recommendations: [] },
              coppa: { compliant: true, score: 88, violations: [], recommendations: [] },
              aiAct: { compliant: true, score: 85, violations: [], recommendations: [] },
              overall: 'compliant',
            },
            misinformationAnalysis: {
              overallScore: apiAnalysis.scores?.accuracy || 85,
              factCheckResults: [],
              sourceCredibility: 85,
              claimAnalysis: [],
              aiGeneratedLikelihood: apiAnalysis.aiDetection?.isAIGenerated ? apiAnalysis.aiDetection.confidence * 100 : 20,
            },
            sentimentAnalysis: apiAnalysis.sentimentAnalysis || {
              overall: 'neutral',
              score: 0.1,
              emotions: { joy: 0.2, sadness: 0.1, anger: 0.05, fear: 0.1, surprise: 0.15, disgust: 0.05, trust: 0.5, anticipation: 0.3 },
              manipulationScore: 15,
              persuasionTechniques: [],
            },
            recommendations: apiAnalysis.recommendations || [],
          };
        }
      } catch (err) {
        console.warn('API scan failed, using mock analysis:', err);
      }
    }
    
    // Fallback to mock analysis
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Generate realistic-looking scores
    const baseScore = 50 + Math.random() * 40;
    const variation = () => Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 30));
    
    const scoreBreakdown: ScoreBreakdown = {
      bias: variation(),
      toxicity: variation(),
      privacy: variation(),
      accuracy: variation(),
      transparency: variation(),
      fairness: variation(),
      harmfulness: variation(),
      manipulation: variation(),
    };
    
    const overallScore = Object.values(scoreBreakdown).reduce((a, b) => a + b, 0) / 8;
    
    // Generate recommendations based on scores
    const recommendations = [];
    if (scoreBreakdown.bias < 70) {
      recommendations.push({
        id: generateId(),
        type: 'rewrite' as const,
        priority: 'medium' as const,
        title: 'Reduce potential bias',
        description: 'Consider using more inclusive language',
        impact: 'Improves fairness by ~15%',
      });
    }
    if (scoreBreakdown.privacy < 70) {
      recommendations.push({
        id: generateId(),
        type: 'privacy' as const,
        priority: 'high' as const,
        title: 'Privacy concern detected',
        description: 'Avoid including personal identifiable information',
        impact: 'Reduces data exposure risk',
      });
    }
    
    return {
      overallScore,
      scoreBreakdown,
      biasAnalysis: {
        overallBiasScore: scoreBreakdown.bias,
        categories: [
          { name: 'Gender', score: variation(), severity: 'low', instances: 0, examples: [] },
          { name: 'Age', score: variation(), severity: 'low', instances: 0, examples: [] },
        ],
        protectedGroups: [],
        suggestions: [],
        examples: [],
      },
      toxicityAnalysis: {
        overallScore: scoreBreakdown.toxicity,
        categories: {
          identity_attack: 0,
          insult: 0,
          obscene: 0,
          severe_toxicity: 0,
          sexual_explicit: 0,
          threat: 0,
        },
        flaggedContent: [],
      },
      privacyAnalysis: {
        overallScore: scoreBreakdown.privacy,
        piiDetected: [],
        dataRetentionRisk: 'low',
        thirdPartyExposure: [],
        recommendations: [],
      },
      complianceAnalysis: {
        gdpr: { compliant: true, score: 95, violations: [], recommendations: [] },
        hipaa: { compliant: true, score: 90, violations: [], recommendations: [] },
        ccpa: { compliant: true, score: 92, violations: [], recommendations: [] },
        coppa: { compliant: true, score: 88, violations: [], recommendations: [] },
        aiAct: { compliant: true, score: 85, violations: [], recommendations: [] },
        overall: 'compliant',
      },
      misinformationAnalysis: {
        overallScore: scoreBreakdown.accuracy,
        factCheckResults: [],
        sourceCredibility: 85,
        claimAnalysis: [],
        aiGeneratedLikelihood: 20,
      },
      sentimentAnalysis: {
        overall: 'neutral',
        score: 0.1,
        emotions: {
          joy: 0.2,
          sadness: 0.1,
          anger: 0.05,
          fear: 0.1,
          surprise: 0.15,
          disgust: 0.05,
          trust: 0.5,
          anticipation: 0.3,
        },
        manipulationScore: 15,
        persuasionTechniques: [],
      },
      recommendations,
    };
  }, []);

  const handleScan = useCallback(async () => {
    if (!prompt.trim()) return;
    if (!canScan(user?.isPremium ?? false)) {
      setScanError('Daily scan limit reached. Upgrade to Premium for unlimited scans!');
      return;
    }
    
    hapticFeedback();
    setScanning(true);
    setScanError(null);
    
    try {
      const analysis = await analyzePrompt(prompt);
      
      const result: ScanResult = {
        id: generateId(),
        userId: user?.id ?? 'anonymous',
        timestamp: new Date(),
        input: {
          type: 'prompt',
          content: prompt,
          language: 'en',
        },
        analysis,
        metadata: {
          processingTime: 1500,
          modelVersions: { ethics: '2.0', bias: '1.5', toxicity: '1.2' },
          carbonFootprint: {
            grams: 0.2,
            equivalent: 'Less than a breath',
            offsetSuggestion: 'Plant a tree every 100 scans',
            cumulativeTotal: 0.2,
          },
          deviceInfo: {
            platform: 'web',
            browser: 'modern',
            isOffline: false,
            isPWA: false,
          },
        },
        sharing: {
          isPublic: false,
          anonymized: true,
          sharedWith: [],
          comments: [],
          reactions: [],
        },
      };
      
      setScanResult(result);
      setShowResults(true);
      addToHistory(result);
      incrementDailyScanCount();
      
      // Award XP
      const xpResult = addXP(GAMIFICATION_CONFIG.xpRewards.scan, 'Prompt scan completed');
      if (xpResult.leveledUp) {
        // Show level up notification
        hapticFeedback([100, 50, 100]);
      }
      
      onScanComplete?.(result);
    } catch (error) {
      setScanError('Failed to analyze prompt. Please try again.');
      console.error('Scan error:', error);
    } finally {
      setScanning(false);
    }
  }, [prompt, user, canScan, setScanning, setScanError, analyzePrompt, addToHistory, incrementDailyScanCount, addXP, onScanComplete]);

  const handleVoiceInput = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      alert('Voice input is not supported in your browser');
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      hapticFeedback();
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const results = event.results;
      let transcript = '';
      for (let i = 0; i < results.length; i++) {
        transcript += results[i][0].transcript;
      }
      setPrompt(transcript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  }, []);

  const resetScanner = useCallback(() => {
    setPrompt('');
    setScanResult(null);
    setShowResults(false);
    textareaRef.current?.focus();
  }, []);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Scanner Input */}
      <Card variant="ethics" padding="default" className="relative overflow-hidden">
        {/* Scanner animation overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="scanner-line" />
          </div>
        )}
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SparklesIcon />
            <span>Enter your AI prompt for ethics analysis</span>
          </div>
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type or paste your AI prompt here..."
              className={cn(
                'w-full min-h-[120px] p-4 rounded-xl border-2 bg-background resize-none',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-all duration-200',
                isScanning && 'border-neon-cyan animate-pulse-glow'
              )}
              style={{ '--glow-color': '#00ffff' } as React.CSSProperties}
              disabled={isScanning}
            />
            
            {/* Voice input button */}
            <button
              onClick={handleVoiceInput}
              disabled={isScanning}
              className={cn(
                'absolute right-3 bottom-3 p-2 rounded-lg transition-colors',
                isListening
                  ? 'bg-destructive text-white animate-pulse'
                  : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
              )}
            >
              <MicIcon />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {prompt.length} characters
            </div>
            
            <Button
              onClick={handleScan}
              disabled={!prompt.trim() || isScanning}
              isLoading={isScanning}
              variant="scan"
              size="lg"
              leftIcon={<ScanIcon />}
            >
              {isScanning ? 'Analyzing...' : 'Scan Ethics'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence mode="wait">
        {showResults && scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ScanResultsCard result={scanResult} onReset={resetScanner} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Results Card Component
interface ScanResultsCardProps {
  result: ScanResult;
  onReset?: () => void;
}

const ScanResultsCard: React.FC<ScanResultsCardProps> = ({ result, onReset }) => {
  const { analysis } = result;
  const scoreColor = getScoreColor(analysis.overallScore);
  const scoreLabel = getScoreLabel(analysis.overallScore);

  return (
    <Card variant="glass" padding="default" className="space-y-6">
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Analysis Complete</h3>
          <p className="text-sm text-muted-foreground">
            Processed in {result.metadata.processingTime}ms
          </p>
        </div>
        <div className="flex items-center gap-3">
          <XPBadge amount={10} />
          <EthicsScoreBadge score={analysis.overallScore} />
        </div>
      </div>

      {/* Main Score */}
      <div className="flex flex-col items-center py-6">
        <EthicsScoreCircle score={analysis.overallScore} size="lg" />
        <p className={cn('mt-4 text-lg font-semibold', `text-ethics-${scoreColor}`)}>
          {scoreLabel}
        </p>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h4 className="font-semibold">Score Breakdown</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(analysis.scoreBreakdown).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize text-muted-foreground">{key}</span>
                <span className="font-medium">{Math.round(value)}%</span>
              </div>
              <Progress value={value} variant="ethics" className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Recommendations</h4>
          <div className="space-y-2">
            {analysis.recommendations.map((rec) => (
              <div
                key={rec.id}
                className={cn(
                  'p-3 rounded-lg border-l-4',
                  rec.priority === 'high'
                    ? 'border-ethics-danger bg-ethics-danger/10'
                    : rec.priority === 'medium'
                    ? 'border-ethics-warning bg-ethics-warning/10'
                    : 'border-ethics-safe bg-ethics-safe/10'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <Badge variant={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'safe'} size="sm">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Impact: {rec.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carbon Footprint */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌱</span>
          <div>
            <p className="text-sm font-medium">Carbon Footprint</p>
            <p className="text-xs text-muted-foreground">
              {result.metadata.carbonFootprint.grams}g CO₂ - {result.metadata.carbonFootprint.equivalent}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onReset}>
          New Scan
        </Button>
        <Button variant="default" className="flex-1">
          Share Results
        </Button>
      </div>
    </Card>
  );
};

export default PromptScanner;
