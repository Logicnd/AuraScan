'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, QuestCard, AchievementCard } from '@/components/ui/card';
import { XPProgress } from '@/components/ui/progress';
import { LevelBadge, StreakBadge, XPBadge, KarmaBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGamificationStore } from '@/store';
import { getLevelTier, formatCompactNumber } from '@/lib/utils';
import type { Quest, Achievement } from '@/types';

// Sample data for daily quests
const DAILY_QUESTS: Quest[] = [
  {
    id: 'dq-1',
    title: 'Bias Buster',
    description: 'Reduce bias in 3 prompts today',
    type: 'scan',
    category: 'bias',
    difficulty: 'easy',
    requirements: [{ type: 'bias_reduction', target: 3, current: 1, description: 'Reduce bias' }],
    rewards: { xp: 50, karma: 10 },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    progress: 1,
    maxProgress: 3,
    status: 'active',
    isDaily: true,
    isWeekly: false,
    isSeasonal: false,
  },
  {
    id: 'dq-2',
    title: 'Privacy Guardian',
    description: 'Scan 5 prompts for PII exposure',
    type: 'scan',
    category: 'privacy',
    difficulty: 'medium',
    requirements: [{ type: 'pii_scan', target: 5, current: 3, description: 'Scan for PII' }],
    rewards: { xp: 75, karma: 15 },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    progress: 3,
    maxProgress: 5,
    status: 'active',
    isDaily: true,
    isWeekly: false,
    isSeasonal: false,
  },
  {
    id: 'dq-3',
    title: 'Community Helper',
    description: 'Share one ethical template',
    type: 'social',
    category: 'general',
    difficulty: 'easy',
    requirements: [{ type: 'share_template', target: 1, current: 1, description: 'Share template' }],
    rewards: { xp: 30, karma: 25 },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    progress: 1,
    maxProgress: 1,
    status: 'completed',
    isDaily: true,
    isWeekly: false,
    isSeasonal: false,
  },
];

// Sample achievements
const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    name: 'First Steps',
    description: 'Complete your first ethics scan',
    iconUrl: '',
    category: 'scanning',
    tier: 'bronze',
    xpReward: 50,
    karmaReward: 10,
    progress: 1,
    maxProgress: 1,
    isSecret: false,
    unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ach-2',
    name: 'Bias Buster',
    description: 'Reduce bias in 100 prompts',
    iconUrl: '',
    category: 'bias-detection',
    tier: 'gold',
    xpReward: 500,
    karmaReward: 100,
    progress: 67,
    maxProgress: 100,
    isSecret: false,
  },
  {
    id: 'ach-3',
    name: 'Privacy Paladin',
    description: 'Detect 50 PII instances',
    iconUrl: '',
    category: 'privacy',
    tier: 'silver',
    xpReward: 200,
    karmaReward: 50,
    progress: 50,
    maxProgress: 50,
    isSecret: false,
    unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'ach-4',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    iconUrl: '',
    category: 'streaks',
    tier: 'bronze',
    xpReward: 100,
    karmaReward: 25,
    progress: 5,
    maxProgress: 7,
    isSecret: false,
  },
];

// User Stats Panel
interface UserStatsPanelProps {
  className?: string;
}

export const UserStatsPanel: React.FC<UserStatsPanelProps> = ({ className }) => {
  const {
    level,
    currentXP,
    xpToNextLevel,
    totalXP,
    karma,
    streakDays,
  } = useGamificationStore();

  const tier = getLevelTier(level);

  return (
    <Card variant="gamification" className={className}>
      <CardContent className="space-y-6">
        {/* Level and XP */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LevelBadge level={level} size="lg" showFire={streakDays >= 7} />
            <div>
              <h3 className="font-bold text-lg">{tier.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatCompactNumber(totalXP)} total XP
              </p>
            </div>
          </div>
          <StreakBadge days={streakDays} />
        </div>

        {/* XP Progress */}
        <XPProgress
          currentXP={currentXP}
          xpToNextLevel={xpToNextLevel}
          level={level}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-gradient">{level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-karma-positive">{karma}</p>
            <p className="text-xs text-muted-foreground">Karma</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-xp-gold">{streakDays}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Daily Quests Panel
interface DailyQuestsPanelProps {
  quests?: Quest[];
  className?: string;
}

export const DailyQuestsPanel: React.FC<DailyQuestsPanelProps> = ({
  quests = DAILY_QUESTS,
  className,
}) => {
  const { claimQuestReward } = useGamificationStore();

  const handleClaim = (questId: string) => {
    claimQuestReward(questId);
  };

  const completedCount = quests.filter(q => q.status === 'completed' || q.status === 'claimed').length;

  return (
    <Card variant="default" className={className}>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Daily Quests</h3>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{quests.length} completed
          </span>
        </div>

        <div className="space-y-3">
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              title={quest.title}
              description={quest.description}
              progress={quest.progress}
              maxProgress={quest.maxProgress}
              xpReward={quest.rewards.xp}
              karmaReward={quest.rewards.karma}
              difficulty={quest.difficulty}
              isCompleted={quest.status === 'completed'}
              onClaim={() => handleClaim(quest.id)}
            />
          ))}
        </div>

        <Button variant="outline" className="w-full">
          View All Quests
        </Button>
      </CardContent>
    </Card>
  );
};

