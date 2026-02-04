'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface HUDFrameProps {
  children: ReactNode
  title?: string
  status?: 'online' | 'offline' | 'warning' | 'critical'
  className?: string
}

export function HUDFrame({
  children,
  title = 'SYSTEM',
  status = 'online',
  className
}: HUDFrameProps) {
  const statusColors = {
    online: { color: '#39ff14', label: 'ONLINE' },
    offline: { color: '#666666', label: 'OFFLINE' },
    warning: { color: '#ffaa00', label: 'WARNING' },
    critical: { color: '#ff0044', label: 'CRITICAL' }
  }

  return (
    <div className={cn(
      'relative border border-cyan-500/30 bg-black/80 backdrop-blur-xl',
      className
    )}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: statusColors[status].color }}
            />
            <span 
              className="text-[10px] font-mono tracking-widest"
              style={{ color: statusColors[status].color }}
            >
              {statusColors[status].label}
            </span>
          </div>
          <span className="text-xs font-mono text-cyan-400 tracking-wider">{title}</span>
        </div>
        <div className="text-[10px] font-mono text-cyan-500/50">
          {new Date().toISOString().split('T')[0]}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400" />

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

interface HUDStatProps {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  color?: 'cyan' | 'green' | 'magenta' | 'orange'
}

export function HUDStat({ label, value, unit, trend, color = 'cyan' }: HUDStatProps) {
  const colors = {
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    magenta: 'text-pink-400',
    orange: 'text-orange-400'
  }

  const trendIcons = {
    up: '▲',
    down: '▼',
    stable: '●'
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-2xl font-mono font-bold', colors[color])}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-zinc-500">{unit}</span>
        )}
        {trend && (
          <span className={cn(
            'text-xs',
            trend === 'up' && 'text-green-400',
            trend === 'down' && 'text-red-400',
            trend === 'stable' && 'text-zinc-500'
          )}>
            {trendIcons[trend]}
          </span>
        )}
      </div>
    </div>
  )
}

interface HUDProgressProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: 'cyan' | 'green' | 'magenta' | 'orange'
  size?: 'sm' | 'md' | 'lg'
}

export function HUDProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'cyan',
  size = 'md'
}: HUDProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colors = {
    cyan: { bg: 'bg-cyan-500', glow: 'shadow-[0_0_10px_rgba(0,255,255,0.5)]' },
    green: { bg: 'bg-green-500', glow: 'shadow-[0_0_10px_rgba(57,255,20,0.5)]' },
    magenta: { bg: 'bg-pink-500', glow: 'shadow-[0_0_10px_rgba(255,0,255,0.5)]' },
    orange: { bg: 'bg-orange-500', glow: 'shadow-[0_0_10px_rgba(255,165,0,0.5)]' }
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  return (
    <div className="space-y-1">
      {(label || showPercentage) && (
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          {label && <span className="uppercase tracking-wider">{label}</span>}
          {showPercentage && <span>{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800', sizes[size])}>
        <div
          className={cn('h-full transition-all duration-500', colors[color].bg, colors[color].glow)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface HUDAlertProps {
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  timestamp?: string
}

export function HUDAlert({ type, message, timestamp }: HUDAlertProps) {
  const styles = {
    info: { border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', text: 'text-cyan-400', icon: 'ℹ' },
    success: { border: 'border-green-500/50', bg: 'bg-green-500/10', text: 'text-green-400', icon: '✓' },
    warning: { border: 'border-orange-500/50', bg: 'bg-orange-500/10', text: 'text-orange-400', icon: '⚠' },
    error: { border: 'border-red-500/50', bg: 'bg-red-500/10', text: 'text-red-400', icon: '✕' }
  }

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 border rounded font-mono text-sm',
      styles[type].border,
      styles[type].bg
    )}>
      <span className={cn('text-lg', styles[type].text)}>{styles[type].icon}</span>
      <div className="flex-1">
        <p className={styles[type].text}>{message}</p>
        {timestamp && (
          <p className="text-[10px] text-zinc-500 mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  )
}

interface DataGridProps {
  data: { label: string; value: string | number }[]
  columns?: 2 | 3 | 4
  className?: string
}

export function DataGrid({ data, columns = 2, className }: DataGridProps) {
  return (
    <div className={cn(
      'grid gap-4 font-mono',
      columns === 2 && 'grid-cols-2',
      columns === 3 && 'grid-cols-3',
      columns === 4 && 'grid-cols-4',
      className
    )}>
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
            {item.label}
          </span>
          <span className="text-cyan-400 text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
