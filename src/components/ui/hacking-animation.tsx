'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface HackingAnimationProps {
  onComplete: () => void
}

export function HackingAnimation({ onComplete }: HackingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const hackingLogs = [
    "Establishing handshake...",
    "Bypassing firewall...",
    "Injecting payload...",
    "Decrypting hashes...",
    "Analyzing vulnerabilities...",
    "Extracting metadata...",
    "Compiling report...",
    "Covering tracks..."
  ]

  useEffect(() => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        setTimeout(onComplete, 500)
      }
      setProgress(currentProgress)
      
      // Add random logs
      if (Math.random() > 0.7) {
        const log = hackingLogs[Math.floor(Math.random() * hackingLogs.length)]
        setLogs(prev => [...prev.slice(-5), `> ${log} [${Math.floor(Math.random() * 999)}ms]`])
      }
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="flex flex-col items-center justify-center w-full h-96 bg-black font-mono relative overflow-hidden rounded-xl border border-green-500/30">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      <div className="z-10 w-full max-w-md space-y-8 p-6">
        <div className="text-center space-y-2">
          <div className="text-green-500 font-bold text-xl tracking-widest animate-pulse">
            SYSTEM INTRUSION IN PROGRESS
          </div>
          <div className="text-xs text-green-500/50">
            TARGET: UNKNOWN_ENTITY
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <motion.div 
              className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-green-400">
            <span>UPLOADING VIRUS...</span>
            <span>{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Logs */}
        <div className="h-32 overflow-hidden space-y-1 text-xs text-zinc-500 font-mono border-t border-green-500/20 pt-4">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-green-500/70"
            >
              {log}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
