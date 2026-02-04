'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LevelUpAnimationProps {
  isVisible: boolean
  newLevel: number
  onComplete: () => void
  rewards?: {
    title?: string
    badges?: string[]
    unlocks?: string[]
  }
}

export function LevelUpAnimation({ isVisible, newLevel, onComplete, rewards }: LevelUpAnimationProps) {
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowRewards(false)
      const timer = setTimeout(() => setShowRewards(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          {/* Radial burst */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 h-[200vh] w-1 bg-gradient-to-t from-transparent via-cyan-500/50 to-transparent"
                style={{ 
                  transformOrigin: 'center center',
                  rotate: `${i * 30}deg`,
                  translateX: '-50%',
                  translateY: '-50%'
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: 0.1 }}
              />
            ))}
          </motion.div>

          {/* Ring explosion */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-cyan-500"
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ 
                width: [0, 600], 
                height: [0, 600], 
                opacity: [1, 0],
                borderWidth: ['2px', '0px']
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.2,
                ease: 'easeOut' 
              }}
            />
          ))}

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `linear-gradient(135deg, ${
                    ['#00ffff', '#ff00ff', '#00ff00', '#ffff00'][Math.floor(Math.random() * 4)]
                  }, transparent)`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -100]
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 1,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.3 }}
          >
            {/* Level Up Text */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <span className="text-sm font-mono text-cyan-400 tracking-[0.5em] uppercase">
                LEVEL UP
              </span>
            </motion.div>

            {/* Level Number */}
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 8, delay: 0.7 }}
              className="relative"
            >
              <div className="text-[120px] font-mono font-black leading-none bg-gradient-to-b from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">
                {newLevel}
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 text-[120px] font-mono font-black leading-none text-cyan-500/30 blur-xl">
                {newLevel}
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4"
            >
              <span className="text-xl font-mono text-zinc-400">
                {rewards?.title || 'New powers unlocked'}
              </span>
            </motion.div>

            {/* Rewards */}
            <AnimatePresence>
              {showRewards && rewards && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  className="mt-8 space-y-3"
                >
                  {/* Badges */}
                  {rewards.badges && rewards.badges.length > 0 && (
                    <div className="flex justify-center gap-2">
                      {rewards.badges.map((badge, i) => (
                        <motion.span
                          key={badge}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-sm font-mono"
                        >
                          🏆 {badge}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Unlocks */}
                  {rewards.unlocks && rewards.unlocks.length > 0 && (
                    <div className="flex flex-col items-center gap-1">
                      {rewards.unlocks.map((unlock, i) => (
                        <motion.div
                          key={unlock}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="text-sm font-mono text-green-400"
                        >
                          ✓ {unlock}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1] }}
              transition={{ delay: 3, duration: 0.5 }}
              className="mt-8"
            >
              <button
                onClick={onComplete}
                className="text-sm font-mono text-zinc-500 hover:text-cyan-400 transition-colors"
              >
                Click anywhere to continue
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for level up
export function useLevelUp() {
  const [levelUpData, setLevelUpData] = useState<{
    isVisible: boolean
    newLevel: number
    rewards?: LevelUpAnimationProps['rewards']
  }>({
    isVisible: false,
    newLevel: 1
  })

  const triggerLevelUp = (newLevel: number, rewards?: LevelUpAnimationProps['rewards']) => {
    setLevelUpData({ isVisible: true, newLevel, rewards })
  }

  const handleComplete = () => {
    setLevelUpData(prev => ({ ...prev, isVisible: false }))
  }

  return {
    ...levelUpData,
    triggerLevelUp,
    handleComplete
  }
}
