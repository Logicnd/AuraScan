'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  xp?: number
  unlockedAt?: Date
}

interface AchievementPopupProps {
  achievement: Achievement | null
  onClose: () => void
  autoHideDuration?: number
}

const rarityStyles: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  common: {
    border: 'border-zinc-500',
    bg: 'from-zinc-600 to-zinc-700',
    text: 'text-zinc-300',
    glow: 'rgba(161, 161, 170, 0.3)'
  },
  uncommon: {
    border: 'border-green-500',
    bg: 'from-green-600 to-green-700',
    text: 'text-green-300',
    glow: 'rgba(34, 197, 94, 0.4)'
  },
  rare: {
    border: 'border-blue-500',
    bg: 'from-blue-600 to-blue-700',
    text: 'text-blue-300',
    glow: 'rgba(59, 130, 246, 0.5)'
  },
  epic: {
    border: 'border-purple-500',
    bg: 'from-purple-600 to-purple-700',
    text: 'text-purple-300',
    glow: 'rgba(168, 85, 247, 0.5)'
  },
  legendary: {
    border: 'border-yellow-500',
    bg: 'from-yellow-500 to-orange-600',
    text: 'text-yellow-300',
    glow: 'rgba(234, 179, 8, 0.6)'
  }
}

export function AchievementPopup({ achievement, onClose, autoHideDuration = 5000 }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, autoHideDuration)
      return () => clearTimeout(timer)
    }
  }, [achievement, autoHideDuration, onClose])

  if (!achievement) return null

  const style = rarityStyles[achievement.rarity]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div
            className={cn(
              'relative px-6 py-4 rounded-xl border-2',
              'bg-black/95 backdrop-blur-lg',
              style.border
            )}
            style={{ boxShadow: `0 0 40px ${style.glow}, inset 0 0 20px ${style.glow}` }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 rounded-xl overflow-hidden"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            </motion.div>

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn('absolute w-1 h-1 rounded-full', `bg-gradient-to-br ${style.bg}`)}
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 1
                  }}
                  animate={{
                    x: `${Math.random() * 200 - 50}%`,
                    y: `${Math.random() * 200 - 50}%`,
                    opacity: 0,
                    scale: [1, 2, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>

            <div className="relative flex items-center gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                  `bg-gradient-to-br ${style.bg}`,
                  'shadow-lg'
                )}
              >
                {achievement.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    Achievement Unlocked
                  </span>
                  <span className={cn('text-[10px] font-mono uppercase', style.text)}>
                    [{achievement.rarity}]
                  </span>
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg font-mono font-bold text-white mt-1"
                >
                  {achievement.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-zinc-400 font-mono"
                >
                  {achievement.description}
                </motion.p>
              </div>

              {/* XP Badge */}
              {achievement.xp && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.6 }}
                  className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg"
                >
                  <span className="text-yellow-400 font-mono font-bold">+{achievement.xp} XP</span>
                </motion.div>
              )}
            </div>

            {/* Progress bar animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 rounded-b-xl bg-gradient-to-r from-cyan-500 to-magenta-500"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: autoHideDuration / 1000, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Achievement Manager Hook
export function useAchievements() {
  const [queue, setQueue] = useState<Achievement[]>([])
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)

  const unlock = (achievement: Achievement) => {
    setQueue(prev => [...prev, { ...achievement, unlockedAt: new Date() }])
  }

  const handleClose = () => {
    setCurrentAchievement(null)
  }

  useEffect(() => {
    if (!currentAchievement && queue.length > 0) {
      setCurrentAchievement(queue[0])
      setQueue(prev => prev.slice(1))
    }
  }, [currentAchievement, queue])

  return {
    unlock,
    currentAchievement,
    handleClose,
    queueLength: queue.length
  }
}

// Demo achievements
export const demoAchievements: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first scan', icon: '👶', rarity: 'common', xp: 50 },
  { id: '2', title: 'Truth Seeker', description: 'Uncover 10 ethical violations', icon: '🔍', rarity: 'uncommon', xp: 100 },
  { id: '3', title: 'Data Detective', description: 'Analyze 100 products', icon: '🕵️', rarity: 'rare', xp: 250 },
  { id: '4', title: 'Corporate Exposer', description: 'Reveal a major scandal', icon: '💥', rarity: 'epic', xp: 500 },
  { id: '5', title: 'Master Investigator', description: 'Reach maximum level', icon: '👑', rarity: 'legendary', xp: 1000 }
]
