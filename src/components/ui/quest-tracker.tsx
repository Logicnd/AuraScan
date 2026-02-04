'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Quest {
  id: string
  title: string
  description: string
  category: 'main' | 'side' | 'daily' | 'hidden'
  status: 'locked' | 'available' | 'active' | 'completed'
  progress?: number
  maxProgress?: number
  rewards: {
    xp?: number
    badges?: string[]
    items?: string[]
  }
  objectives?: Array<{
    id: string
    text: string
    completed: boolean
  }>
  timeLimit?: Date
  difficulty?: 'easy' | 'medium' | 'hard' | 'legendary'
}

interface QuestTrackerProps {
  quests: Quest[]
  onQuestClick?: (quest: Quest) => void
  className?: string
}

const categoryColors: Record<string, string> = {
  main: 'border-yellow-500/50 bg-yellow-500/10',
  side: 'border-cyan-500/50 bg-cyan-500/10',
  daily: 'border-green-500/50 bg-green-500/10',
  hidden: 'border-purple-500/50 bg-purple-500/10'
}

const categoryIcons: Record<string, string> = {
  main: '⚔️',
  side: '📜',
  daily: '🔄',
  hidden: '🔮'
}

const difficultyColors: Record<string, string> = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-orange-400',
  legendary: 'text-purple-400'
}

export function QuestTracker({ quests, onQuestClick, className }: QuestTrackerProps) {
  const [activeTab, setActiveTab] = useState<Quest['category'] | 'all'>('all')
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)

  const filteredQuests = activeTab === 'all' 
    ? quests 
    : quests.filter(q => q.category === activeTab)

  const activeQuests = quests.filter(q => q.status === 'active').length
  const completedQuests = quests.filter(q => q.status === 'completed').length

  return (
    <div className={cn(
      'bg-black/80 border border-cyan-500/30 rounded-xl overflow-hidden',
      'shadow-[0_0_30px_rgba(0,255,255,0.1)]',
      className
    )}>
      {/* Header */}
      <div className="relative p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-b border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-mono text-cyan-400 tracking-wider flex items-center gap-2">
              <span>📋</span> QUEST LOG
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              {activeQuests} active • {completedQuests}/{quests.length} completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-cyan-400 font-mono">TRACKING</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cyan-500/20 bg-zinc-900/50">
        {(['all', 'main', 'side', 'daily', 'hidden'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 px-3 py-2 text-xs font-mono uppercase transition-all',
              activeTab === tab
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500'
                : 'text-zinc-600 hover:text-zinc-400'
            )}
          >
            {tab === 'all' ? 'All' : `${categoryIcons[tab]} ${tab}`}
          </button>
        ))}
      </div>

      {/* Quest List */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-cyan-500/10">
        {filteredQuests.map((quest) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'relative group cursor-pointer',
              quest.status === 'locked' && 'opacity-50'
            )}
            onClick={() => {
              setSelectedQuest(selectedQuest?.id === quest.id ? null : quest)
              onQuestClick?.(quest)
            }}
          >
            <div className="p-4 hover:bg-cyan-500/5 transition-colors">
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className={cn(
                  'w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0',
                  categoryColors[quest.category]
                )}>
                  {quest.status === 'locked' && '🔒'}
                  {quest.status === 'available' && categoryIcons[quest.category]}
                  {quest.status === 'active' && '⚡'}
                  {quest.status === 'completed' && '✅'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      'font-mono text-sm truncate',
                      quest.status === 'completed' ? 'text-zinc-500 line-through' : 'text-white'
                    )}>
                      {quest.title}
                    </h3>
                    {quest.difficulty && (
                      <span className={cn('text-[10px]', difficultyColors[quest.difficulty])}>
                        [{quest.difficulty.toUpperCase()}]
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 truncate mt-1">
                    {quest.description}
                  </p>

                  {/* Progress Bar */}
                  {quest.progress !== undefined && quest.maxProgress && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-600 font-mono mt-1">
                        {quest.progress}/{quest.maxProgress}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rewards Preview */}
                <div className="flex items-center gap-2">
                  {quest.rewards.xp && (
                    <span className="text-xs text-yellow-400 font-mono">
                      +{quest.rewards.xp} XP
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedQuest?.id === quest.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-cyan-500/10 space-y-3">
                      {/* Objectives */}
                      {quest.objectives && quest.objectives.length > 0 && (
                        <div>
                          <h4 className="text-[10px] text-zinc-500 font-mono uppercase mb-2">Objectives</h4>
                          <div className="space-y-1">
                            {quest.objectives.map((obj) => (
                              <div key={obj.id} className="flex items-center gap-2">
                                <span className={cn(
                                  'w-4 h-4 rounded border flex items-center justify-center text-[10px]',
                                  obj.completed
                                    ? 'border-green-500 bg-green-500/20 text-green-400'
                                    : 'border-zinc-600'
                                )}>
                                  {obj.completed && '✓'}
                                </span>
                                <span className={cn(
                                  'text-xs',
                                  obj.completed ? 'text-zinc-500 line-through' : 'text-zinc-400'
                                )}>
                                  {obj.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rewards */}
                      <div>
                        <h4 className="text-[10px] text-zinc-500 font-mono uppercase mb-2">Rewards</h4>
                        <div className="flex flex-wrap gap-2">
                          {quest.rewards.xp && (
                            <span className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded">
                              +{quest.rewards.xp} XP
                            </span>
                          )}
                          {quest.rewards.badges?.map((badge) => (
                            <span key={badge} className="px-2 py-1 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded">
                              🏆 {badge}
                            </span>
                          ))}
                          {quest.rewards.items?.map((item) => (
                            <span key={item} className="px-2 py-1 text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                              📦 {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Time Limit */}
                      {quest.timeLimit && (
                        <div className="flex items-center gap-2 text-xs text-orange-400">
                          <span>⏰</span>
                          <QuestTimer deadline={quest.timeLimit} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function QuestTimer({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const diff = deadline.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeLeft('Expired')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s remaining`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [deadline])

  return <span className="font-mono">{timeLeft}</span>
}

// Demo data
export const demoQuests: Quest[] = [
  {
    id: '1',
    title: 'Complete Your First Scan',
    description: 'Scan a product to begin your investigation',
    category: 'main',
    status: 'active',
    progress: 0,
    maxProgress: 1,
    rewards: { xp: 100, badges: ['First Scanner'] },
    objectives: [
      { id: '1a', text: 'Open the scanner', completed: true },
      { id: '1b', text: 'Scan a barcode', completed: false }
    ],
    difficulty: 'easy'
  },
  {
    id: '2',
    title: 'Uncover the Truth',
    description: 'Analyze 10 products for ethical concerns',
    category: 'main',
    status: 'active',
    progress: 3,
    maxProgress: 10,
    rewards: { xp: 500, badges: ['Truth Seeker'], items: ['Premium Filter'] },
    difficulty: 'medium'
  },
  {
    id: '3',
    title: 'Daily Scan Challenge',
    description: 'Scan 5 products today',
    category: 'daily',
    status: 'available',
    progress: 0,
    maxProgress: 5,
    rewards: { xp: 50 },
    timeLimit: new Date(Date.now() + 24 * 60 * 60 * 1000),
    difficulty: 'easy'
  },
  {
    id: '4',
    title: 'Hidden Pattern',
    description: '???',
    category: 'hidden',
    status: 'locked',
    rewards: { xp: 1000, badges: ['Pattern Detective'] },
    difficulty: 'legendary'
  }
]
