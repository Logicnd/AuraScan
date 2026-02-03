'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock course data
const courses = [
  {
    id: '1',
    title: 'Introduction to AI Ethics',
    description: 'Learn the fundamentals of ethical AI development and usage',
    modules: 8,
    completedModules: 8,
    duration: '2 hours',
    xpReward: 500,
    difficulty: 'Beginner',
    icon: '📚',
  },
  {
    id: '2',
    title: 'Bias Detection Masterclass',
    description: 'Advanced techniques for identifying and mitigating AI bias',
    modules: 12,
    completedModules: 7,
    duration: '4 hours',
    xpReward: 1000,
    difficulty: 'Intermediate',
    icon: '⚖️',
  },
  {
    id: '3',
    title: 'Privacy & Data Protection',
    description: 'Understanding GDPR, CCPA, and AI privacy requirements',
    modules: 10,
    completedModules: 2,
    duration: '3 hours',
    xpReward: 750,
    difficulty: 'Intermediate',
    icon: '🔒',
  },
  {
    id: '4',
    title: 'Deepfake Detection',
    description: 'Techniques to identify AI-generated content and deepfakes',
    modules: 6,
    completedModules: 0,
    duration: '1.5 hours',
    xpReward: 600,
    difficulty: 'Advanced',
    icon: '👁️',
  },
];

export default function LearnPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const totalXP = courses.reduce((acc, c) => acc + c.xpReward, 0);
  const earnedXP = courses.reduce((acc, c) => {
    const progress = c.completedModules / c.modules;
    return acc + Math.floor(c.xpReward * progress);
  }, 0);
  const completedCourses = courses.filter(c => c.completedModules === c.modules).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-gradient">Learning Hub</h1>
          <p className="text-muted-foreground">
            Master AI ethics through interactive courses
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-neon-purple/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {completedCourses}/{courses.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Courses Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-xp-gold">
                    {earnedXP.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-ethics-safe">
                    {Math.round((earnedXP / totalXP) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Progress</div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(earnedXP / totalXP) * 100} variant="xp" className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Available Courses</h2>
          {courses.map((course, index) => {
            const progress = Math.round((course.completedModules / course.modules) * 100);
            const isCompleted = progress === 100;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedCourse === course.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedCourse(
                    selectedCourse === course.id ? null : course.id
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-neon-purple/20 flex items-center justify-center text-2xl">
                        {course.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">{course.title}</h3>
                          {isCompleted && (
                            <Badge variant="safe">✓ Completed</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {course.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{course.modules} modules</Badge>
                          <Badge variant="secondary">{course.duration}</Badge>
                          <Badge 
                            variant={
                              course.difficulty === 'Beginner' ? 'safe' :
                              course.difficulty === 'Intermediate' ? 'warning' : 'danger'
                            }
                          >
                            {course.difficulty}
                          </Badge>
                          <Badge variant="gold">+{course.xpReward} XP</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Progress value={progress} className="h-2" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {progress}%
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant={isCompleted ? 'outline' : 'scan'} 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {isCompleted ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    </div>

                    {/* Expanded Content */}
                    {selectedCourse === course.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t"
                      >
                        <h4 className="font-semibold mb-4">Module Progress</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                          {Array.from({ length: course.modules }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                                i < course.completedModules
                                  ? 'bg-ethics-safe/20 text-ethics-safe'
                                  : 'bg-secondary text-muted-foreground'
                              }`}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎓</span> Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-xp-gold/20 to-xp-gold/5 border border-xp-gold/30">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🏅</span>
                    <div>
                      <h4 className="font-bold">Ethics Fundamentals</h4>
                      <p className="text-xs text-muted-foreground">Earned Jan 15, 2026</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Certificate
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-dashed">
                  <div className="flex items-center gap-3 mb-2 opacity-50">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <h4 className="font-bold">Bias Detection Expert</h4>
                      <p className="text-xs text-muted-foreground">Complete course to unlock</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Locked
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
