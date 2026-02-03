'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { PromptScanner } from '@/components/scanner/prompt-scanner';
import { ARLensButton } from '@/components/ar/ar-lens';
import { UserStatsPanel, DailyQuestsPanel } from '@/components/gamification/user-stats';
import { Card, CardContent, StatsCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScanStore, useGamificationStore, useUserStore } from '@/store';
import { formatCompactNumber } from '@/lib/utils';

// Quick action icons
const BiasIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const PrivacyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const DeepfakeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EcoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function HomePage() {
  const { dailyScanCount } = useScanStore();
  const { level, karma, totalXP } = useGamificationStore();
  const { user } = useUserStore();

  const isPremium = user?.isPremium ?? false;
  const scanLimit = isPremium ? 1000 : 10;
  const scansRemaining = scanLimit - dailyScanCount;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="animate-pulse">🟢</span>
            AI Ethics Guardian Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
            Your AI's Conscience
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Analyze prompts for bias, privacy risks, and ethical concerns. 
            Earn XP and level up your ethics game.
          </p>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <StatsCard
            title="Total XP"
            value={formatCompactNumber(totalXP)}
            icon={<span className="text-xl">⚡</span>}
            trend={{ value: 12, direction: 'up' }}
          />
          <StatsCard
            title="Karma"
            value={karma.toLocaleString()}
            icon={<span className="text-xl">✨</span>}
          />
          <StatsCard
            title="Scans Today"
            value={`${dailyScanCount}/${scanLimit}`}
            icon={<span className="text-xl">🔍</span>}
          />
          <StatsCard
            title="Ethics Rank"
            value={`#${Math.max(1, 1000 - level * 10)}`}
            icon={<span className="text-xl">🏆</span>}
            trend={{ value: 5, direction: 'up' }}
          />
        </motion.div>

        {/* Main Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PromptScanner />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card variant="ethics" padding="sm" interactive className="text-center">
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <BiasIcon />
                </div>
                <span className="text-sm font-medium">Bias Check</span>
              </CardContent>
            </Card>
            
            <Card variant="ethics" padding="sm" interactive className="text-center">
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="p-3 rounded-xl bg-neon-purple/10 text-neon-purple">
                  <PrivacyIcon />
                </div>
                <span className="text-sm font-medium">Privacy Scan</span>
              </CardContent>
            </Card>
            
            <Card variant="ethics" padding="sm" interactive className="text-center">
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="p-3 rounded-xl bg-ethics-warning/10 text-ethics-warning">
                  <DeepfakeIcon />
                </div>
                <span className="text-sm font-medium">Deepfake Check</span>
              </CardContent>
            </Card>
            
            <Card variant="ethics" padding="sm" interactive className="text-center">
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="p-3 rounded-xl bg-ethics-safe/10 text-ethics-safe">
                  <EcoIcon />
                </div>
                <span className="text-sm font-medium">Eco Impact</span>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* AR Lens CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="neon" padding="default" className="relative overflow-hidden">
            <div className="absolute inset-0 cyber-bg opacity-30" />
            <CardContent className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <Badge variant="neon" className="mb-2">NEW</Badge>
                <h3 className="text-lg font-bold">AR Ethics Lens</h3>
                <p className="text-sm text-muted-foreground">
                  Point your camera at any screen to analyze AI content in real-time
                </p>
              </div>
              <ARLensButton />
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <UserStatsPanel />
          </motion.div>

          {/* Daily Quests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <DailyQuestsPanel />
          </motion.div>
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
                  <h3 className="text-xl font-bold">Unlock Your Full Potential</h3>
                  <p className="text-muted-foreground">
                    Get unlimited scans, advanced analytics, and exclusive features
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    <Badge variant="gold">1000+ Daily Scans</Badge>
                    <Badge variant="gold">Deep Ethics Mode</Badge>
                    <Badge variant="gold">Team Dashboard</Badge>
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

        {/* Ethics Commitment Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-8 border-t"
        >
          <p className="text-sm text-muted-foreground">
            🌱 20% of premium revenue goes to AI ethics research grants
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>No Ads</span>
            <span>•</span>
            <span>No Data Selling</span>
            <span>•</span>
            <span>Transparent Pricing</span>
            <span>•</span>
            <span>One-Click Cancel</span>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
