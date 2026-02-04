import { redirect } from 'next/navigation';

export default function LeaderboardPage() {
  redirect('/');
}
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Globe,
  MapPin,
  Calendar,
  ChevronRight,
  Sparkles,
  Shield,
  Flame,
  Zap,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, LevelBadge, KarmaBadge, XPBadge } from '@/components/ui/badge';
import { cn, formatXP } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  user: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    karma: number;
    totalXP: number;
    streak: number;
    isVerified: boolean;
    country?: string;
    guild?: string;
  };
  stats: {
    scansThisPeriod: number;
    avgEthicsScore: number;
    karmaEarned: number;
    achievementsUnlocked: number;
  };
}

const generateMockLeaderboard = (count: number = 100): LeaderboardEntry[] => {
  const names = [
    'Sarah Chen', 'Alex Rivera', 'Dr. Emily Park', 'Marcus Johnson',
    'Team Nexus', 'Aisha Patel', 'Kai Tanaka', 'Maria Santos',
    'James Wilson', 'Priya Sharma', 'Lucas Kim', 'Emma Thompson',
    'Omar Hassan', 'Sofia Andersson', 'Wei Chen', 'Isabella Costa',
  ];
  const avatars = ['👩‍💻', '🧑‍🔬', '👩‍⚕️', '👨‍🎓', '🚀', '👩‍🔬', '🧑‍💼', '👨‍💻', '🧑‍🏫', '👩‍🎨', '🧑‍🚀', '👨‍🔧'];
  const guilds = ['Ethics Guardians', 'Code Conscience', 'AI Alignment', 'Fairness First', 'Privacy Pioneers'];
  const countries = ['🇺🇸', '🇬🇧', '🇯🇵', '🇩🇪', '🇧🇷', '🇮🇳', '🇰🇷', '🇫🇷', '🇨🇦', '🇦🇺'];

  return Array.from({ length: count }, (_, i) => {
    const rank = i + 1;
    const previousRank = rank + Math.floor(Math.random() * 10) - 5;
    const baseXP = Math.max(0, 500000 - rank * 4500 + Math.random() * 2000);
    
    return {
      rank,
      previousRank: Math.max(1, previousRank),
      user: {
        id: `user-${i}`,
        name: names[i % names.length],
        avatar: avatars[i % avatars.length],
        level: Math.max(1, Math.floor(90 - rank * 0.8 + Math.random() * 10)),
        karma: Math.floor(baseXP * 0.3),
        totalXP: Math.floor(baseXP),
        streak: Math.floor(Math.random() * 365),
        isVerified: rank <= 20 || Math.random() > 0.7,
        country: countries[i % countries.length],
        guild: rank <= 50 ? guilds[i % guilds.length] : undefined,
      },
      stats: {
        scansThisPeriod: Math.floor(500 - rank * 4 + Math.random() * 100),
        avgEthicsScore: Math.floor(75 + Math.random() * 24),
        karmaEarned: Math.floor(baseXP * 0.1),
        achievementsUnlocked: Math.floor(50 - rank * 0.4 + Math.random() * 10),
      },
    };
  });
};

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'allTime';
type LeaderboardType = 'global' | 'country' | 'guild' | 'friends';

const periods = [
  { value: 'daily', label: 'Today', icon: <Zap className="w-4 h-4" /> },
  { value: 'weekly', label: 'This Week', icon: <Calendar className="w-4 h-4" /> },
  { value: 'monthly', label: 'This Month', icon: <Calendar className="w-4 h-4" /> },
  { value: 'allTime', label: 'All Time', icon: <Trophy className="w-4 h-4" /> },
];

