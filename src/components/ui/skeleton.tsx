'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'cyber' | 'neon' | 'pulse'
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const variants = {
    default: 'animate-pulse bg-zinc-800',
    cyber: 'skeleton bg-zinc-900',
    neon: 'animate-pulse bg-gradient-to-r from-cyan-500/10 via-cyan-500/20 to-cyan-500/10',
    pulse: 'animate-pulse bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%]'
  }

  return (
    <div className={cn('rounded-md', variants[variant], className)} />
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
  variant?: 'default' | 'cyber' | 'neon'
}

export function SkeletonText({ lines = 3, className, variant = 'cyber' }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
  showImage?: boolean
  showTitle?: boolean
  showDescription?: boolean
}

export function SkeletonCard({
  className,
  showImage = true,
  showTitle = true,
  showDescription = true
}: SkeletonCardProps) {
  return (
    <div className={cn(
      'rounded-lg border border-cyan-500/20 bg-black/60 p-4 space-y-4',
      className
    )}>
      {showImage && (
        <Skeleton variant="cyber" className="h-40 w-full rounded-lg" />
      )}
      {showTitle && (
        <Skeleton variant="cyber" className="h-6 w-2/3" />
      )}
      {showDescription && (
        <SkeletonText lines={2} variant="cyber" />
      )}
    </div>
  )
}

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <Skeleton variant="cyber" className={cn('rounded-full', sizes[size], className)} />
  )
}

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-cyan-500/20">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="cyber" className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4" style={{ animationDelay: `${rowIndex * 0.05}s` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              variant="cyber" 
              className="h-4 flex-1"
              style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.02}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface CyberLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'cyan' | 'green' | 'magenta' | 'purple'
  className?: string
}

export function CyberLoader({ size = 'md', color = 'cyan', className }: CyberLoaderProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  const colors = {
    cyan: '#00ffff',
    green: '#39ff14',
    magenta: '#ff00ff',
    purple: '#bf00ff'
  }

  return (
    <div className={cn('relative', sizes[size], className)}>
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: colors[color],
          borderRightColor: `${colors[color]}50`,
          animationDuration: '1s'
        }}
      />
      
      {/* Inner ring */}
      <div
        className="absolute inset-[20%] rounded-full border-2 border-transparent animate-spin"
        style={{
          borderBottomColor: colors[color],
          borderLeftColor: `${colors[color]}50`,
          animationDuration: '0.75s',
          animationDirection: 'reverse'
        }}
      />
      
      {/* Center dot */}
      <div
        className="absolute inset-[40%] rounded-full animate-pulse"
        style={{ backgroundColor: colors[color] }}
      />
    </div>
  )
}

interface LoadingDotsProps {
  color?: 'cyan' | 'green' | 'magenta' | 'white'
  className?: string
}

export function LoadingDots({ color = 'cyan', className }: LoadingDotsProps) {
  const colors = {
    cyan: 'bg-cyan-400',
    green: 'bg-green-400',
    magenta: 'bg-pink-400',
    white: 'bg-white'
  }

  return (
    <div className={cn('flex gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn('w-2 h-2 rounded-full animate-bounce', colors[color])}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}
