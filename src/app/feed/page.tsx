import { redirect } from 'next/navigation';

export default function FeedPage() {
  redirect('/');
}import { redirect } from 'next/navigation';

export default function FeedPage() {
  redirect('/');
}
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock feed data
const mockPosts = [
  {
    id: '1',
    user: { name: 'EthicsGuardian', level: 42, avatar: '🦸' },
    type: 'scan_result',
    content: 'Just analyzed a complex AI prompt - 87% ethics score! Working on improving it.',
    score: 87,
    likes: 24,
    comments: 5,
    timestamp: '2h ago',
  },
  {
    id: '2',
    user: { name: 'BiasHunter', level: 38, avatar: '🔍' },
    type: 'achievement',
    content: 'Unlocked "Bias Buster" achievement! 100 prompts analyzed for bias.',
    achievement: 'Bias Buster',
    likes: 56,
    comments: 12,
    timestamp: '4h ago',
  },
  {
    id: '3',
    user: { name: 'AIEthicist', level: 55, avatar: '🎓' },
    type: 'template',
    content: 'Shared a new ethical prompt template for healthcare AI interactions.',
    templateName: 'Healthcare Ethics Template',
    downloads: 89,
    likes: 34,
    comments: 8,
    timestamp: '6h ago',
  },
];

export default function FeedPage() {
  const [posts] = useState(mockPosts);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-gradient">Ethics Feed</h1>
          <p className="text-muted-foreground">
            See what the community is analyzing and achieving
          </p>
        </motion.div>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                  🙂
                </div>
                <input
                  type="text"
                  placeholder="Share your ethics journey..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
                <Button variant="scan" size="sm">
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl">
                        {post.user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{post.user.name}</span>
                          <Badge variant="gold" size="sm">Lvl {post.user.level}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </div>
                    {post.type === 'scan_result' && post.score !== undefined && (
                      <Badge variant={post.score >= 80 ? 'safe' : post.score >= 60 ? 'warning' : 'danger'}>
                        {post.score}% Ethics
                      </Badge>
                    )}
                    {post.type === 'achievement' && (
                      <Badge variant="legendary">🏆 Achievement</Badge>
                    )}
                    {post.type === 'template' && (
                      <Badge variant="neon">📄 Template</Badge>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-foreground mb-4">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <span>❤️</span>
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <span>💬</span>
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <span>🔄</span>
                      <span>Share</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </MainLayout>
  );
}
