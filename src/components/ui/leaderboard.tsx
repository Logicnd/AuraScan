'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  avatar?: string
  score: number
  level?: number
  badge?: string
  change?: 'up' | 'down' | 'same' | 'new'
  previousRank?: number
  stats?: Record<string, number | string>
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  title?: string
  subtitle?: string
  highlightId?: string
  showStats?: boolean
  className?: string
}

const rankColors: Record<number, string> = {
  1: 'from-yellow-500 to-amber-600',
  2: 'from-zinc-400 to-zinc-500',
  3: 'from-orange-600 to-orange-700'
}

const rankIcons: Record<number, string> = {
  1: '👑',
  2: '🥈',
  3: '🥉'
}

export function Leaderboard({
  entries,
  title = 'LEADERBOARD',
  subtitle,
  highlightId,
  showStats = false,
  className
}: LeaderboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className={cn(
      'bg-black/80 border border-cyan-500/30 rounded-xl overflow-hidden',
      'shadow-[0_0_30px_rgba(0,255,255,0.1)]',
      className
    )}>
      {/* Header */}
      <div className="relative p-4 bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 border-b border-cyan-500/20">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px]" />
        <div className="relative">
          <h2 className="text-lg font-mono text-cyan-400 tracking-wider">{title}</h2>
          {subtitle && <p className="text-xs text-zinc-500 font-mono mt-1">{subtitle}</p>}
        </div>
        
        {/* Live indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-400 font-mono">LIVE</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-zinc-900/50">
        {[2, 1, 3].map((rank) => {
          const entry = entries.find(e => e.rank === rank)
          if (!entry) return <div key={rank} />
          
          return (
            <motion.div
              key={rank}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: rank * 0.1 }}
              className={cn(
                'relative flex flex-col items-center p-3 rounded-lg',
                rank === 1 && 'order-2 -mt-2',
                rank === 2 && 'order-1',
                rank === 3 && 'order-3'
              )}
            >
              {/* Glow effect for #1 */}
              {rank === 1 && (
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-lg" />
              )}
              
              {/* Avatar */}
              <div className={cn(
                'relative w-12 h-12 rounded-full mb-2',
                'bg-gradient-to-br',
                rankColors[rank] || 'from-zinc-600 to-zinc-700'
              )}>
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold">
                    {entry.name[0]}
                  </div>
                )}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-lg">
                  {rankIcons[rank]}
                </span>
              </div>
              
              <span className="text-xs font-mono text-white truncate max-w-full">
                {entry.name}
              </span>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {entry.score.toLocaleString()}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Entries List */}
      <div className="divide-y divide-cyan-500/10">
        {entries.slice(3).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'relative group',
              highlightId === entry.id && 'bg-cyan-500/10'
            )}
          >
            <button
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              className="w-full flex items-center gap-3 p-3 hover:bg-cyan-500/5 transition-colors"
            >
              {/* Rank */}
              <div className="w-8 text-center font-mono text-zinc-500">
                #{entry.rank}
              </div>

              {/* Change indicator */}
              <div className="w-4">
                {entry.change === 'up' && <span className="text-green-400 text-xs">▲</span>}
                {entry.change === 'down' && <span className="text-red-400 text-xs">▼</span>}
                {entry.change === 'new' && <span className="text-cyan-400 text-[10px]">NEW</span>}
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center">
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-bold">{entry.name[0]}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-white">{entry.name}</span>
                  {entry.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-cyan-500/20 text-cyan-400 rounded">
                      {entry.badge}
                    </span>
                  )}
                </div>
                {entry.level && (
                  <span className="text-[10px] text-zinc-600 font-mono">Level {entry.level}</span>
                )}
              </div>

              {/* Score */}
              <div className="font-mono font-bold text-cyan-400">
                {entry.score.toLocaleString()}
              </div>
            </button>

            {/* Expanded Stats */}
            <AnimatePresence>
              {showStats && expandedId === entry.id && entry.stats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-zinc-900/50 border-t border-cyan-500/10"
                >
                  <div className="p-3 grid grid-cols-3 gap-2">
                    {Object.entries(entry.stats).map(([key, value]) => (
                      <div key={key} className="text-center p-2 bg-black/30 rounded">
                        <div className="text-[10px] text-zinc-600 font-mono uppercase">{key}</div>
                        <div className="text-sm text-cyan-400 font-mono">{value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 bg-zinc-900/50 border-t border-cyan-500/10 flex items-center justify-between">
        <span className="text-[10px] text-zinc-600 font-mono">
          Updated: {new Date().toLocaleTimeString()}
        </span>
        <span className="text-[10px] text-zinc-600 font-mono">
          {entries.length} players
        </span>
      </div>
    </div>
  )
}

// Demo data
export const demoLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, id: '1', name: 'CyberNinja', score: 125000, level: 50, badge: 'Elite', change: 'same', stats: { missions: 248, accuracy: '94%', streak: 12 } },
  { rank: 2, id: '2', name: 'DataHunter', score: 98500, level: 45, change: 'up', stats: { missions: 201, accuracy: '89%', streak: 8 } },
  { rank: 3, id: '3', name: 'NeonGhost', score: 87200, level: 42, badge: 'Pro', change: 'down', stats: { missions: 189, accuracy: '91%', streak: 5 } },
  { rank: 4, id: '4', name: 'QuantumFox', score: 76800, level: 38, change: 'up' },
  { rank: 5, id: '5', name: 'ShadowByte', score: 68500, level: 35, change: 'new' },
  { rank: 6, id: '6', name: 'PixelStorm', score: 62100, level: 33, change: 'down' },
  { rank: 7, id: '7', name: 'VoidWalker', score: 55400, level: 30, change: 'same' },
]
