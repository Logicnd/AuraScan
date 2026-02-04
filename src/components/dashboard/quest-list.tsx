'use client'

import { useGamification } from '@/lib/store/gamification'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function QuestList() {
  const { quests, completeQuest } = useGamification()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Active Directives
        </h2>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          Daily Reset: 04:00:00
        </span>
      </div>

      <div className="grid gap-3">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
              quest.completed
                ? "bg-green-950/10 border-green-500/20"
                : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
            )}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  quest.completed ? "bg-green-500/20 text-green-500" : "bg-zinc-800 text-zinc-500"
                )}>
                  {quest.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className={cn(
                    "font-medium",
                    quest.completed ? "text-green-400 line-through opacity-70" : "text-zinc-200"
                  )}>
                    {quest.title}
                  </h3>
                  <p className="text-xs text-zinc-500">{quest.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-yellow-500 font-bold">
                  +{quest.xp} XP
                </span>
                {!quest.completed && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs hover:text-green-400 hover:bg-green-500/10"
                    onClick={() => completeQuest(quest.id)}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
            
            {/* Progress Bar Background for completed items */}
            {quest.completed && (
              <motion.div
                layoutId={`quest-bg-${quest.id}`}
                className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
