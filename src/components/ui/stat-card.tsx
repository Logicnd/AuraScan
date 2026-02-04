'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down' | 'stable'
  }
  variant?: 'default' | 'cyber' | 'neon' | 'glass' | 'minimal'
  color?: 'cyan' | 'green' | 'magenta' | 'purple' | 'orange'
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'cyber',
  color = 'cyan',
  className
}: StatCardProps) {
  const colorStyles = {
    cyan: {
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_20px_rgba(0,255,255,0.2)]',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/5'
    },
    green: {
      border: 'border-green-500/30',
      glow: 'shadow-[0_0_20px_rgba(57,255,20,0.2)]',
      text: 'text-green-400',
      bg: 'bg-green-500/5'
    },
    magenta: {
      border: 'border-pink-500/30',
      glow: 'shadow-[0_0_20px_rgba(255,0,255,0.2)]',
      text: 'text-pink-400',
      bg: 'bg-pink-500/5'
    },
    purple: {
      border: 'border-purple-500/30',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
      text: 'text-purple-400',
      bg: 'bg-purple-500/5'
    },
    orange: {
      border: 'border-orange-500/30',
      glow: 'shadow-[0_0_20px_rgba(251,146,60,0.2)]',
      text: 'text-orange-400',
      bg: 'bg-orange-500/5'
    }
  }

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→'
  }

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-zinc-400'
  }

  const styles = colorStyles[color]

  const variants = {
    default: (
      <div className={cn('p-4 rounded-lg bg-zinc-900 border border-zinc-800', className)}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-zinc-500">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {subtitle && <p className="text-xs text-zinc-600 mt-1">{subtitle}</p>}
          </div>
          {icon && <div className="text-2xl text-zinc-600">{icon}</div>}
        </div>
        {trend && (
          <div className={cn('flex items-center gap-1 mt-2 text-sm', trendColors[trend.direction])}>
            <span>{trendIcons[trend.direction]}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    ),
    cyber: (
      <div className={cn(
        'relative p-5 rounded-lg border backdrop-blur-sm transition-all duration-300',
        styles.border,
        styles.bg,
        styles.glow,
        'hover:scale-[1.02]',
        className
      )}>
        {/* HUD corners */}
        <div className={cn('absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2', styles.border)} />
        <div className={cn('absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2', styles.border)} />
        <div className={cn('absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2', styles.border)} />
        <div className={cn('absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2', styles.border)} />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{title}</p>
            <p className={cn('text-3xl font-mono font-bold mt-1', styles.text)}>{value}</p>
            {subtitle && (
              <p className="text-xs text-zinc-600 font-mono mt-1">{subtitle}</p>
            )}
          </div>
          {icon && <div className={cn('text-3xl', styles.text)}>{icon}</div>}
        </div>
        
        {trend && (
          <div className={cn('flex items-center gap-1 mt-3 text-sm font-mono', trendColors[trend.direction])}>
            <span>{trendIcons[trend.direction]}</span>
            <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
          </div>
        )}
      </div>
    ),
    neon: (
      <div className={cn(
        'relative p-5 rounded-lg bg-black border-2 transition-all duration-300',
        styles.border,
        'hover:' + styles.glow,
        className
      )}>
        <div className="flex items-start justify-between">
          <div>
            <p className={cn('text-xs font-mono', styles.text)}>{title}</p>
            <p className="text-4xl font-bold text-white mt-2">{value}</p>
          </div>
          {icon && (
            <div className={cn('text-4xl', styles.text)} style={{ filter: `drop-shadow(0 0 10px currentColor)` }}>
              {icon}
            </div>
          )}
        </div>
        
        {trend && (
          <div className={cn(
            'absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-mono',
            trendColors[trend.direction]
          )}>
            {trendIcons[trend.direction]} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    ),
    glass: (
      <div className={cn(
        'p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        className
      )}>
        <div className="flex items-center gap-3">
          {icon && <div className="text-3xl">{icon}</div>}
          <div>
            <p className="text-xs text-zinc-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
      </div>
    ),
    minimal: (
      <div className={cn('flex items-center gap-3', className)}>
        {icon && <div className={cn('text-xl', styles.text)}>{icon}</div>}
        <div>
          <p className="text-xs text-zinc-500">{title}</p>
          <p className={cn('text-xl font-mono font-bold', styles.text)}>{value}</p>
        </div>
      </div>
    )
  }

  return variants[variant]
}

interface StatsGridProps {
  stats: Omit<StatCardProps, 'variant' | 'className'>[]
  variant?: StatCardProps['variant']
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ stats, variant = 'cyber', columns = 4, className }: StatsGridProps) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn('grid gap-4', colClasses[columns], className)}>
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} variant={variant} />
      ))}
    </div>
  )
}
