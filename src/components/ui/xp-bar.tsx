'use client'

import { useGamification } from '@/lib/store/gamification'
import { motion } from 'framer-motion'

export function XPBar() {
  const { level, xp, xpToNextLevel, title } = useGamification()
  const progress = (xp / xpToNextLevel) * 100

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-xs mb-1 font-mono">
        <span className="text-green-400">LVL {level}: {title}</span>
        <span className="text-zinc-500">{xp} / {xpToNextLevel} XP</span>
      </div>
      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
        <motion.div
          className="h-full bg-gradient-to-r from-green-600 to-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
