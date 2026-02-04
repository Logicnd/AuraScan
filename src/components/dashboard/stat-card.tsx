'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  color: string
  border: string
  bg: string
  trend?: string
  delay?: number
}

export function StatCard({ label, value, icon: Icon, color, border, bg, trend = "+2.4%", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 rounded-2xl border ${border} bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-900/50 transition-colors`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-full ${bg} ${color} opacity-80`}>
          {trend}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-zinc-500">{label}</div>
    </motion.div>
  )
}
