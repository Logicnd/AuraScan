'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Shield, ChevronRight } from 'lucide-react'
import { GlitchText } from '@/components/ui/glitch-text'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  level: number
  title: string
}

export function LevelUpModal({ isOpen, onClose, level, title }: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        // Green binary rain confetti
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#22c55e', '#15803d', '#000000']
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#22c55e', '#15803d', '#000000']
        })
      }, 250)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-green-500 rounded-2xl p-1 overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.3)]"
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500 z-20 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500 z-20 rounded-br-xl" />

            <div className="relative bg-black rounded-xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shine_3s_infinite]" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-pulse">
                  <Trophy className="w-12 h-12 text-green-500" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-white">
                    <GlitchText text="SYSTEM UPGRADE" />
                  </h2>
                  <p className="text-zinc-400">Authorization Level Increased</p>
                </div>

                <div className="w-full bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                  <div className="text-sm text-zinc-500 uppercase tracking-widest mb-2">New Clearance</div>
                  <div className="text-4xl font-bold text-green-500 font-mono mb-2">LEVEL {level}</div>
                  <div className="text-xl text-white font-bold">{title}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full text-left">
                  <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-xs text-zinc-500">Security</div>
                      <div className="text-sm font-bold text-white">+15%</div>
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center gap-3">
                    <ChevronRight className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-xs text-zinc-500">Access</div>
                      <div className="text-sm font-bold text-white">Expanded</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
                >
                  Acknowledge Upgrade
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
