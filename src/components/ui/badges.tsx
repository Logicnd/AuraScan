'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface BadgeProps {
  name: string
  description?: string
  icon: ReactNode | string
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  unlocked?: boolean
  progress?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const rarityStyles = {
  common: {
    border: 'border-zinc-500/50',
    bg: 'bg-zinc-500/10',
    glow: '',
    text: 'text-zinc-400',
    label: 'COMMON'
  },
  uncommon: {
    border: 'border-green-500/50',
    bg: 'bg-green-500/10',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
    text: 'text-green-400',
    label: 'UNCOMMON'
  },
  rare: {
    border: 'border-cyan-500/50',
    bg: 'bg-cyan-500/10',
    glow: 'shadow-[0_0_20px_rgba(0,255,255,0.4)]',
    text: 'text-cyan-400',
    label: 'RARE'
  },
  epic: {
    border: 'border-purple-500/50',
    bg: 'bg-purple-500/10',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    text: 'text-purple-400',
    label: 'EPIC'
  },
  legendary: {
    border: 'border-orange-500/50',
    bg: 'bg-gradient-to-br from-orange-500/20 via-yellow-500/20 to-orange-500/20',
    glow: 'shadow-[0_0_30px_rgba(251,146,60,0.6)]',
    text: 'text-orange-400',
    label: 'LEGENDARY'
  }
}

const sizeStyles = {
  sm: { container: 'w-16 h-16', icon: 'text-2xl', text: 'text-[10px]' },
  md: { container: 'w-24 h-24', icon: 'text-4xl', text: 'text-xs' },
  lg: { container: 'w-32 h-32', icon: 'text-5xl', text: 'text-sm' }
}

export function Badge({
  name,
  description,
  icon,
  rarity = 'common',
  unlocked = true,
  progress,
  size = 'md',
  className
}: BadgeProps) {
  const styles = rarityStyles[rarity]
  const sizes = sizeStyles[size]

  return (
    <div className={cn('relative group', className)}>
      {/* Badge container */}
      <div
        className={cn(
          'relative rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300',
          sizes.container,
          styles.border,
          styles.bg,
          unlocked ? styles.glow : 'grayscale opacity-50',
          unlocked && 'hover:scale-105'
        )}
      >
        {/* Hexagon pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M15 0l13 7.5v15L15 30 2 22.5v-15z\" fill=\"none\" stroke=\"%23fff\" stroke-opacity=\".3\"/%3E%3C/svg%3E')]" />
        </div>

        {/* Icon */}
        <span className={cn(sizes.icon, unlocked ? styles.text : 'text-zinc-600')}>
          {icon}
        </span>

        {/* Lock overlay for locked badges */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
            <span className="text-2xl">🔒</span>
          </div>
        )}

        {/* Progress bar for locked badges */}
        {!unlocked && progress !== undefined && (
          <div className="absolute bottom-1 left-1 right-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn('h-full', styles.text.replace('text-', 'bg-'))}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Animated border for legendary */}
        {rarity === 'legendary' && unlocked && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 opacity-30"
              style={{ animation: 'shimmer 2s linear infinite' }}
            />
          </div>
        )}
      </div>

      {/* Name tooltip */}
      <div className="mt-2 text-center">
        <p className={cn('font-mono font-semibold truncate', sizes.text, styles.text)}>
          {name}
        </p>
        <p className={cn('font-mono opacity-50', sizeStyles.sm.text)}>
          {styles.label}
        </p>
      </div>

      {/* Hover tooltip */}
      {description && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 border border-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-[150px]">
          <p className="text-xs text-zinc-300 text-center">{description}</p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black border-r border-b border-zinc-800" />
        </div>
      )}
    </div>
  )
}
}

interface AchievementProps {
  title: string
  description: string
  icon: ReactNode | string
  xpReward: number
  unlocked?: boolean
  unlockedAt?: string
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  className?: string
}

export function Achievement({
  title,
  description,
  icon,
  xpReward,
  unlocked = false,
  unlockedAt,
  rarity = 'common',
  className
}: AchievementProps) {
  const styles = rarityStyles[rarity]

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 p-4 rounded-lg border transition-all duration-300',
        styles.border,
        styles.bg,
        unlocked ? styles.glow : 'grayscale opacity-60',
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        'flex-shrink-0 w-14 h-14 rounded-lg border flex items-center justify-center text-2xl',
        styles.border,
        unlocked ? styles.text : 'text-zinc-600'
      )}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn('font-mono font-bold', unlocked ? styles.text : 'text-zinc-500')}>
            {title}
          </h3>
          <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded', styles.bg, styles.text)}>
            {styles.label}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">{description}</p>
        {unlockedAt && unlocked && (
          <p className="text-[10px] text-zinc-600 mt-1">Unlocked: {unlockedAt}</p>
        )}
      </div>

      {/* XP Reward */}
      <div className="flex-shrink-0 text-right">
        <div className={cn('text-lg font-mono font-bold', unlocked ? 'text-yellow-500' : 'text-zinc-600')}>
          +{xpReward}
        </div>
        <div className="text-[10px] text-zinc-600 font-mono">XP</div>
      </div>

      {/* Lock icon */}
      {!unlocked && (
        <div className="absolute top-2 right-2 text-zinc-600">🔒</div>
      )}
    </div>
  )
}

interface LevelBadgeProps {
  level: number
  title: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LevelBadge({ level, title, size = 'md', className }: LevelBadgeProps) {
  const tierColors = [
    { min: 1, max: 10, color: 'from-zinc-500 to-zinc-600', glow: '' },
    { min: 11, max: 25, color: 'from-green-500 to-emerald-600', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.4)]' },
    { min: 26, max: 50, color: 'from-cyan-500 to-blue-600', glow: 'shadow-[0_0_20px_rgba(0,255,255,0.5)]' },
    { min: 51, max: 75, color: 'from-purple-500 to-violet-600', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]' },
    { min: 76, max: 100, color: 'from-orange-500 to-red-600', glow: 'shadow-[0_0_30px_rgba(251,146,60,0.6)]' }
  ]

  const tier = tierColors.find(t => level >= t.min && level <= t.max) || tierColors[tierColors.length - 1]

  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl'
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'rounded-full bg-gradient-to-br flex items-center justify-center font-mono font-bold text-white',
        tier.color,
        tier.glow,
        sizes[size]
      )}>
        {level}
      </div>
      <div className="font-mono text-zinc-400 text-sm">{title}</div>
    </div>
  )
}
