'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { PromptScanner } from '@/components/scanner/prompt-scanner';
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScanStore, useGamificationStore, useUserStore } from '@/store';
import { formatCompactNumber } from '@/lib/utils';

const ThreatPulse = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h4l3-6 4 12 3-6h4" />
  </svg>
);

export default function HomePage() {
  const { dailyScanCount } = useScanStore();
  const { level, karma, totalXP } = useGamificationStore();
  const { user } = useUserStore();

  const isPremium = user?.isPremium ?? false;
  const scanLimit = isPremium ? 1000 : 10;
  const riskIndex = Math.max(1, 100 - Math.floor((karma + level * 3) % 100));

  return (
    <MainLayout>
      <div className="space-y-10">
        {/* Command Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="neon" className="text-xs">MASTER CONSOLE</Badge>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <span className="animate-pulse">●</span>
              Live Threat Monitoring
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient">AuraScan Master Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl">
            One massive command surface for ethical risk detection, audit trails, and real-time prompt defense.
          </p>
        </motion.div>

        {/* Core Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <StatsCard
            title="Signal Score"
            value={formatCompactNumber(totalXP)}
            icon={<span className="text-xl">⚡</span>}
            trend={{ value: 12, direction: 'up' }}
          />
          <StatsCard
            title="Trust Index"
            value={karma.toLocaleString()}
            icon={<span className="text-xl">🛡️</span>}
          />
          <StatsCard
            title="Scans Today"
            value={`${dailyScanCount}/${scanLimit}`}
            icon={<span className="text-xl">🔎</span>}
          />
          <StatsCard
            title="Risk Index"
            value={`${riskIndex}`}
            icon={<span className="text-xl">⚠️</span>}
            trend={{ value: 3, direction: 'down' }}
          />
        </motion.div>

        {/* Unified Scan Console */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="neon" className="relative overflow-hidden">
            <div className="absolute inset-0 cyber-bg opacity-25" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <ThreatPulse />
                Live Ethics Scan Console
              </CardTitle>
              <p className="text-sm text-muted-foreground">Run full-spectrum audits on any prompt or model output.</p>
            </CardHeader>
            <CardContent className="relative">
              <PromptScanner />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Radar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Bias Exposure</span>
                <span className="text-amber-500 font-semibold">Medium</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Privacy Leakage</span>
                <span className="text-emerald-500 font-semibold">Low</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Toxicity Surface</span>
                <span className="text-amber-500 font-semibold">Medium</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Manipulation Risk</span>
                <span className="text-rose-500 font-semibold">Elevated</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Controls</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="default">Run Full Audit</Button>
              <Button variant="secondary">Start Continuous Monitor</Button>
              <Button variant="ghost">Export Compliance Report</Button>
              <div className="text-xs text-muted-foreground">
                Next scheduled sweep: 02:00 UTC · Status: Ready
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Vault</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Active Operator</span>
                <span className="font-medium">{user?.displayName || 'Anonymous'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auth Status</span>
                <span className="text-primary font-semibold">{user ? 'Verified' : 'Guest'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Account Tier</span>
                <span className="font-medium">{isPremium ? 'Premium' : 'Free'}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Every login is recorded to your audit ledger.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                'Prompt scan completed · Risk score 22',
                'Policy gate enabled · Sensitive data filter',
                'New login detected · MFA ready',
                'Compliance snapshot exported',
              ].map((entry) => (
                <div key={entry} className="flex items-center justify-between">
                  <span>{entry}</span>
                  <span className="text-xs text-muted-foreground">just now</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Firewall</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Prompt Injection Shield</span>
                <Badge variant="safe">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>PII Redaction</span>
                <Badge variant="safe">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Bias Drift Monitor</span>
                <Badge variant="warning">Calibrating</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Upsell (for free users) */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card variant="gamification" className="bg-gradient-to-r from-xp-gold/10 via-background to-xp-gold/10 border-xp-gold/30">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold">Upgrade the Command Stack</h3>
                  <p className="text-muted-foreground">Unlimited scans, advanced analytics, and enterprise audit trails.</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    <Badge variant="gold">1000+ Daily Scans</Badge>
                    <Badge variant="gold">Audit Ledger</Badge>
                    <Badge variant="gold">Team Command</Badge>
                    <Badge variant="gold">API Access</Badge>
                  </div>
                </div>
                <Button variant="xp" size="lg" className="whitespace-nowrap">
                  Upgrade · $2.99/mo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
