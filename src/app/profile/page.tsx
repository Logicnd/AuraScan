import { redirect } from 'next/navigation';

export default function ProfilePage() {
  redirect('/');
}'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress, XPProgress, EthicsScoreCircle } from '@/components/ui/progress';
import { useGamificationStore, useUserStore } from '@/store';

export default function ProfilePage() {
  const { level, currentXP, xpToNextLevel, karma, streakDays, totalXP } = useGamificationStore();
  const { user } = useUserStore();

  // Mock achievements
  const achievements = [
    { id: '1', name: 'First Scan', icon: '🔍', unlocked: true },
    { id: '2', name: 'Bias Buster', icon: '⚖️', unlocked: true },
    { id: '3', name: 'Privacy Guardian', icon: '🛡️', unlocked: true },
    { id: '4', name: 'Ethics Champion', icon: '🏆', unlocked: false },
    { id: '5', name: 'Community Helper', icon: '🤝', unlocked: false },
    { id: '6', name: 'Streak Master', icon: '🔥', unlocked: false },
  ];

  // Mock stats
  const stats = {
    totalScans: 247,
    averageScore: 78,
    biasReduced: 156,
    templatesUsed: 34,
    carbonSaved: 12.4,
    deepfakesDetected: 8,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary via-neon-purple to-primary" />
            <CardContent className="p-6 -mt-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-background flex items-center justify-center text-4xl shadow-lg">
                  🦸
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{user?.displayName || 'Ethics Guardian'}</h1>
                  <p className="text-muted-foreground">@{user?.username || 'ethicsguardian'}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                    <Badge variant="gold">Level {level}</Badge>
                    <Badge variant="karma">✨ {karma} Karma</Badge>
                    <Badge variant="safe">🔥 {streakDays} Day Streak</Badge>
                  </div>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚡</span> Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <XPProgress
                currentXP={currentXP}
                xpToNextLevel={xpToNextLevel}
                level={level}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Total XP: {totalXP.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalScans}</div>
              <div className="text-sm text-muted-foreground">Total Scans</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-ethics-safe">{stats.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Avg Ethics Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-neon-purple">{stats.biasReduced}</div>
              <div className="text-sm text-muted-foreground">Bias Instances Fixed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-xp-gold">{stats.templatesUsed}</div>
              <div className="text-sm text-muted-foreground">Templates Used</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-ethics-safe">{stats.carbonSaved}kg</div>
              <div className="text-sm text-muted-foreground">Carbon Saved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-ethics-danger">{stats.deepfakesDetected}</div>
              <div className="text-sm text-muted-foreground">Deepfakes Found</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>🏆</span> Achievements
                </span>
                <Badge variant="secondary">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-primary/10'
                        : 'bg-secondary/50 opacity-50'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <span className="text-xs text-center font-medium">
                      {achievement.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Progress 
                  value={(achievements.filter(a => a.unlocked).length / achievements.length) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ethics Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📊</span> Your Ethics Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <EthicsScoreCircle score={78} size="lg" />
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Your average ethics score across all scans. Keep improving to unlock new achievements!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
