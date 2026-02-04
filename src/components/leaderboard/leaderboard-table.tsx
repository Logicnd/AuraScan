'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  level: number
  xp: number
  title: string
  isCurrentUser?: boolean
}

const mockData: LeaderboardEntry[] = [
  { rank: 1, id: '1', name: 'ZeroCool', level: 42, xp: 99999, title: 'Digital Deity' },
  { rank: 2, id: '2', name: 'AcidBurn', level: 40, xp: 85400, title: 'Console Cowboy' },
  { rank: 3, id: '3', name: 'Neo', level: 38, xp: 72000, title: 'Netrunner' },
  { rank: 4, id: '4', name: 'Trinity', level: 35, xp: 68500, title: 'Netrunner' },
  { rank: 5, id: '5', name: 'Morpheus', level: 33, xp: 62000, title: 'Elite Hacker' },
  { rank: 6, id: '6', name: 'Cipher', level: 28, xp: 45000, title: 'Cyber-Ninja' },
  { rank: 7, id: '7', name: 'Ghost', level: 25, xp: 38000, title: 'Adept' },
  { rank: 8, id: '8', name: 'Niobe', level: 22, xp: 32000, title: 'Adept' },
  { rank: 9, id: '9', name: 'Link', level: 18, xp: 25000, title: 'Journeyman' },
  { rank: 10, id: '10', name: 'Tank', level: 15, xp: 18000, title: 'Journeyman' },
]

export function LeaderboardTable() {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
        <div className="col-span-2 md:col-span-1 text-center">Rank</div>
        <div className="col-span-6 md:col-span-5">Operative</div>
        <div className="col-span-2 md:col-span-3 text-center">Clearance</div>
        <div className="col-span-2 md:col-span-3 text-right">Score</div>
      </div>

      <div className="space-y-2">
        {mockData.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "grid grid-cols-12 gap-4 items-center px-6 py-4 rounded-xl border transition-all duration-300",
              entry.isCurrentUser 
                ? "bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]" 
                : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
            )}
          >
            <div className="col-span-2 md:col-span-1 flex justify-center">
              {entry.rank === 1 ? (
                <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              ) : entry.rank === 2 ? (
                <Medal className="w-6 h-6 text-zinc-400" />
              ) : entry.rank === 3 ? (
                <Medal className="w-6 h-6 text-amber-700" />
              ) : (
                <span className="font-mono text-zinc-500">#{entry.rank}</span>
              )}
            </div>

            <div className="col-span-6 md:col-span-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <span className="text-xs font-bold text-zinc-400">
                  {entry.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className={cn(
                  "font-bold",
                  entry.rank <= 3 ? "text-white" : "text-zinc-300"
                )}>
                  {entry.name}
                </div>
                <div className="text-xs text-zinc-500 md:hidden">{entry.title}</div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-3 hidden md:flex items-center justify-center gap-2">
              <Shield className="w-3 h-3 text-green-500" />
              <span className="text-sm font-mono text-zinc-400">
                LVL {entry.level}
              </span>
              <span className="text-xs text-zinc-600 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                {entry.title}
              </span>
            </div>

            <div className="col-span-2 md:col-span-3 text-right font-mono font-bold text-green-500">
              {entry.xp.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
