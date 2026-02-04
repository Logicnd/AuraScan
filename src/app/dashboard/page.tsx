'use client'

import { useGamification } from '@/lib/store/gamification'
import { QuestList } from '@/components/dashboard/quest-list'
import { StatCard } from '@/components/dashboard/stat-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Activity, ShieldAlert, Target, Zap, Trophy } from 'lucide-react'
import { GlitchText } from '@/components/ui/glitch-text'
import Link from 'next/link'

export default function DashboardPage() {
  const { title, level } = useGamification()

  const stats = [
    { label: 'Scans Conducted', value: '128', icon: Target, color: 'text-blue-500', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
    { label: 'Threats Neutralized', value: '42', icon: ShieldAlert, color: 'text-red-500', border: 'border-red-500/20', bg: 'bg-red-500/10' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-green-500', border: 'border-green-500/20', bg: 'bg-green-500/10' },
    { label: 'Energy Output', value: '1.2 GW', icon: Zap, color: 'text-yellow-500', border: 'border-yellow-500/20', bg: 'bg-yellow-500/10' },
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <GlitchText text="MISSION CONTROL" />
            </h1>
            <p className="text-zinc-400">
              Welcome back, <span className="text-green-500 font-mono">{title}</span>. Systems nominal.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <div className="text-right">
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Current Clearance</div>
              <div className="text-2xl font-bold text-white">LEVEL {level}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-900/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Quest List */}
          <div className="lg:col-span-2 space-y-6">
            <QuestList />
            <RecentActivity />
          </div>

          {/* Sidebar - Leaderboard Preview */}
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-black p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Top Operatives
                </h3>
                <Link href="/leaderboard" className="text-xs text-green-500 hover:text-green-400 hover:underline">
                  VIEW ALL
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'ZeroCool', score: '99,999', rank: 1 },
                  { name: 'AcidBurn', score: '85,450', rank: 2 },
                  { name: 'Neo', score: '72,000', rank: 3 },
                  { name: 'Trinity', score: '68,500', rank: 4 },
                  { name: 'Morpheus', score: '62,000', rank: 5 },
                ].map((user) => (
                  <div key={user.rank} className="flex items-center justify-between text-sm p-2 rounded hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono w-4 ${user.rank === 1 ? 'text-yellow-500' : 'text-zinc-500'}`}>
                        #{user.rank}
                      </span>
                      <span className="text-zinc-300 font-bold">{user.name}</span>
                    </div>
                    <span className="font-mono text-zinc-500">{user.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Tip */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <h3 className="text-sm font-bold text-green-500 mb-2 uppercase tracking-wider">
                Daily Directive
              </h3>
              <p className="text-sm text-zinc-400">
                &quot;Always sanitize your inputs. The Ghost in the Shell is watching.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
