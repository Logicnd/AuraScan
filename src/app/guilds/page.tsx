import { redirect } from 'next/navigation';

export default function GuildsPage() {
  redirect('/');
}
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock guild data
const mockGuilds = [
  {
    id: '1',
    name: 'Ethical AI Pioneers',
    description: 'Leading the charge for responsible AI development',
    members: 1247,
    level: 35,
    weeklyXP: 45600,
    badge: '🏆',
    tags: ['Research', 'Education', 'Community'],
    isJoined: false,
  },
  {
    id: '2',
    name: 'Privacy Guardians',
    description: 'Protecting user privacy in the AI age',
    members: 892,
    level: 28,
    weeklyXP: 32100,
    badge: '🛡️',
    tags: ['Privacy', 'Security', 'Advocacy'],
    isJoined: true,
  },
  {
    id: '3',
    name: 'Bias Busters United',
    description: 'Identifying and eliminating AI bias together',
    members: 2156,
    level: 42,
    weeklyXP: 67800,
    badge: '⚖️',
    tags: ['Fairness', 'Diversity', 'Inclusion'],
    isJoined: false,
  },
];

export default function GuildsPage() {
  const [guilds] = useState(mockGuilds);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-gradient">Ethics Guilds</h1>
          <p className="text-muted-foreground">
            Join communities and collaborate on ethical AI missions
          </p>
        </motion.div>

        {/* Create Guild CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-neon-purple/10 border-primary/30">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Start Your Own Guild</h3>
                <p className="text-sm text-muted-foreground">
                  Create a community around your ethics focus
                </p>
              </div>
              <Button variant="neon">Create Guild</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guild Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-xs text-muted-foreground">Active Guilds</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-ethics-safe">89K</div>
              <div className="text-xs text-muted-foreground">Total Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-xp-gold">2.4M</div>
              <div className="text-xs text-muted-foreground">Weekly XP Earned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-neon-purple">156</div>
              <div className="text-xs text-muted-foreground">Active Missions</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guild List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Featured Guilds</h2>
          {guilds.map((guild, index) => (
            <motion.div
              key={guild.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-neon-purple/20 flex items-center justify-center text-3xl">
                        {guild.badge}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">{guild.name}</h3>
                          <Badge variant="gold" size="sm">Lvl {guild.level}</Badge>
                          {guild.isJoined && (
                            <Badge variant="safe" size="sm">Member</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {guild.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {guild.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-2">
                        {guild.members.toLocaleString()} members
                      </div>
                      <div className="text-sm text-xp-gold mb-3">
                        +{guild.weeklyXP.toLocaleString()} XP/week
                      </div>
                      <Button
                        variant={guild.isJoined ? 'outline' : 'scan'}
                        size="sm"
                      >
                        {guild.isJoined ? 'View' : 'Join'}
                      </Button>
                    </div>
                  </div>

                  {/* Guild Progress */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-xs mb-2">
                      <span>Level Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} variant="xp" className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
