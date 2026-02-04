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
import { 
  Scale, 
  Shield, 
  Eye, 
  Leaf,
  Zap,
  Sparkles,
  Search,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
  const { dailyScanCount } = useScanStore();
  const { level, karma, totalXP } = useGamificationStore();
  const { user } = useUserStore();

  const isPremium = user?.isPremium ?? false;
  const scanLimit = isPremium ? 1000 : 10;
  const scansRemaining = scanLimit - dailyScanCount;

  const handleQuickAction = (action: string) => {
    toast.info(`${action} feature`, {
      description: 'This feature is coming soon! Use the main scanner above.',
    });
  };

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
            <span className="animate-pulse" aria-hidden="true">🟢</span>
            <span>AI Ethics Guardian Active</span>
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
            icon={<Zap className="w-5 h-5" aria-hidden="true" />}
            trend={{ value: 12, direction: 'up' }}
          />
          <StatsCard
            title="Karma"
            value={karma.toLocaleString()}
            icon={<Sparkles className="w-5 h-5" aria-hidden="true" />}
          />
          <StatsCard
            title="Scans Today"
            value={`${dailyScanCount}/${scanLimit}`}
            icon={<Search className="w-5 h-5" aria-hidden="true" />}
          />
          <StatsCard
            title="Ethics Rank"
            value={`#${Math.max(1, 1000 - level * 10)}`}
            icon={<Trophy className="w-5 h-5" aria-hidden="true" />}
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
            <Card 
              variant="ethics" 
              padding="sm" 
              interactive 
              className="text-center"
              onClick={() => handleQuickAction('Bias Check')}
              role="button"
              tabIndex={0}
              aria-label="Quick bias check scan"
            >
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Scale className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium">Bias Check</span>
              </CardContent>
            </Card>
            
            <Card 
              variant="ethics" 
              padding="sm" 
              interactive 
              className="text-center"
              onClick={() => handleQuickAction('Privacy Scan')}
              role="button"
              tabIndex={0}
              aria-label="Quick privacy scan"
            >
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="p-3 rounded-xl bg-neon-purple/10 text-neon-purple">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium">Privacy Scan</span>
              </CardContent>
            </Card>
            
            <Card 
              variant="ethics" 
              padding="sm" 
              interactive 
              className="text-center"
              onClick={() => handleQuickAction('Deepfake Check')}
              role="button"
              tabIndex={0}
              aria-label="Quick deepfake detection"
            >
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="p-3 rounded-xl bg-ethics-warning/10 text-ethics-warning">
                  <Eye className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium">Deepfake Check</span>
              </CardContent>
            </Card>
            
            <Card 
              variant="ethics" 
              padding="sm" 
              interactive 
              className="text-center"
              onClick={() => handleQuickAction('Eco Impact')}
              role="button"
              tabIndex={0}
              aria-label="Check environmental impact"
            >
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="p-3 rounded-xl bg-ethics-safe/10 text-ethics-safe">
                  <Leaf className="w-5 h-5" aria-hidden="true" />
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
