'use client'

import { Activity } from 'lucide-react'

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        System Logs
      </h3>
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center gap-4 text-sm p-3 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer group">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-zinc-500 font-mono">09:4{i}:22</span>
            <span className="text-zinc-300 group-hover:text-green-400 transition-colors">
              Encrypted data packet intercepted from sector 7G.
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