// Achievements Panel
interface AchievementsPanelProps {
  achievements?: Achievement[];
  className?: string;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  achievements = SAMPLE_ACHIEVEMENTS,
  className,
}) => {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'scanning': return '🔍';
      case 'bias-detection': return '⚖️';
      case 'privacy': return '🛡️';
      case 'streaks': return '🔥';
      case 'community': return '🤝';
      case 'learning': return '📚';
      default: return '🏆';
    }
  };

  return (
    <Card variant="default" className={className}>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Achievements</h3>
          <span className="text-sm text-muted-foreground">
            {unlockedCount}/{achievements.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              name={achievement.name}
              description={achievement.description}
              icon={getAchievementIcon(achievement.category)}
              tier={achievement.tier}
              progress={achievement.progress}
              maxProgress={achievement.maxProgress}
              isUnlocked={!!achievement.unlockedAt}
              unlockedAt={achievement.unlockedAt}
            />
          ))}
        </div>

        <Button variant="outline" className="w-full">
          View All Achievements
        </Button>
      </CardContent>
    </Card>
  );
};

// Level Up Modal
interface LevelUpModalProps {
  newLevel: number;
  rewards: {
    xp: number;
    karma: number;
    badge?: { name: string; icon: string };
  };
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  rewards,
  onClose,
}) => {
  const tier = getLevelTier(newLevel);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Card variant="gamification" padding="lg" className="text-center overflow-hidden">
          {/* Confetti effect background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                animate={{
                  y: ['0%', '1000%'],
                  rotate: [0, 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          <CardContent className="space-y-6 relative z-10">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="text-6xl"
            >
              🎉
            </motion.div>

            <div>
              <h2 className="text-3xl font-bold text-gradient mb-2">Level Up!</h2>
              <p className="text-muted-foreground">
                You've reached {tier.name} status
              </p>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <LevelBadge level={newLevel} size="lg" />
            </motion.div>

            <div className="flex justify-center gap-4">
              <XPBadge amount={rewards.xp} isBonus />
              <KarmaBadge amount={rewards.karma} />
            </div>

            {rewards.badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-gradient-to-r from-xp-gold/20 to-transparent border border-xp-gold/50"
              >
                <div className="flex items-center gap-3 justify-center">
                  <span className="text-3xl">{rewards.badge.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold">New Badge Unlocked!</p>
                    <p className="text-sm text-muted-foreground">{rewards.badge.name}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <Button variant="ethics" size="lg" onClick={onClose} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Karma Event Toast
interface KarmaEventToastProps {
  amount: number;
  reason: string;
  type: 'earned' | 'spent';
}

export const KarmaEventToast: React.FC<KarmaEventToastProps> = ({
  amount,
  reason,
  type,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl shadow-lg',
        type === 'earned'
          ? 'bg-gradient-to-r from-karma-positive/20 to-karma-positive/5 border border-karma-positive/50'
          : 'bg-gradient-to-r from-karma-negative/20 to-karma-negative/5 border border-karma-negative/50'
      )}
    >
      <span className="text-2xl">{type === 'earned' ? '✨' : '💫'}</span>
      <div>
        <p className={cn(
          'font-bold',
          type === 'earned' ? 'text-karma-positive' : 'text-karma-negative'
        )}>
          {type === 'earned' ? '+' : '-'}{amount} Karma
        </p>
        <p className="text-sm text-muted-foreground">{reason}</p>
      </div>
    </motion.div>
  );
};

export default UserStatsPanel;
