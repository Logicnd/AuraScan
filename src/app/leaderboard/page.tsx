'use client'

import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'
import { GlitchText } from '@/components/ui/glitch-text'
import { Trophy, Globe, Users } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <GlitchText text="GLOBAL RANKINGS" />
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Elite operatives dominating the digital battlefield.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-zinc-500">Top Score</div>
              <div className="text-2xl font-bold text-white">99,999</div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-zinc-500">Active Operatives</div>
              <div className="text-2xl font-bold text-white">1,337</div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-zinc-500">Global Rank</div>
              <div className="text-2xl font-bold text-white">#42</div>
            </div>
          </div>
        </div>

        <LeaderboardTable />
      </div>
    </div>
  )
}