const types = [
  { value: 'global', label: 'Global', icon: <Globe className="w-4 h-4" /> },
  { value: 'country', label: 'Country', icon: <MapPin className="w-4 h-4" /> },
  { value: 'guild', label: 'Guild', icon: <Shield className="w-4 h-4" /> },
  { value: 'friends', label: 'Friends', icon: <Users className="w-4 h-4" /> },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [type, setType] = useState<LeaderboardType>('global');
  const [leaderboard] = useState(() => generateMockLeaderboard());

  // Current user's position (simulated)
  const currentUserRank = 42;

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-xp-gold to-xp-gold/70">
                Leaderboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Compete with ethical AI enthusiasts worldwide
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-xp-gold/20 to-xp-gold/5 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-xp-gold" />
            </div>
          </div>

          {/* Period Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {periods.map(p => (
              <Button
                key={p.value}
                variant={period === p.value ? 'xp' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(p.value as LeaderboardPeriod)}
                className="flex-shrink-0"
              >
                {p.icon}
                <span className="ml-1.5">{p.label}</span>
              </Button>
            ))}
          </div>

          {/* Type Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {types.map(t => (
              <Button
                key={t.value}
                variant={type === t.value ? 'neon' : 'ghost'}
                size="sm"
                onClick={() => setType(t.value as LeaderboardType)}
                className="flex-shrink-0"
              >
                {t.icon}
                <span className="ml-1.5">{t.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Your Position Banner */}
      <div className="px-4 py-4">
        <Card className="glass-card p-4 border-primary/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Your Position</div>
                <div className="text-2xl font-bold">#{currentUserRank}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">To reach #41</div>
              <div className="text-lg font-semibold text-primary">+2,450 XP</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top 3 Podium */}
      <div className="px-4 py-4">
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <PodiumCard entry={topThree[1]} position={2} />
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center -mt-8"
          >
            <PodiumCard entry={topThree[0]} position={1} />
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <PodiumCard entry={topThree[2]} position={3} />
          </motion.div>
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="px-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {rest.map((entry, index) => (
            <motion.div
              key={entry.user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.02 }}
            >
              <LeaderboardRow entry={entry} isCurrentUser={entry.rank === currentUserRank} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Load More */}
        <div className="text-center py-8">
          <Button variant="glass">
            Load More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 1 | 2 | 3 }) {
  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
  const colors = {
    1: 'from-xp-gold to-xp-gold/50 border-xp-gold/50',
    2: 'from-xp-silver to-xp-silver/50 border-xp-silver/50',
    3: 'from-xp-bronze to-xp-bronze/50 border-xp-bronze/50',
  };
  const icons = {
    1: <Crown className="w-6 h-6 text-xp-gold" />,
    2: <Medal className="w-5 h-5 text-xp-silver" />,
    3: <Award className="w-5 h-5 text-xp-bronze" />,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div className="relative mb-2">
        <div
          className={cn(
            'w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl border-2',
            colors[position]
          )}
        >
          {entry.user.avatar}
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center">
          {icons[position]}
        </div>
      </div>

      {/* Name */}
      <div className="font-semibold text-sm text-center mb-1 max-w-[100px] truncate">
        {entry.user.name}
      </div>

      {/* XP */}
      <div className="text-xs text-muted-foreground mb-2">
        {formatXP(entry.user.totalXP)} XP
      </div>

      {/* Podium */}
      <div
        className={cn(
          'w-20 rounded-t-lg bg-gradient-to-b flex items-center justify-center font-bold text-2xl border-t border-x',
          heights[position],
          colors[position]
        )}
      >
        {position}
      </div>
    </div>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  const rankChange = entry.previousRank - entry.rank;

  return (
    <Card
      className={cn(
        'glass-card p-3',
        isCurrentUser && 'border-primary/50 bg-primary/5'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className="w-10 text-center">
          <div className="font-bold text-lg">{entry.rank}</div>
          <div className="flex items-center justify-center text-xs">
            {rankChange > 0 && (
              <span className="text-ethics-safe flex items-center">
                <TrendingUp className="w-3 h-3" />
                {rankChange}
              </span>
            )}
            {rankChange < 0 && (
              <span className="text-ethics-danger flex items-center">
                <TrendingDown className="w-3 h-3" />
                {Math.abs(rankChange)}
              </span>
            )}
            {rankChange === 0 && (
              <span className="text-muted-foreground">
                <Minus className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl">
          {entry.user.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{entry.user.name}</span>
            {entry.user.isVerified && (
              <Badge variant="neon" className="text-xs px-1 py-0">✓</Badge>
            )}
            {entry.user.country && (
              <span className="text-sm">{entry.user.country}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <LevelBadge level={entry.user.level} />
            {entry.user.streak > 7 && (
              <span className="flex items-center gap-0.5 text-karma-positive">
                <Flame className="w-3 h-3" />
                {entry.user.streak}d
              </span>
            )}
            {entry.user.guild && (
              <span className="flex items-center gap-0.5">
                <Shield className="w-3 h-3" />
                {entry.user.guild}
              </span>
            )}
          </div>
        </div>

        {/* XP */}
        <div className="text-right">
          <div className="font-semibold">{formatXP(entry.user.totalXP)}</div>
          <div className="text-xs text-muted-foreground">XP</div>
        </div>
      </div>
    </Card>
  );
}
