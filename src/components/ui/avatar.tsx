'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'cyber' | 'neon' | 'status'
  status?: 'online' | 'offline' | 'away' | 'busy'
  level?: number
  className?: string
}

export function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  variant = 'cyber',
  status,
  level,
  className
}: AvatarProps) {
  const sizes = {
    xs: { container: 'w-6 h-6', text: 'text-[10px]', status: 'w-2 h-2', level: 'text-[8px] w-4 h-4' },
    sm: { container: 'w-8 h-8', text: 'text-xs', status: 'w-2.5 h-2.5', level: 'text-[9px] w-5 h-5' },
    md: { container: 'w-10 h-10', text: 'text-sm', status: 'w-3 h-3', level: 'text-[10px] w-6 h-6' },
    lg: { container: 'w-14 h-14', text: 'text-base', status: 'w-3.5 h-3.5', level: 'text-xs w-7 h-7' },
    xl: { container: 'w-20 h-20', text: 'text-lg', status: 'w-4 h-4', level: 'text-sm w-8 h-8' }
  }

  const statusColors = {
    online: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]',
    offline: 'bg-zinc-600',
    away: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]',
    busy: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
  }

  const variants = {
    default: 'border-2 border-zinc-700',
    cyber: 'border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]',
    neon: 'border-2 border-green-500 shadow-[0_0_20px_rgba(57,255,20,0.5)]',
    status: 'border-2 border-zinc-700'
  }

  const getInitials = () => {
    if (fallback) return fallback.slice(0, 2).toUpperCase()
    if (alt) return alt.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    return '??'
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden bg-zinc-800',
          sizes[size].container,
          variants[variant]
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center font-mono font-bold',
            sizes[size].text,
            variant === 'cyber' ? 'text-cyan-400' : 'text-zinc-400'
          )}>
            {getInitials()}
          </div>
        )}

        {/* Scanline effect for cyber variant */}
        {variant === 'cyber' && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute w-full h-[2px] bg-cyan-400/30"
              style={{ animation: 'avatar-scan 2s linear infinite' }}
            />
          </div>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-black',
            sizes[size].status,
            statusColors[status]
          )}
        />
      )}

      {/* Level badge */}
      {level && (
        <div
          className={cn(
            'absolute -bottom-1 -right-1 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600',
            'flex items-center justify-center font-mono font-bold text-white',
            'shadow-[0_0_10px_rgba(0,255,255,0.5)]',
            sizes[size].level
          )}
        >
          {level}
        </div>
      )}

      <style jsx>{`
        @keyframes avatar-scan {
          from { top: 0; }
          to { top: 100%; }
        }
      `}</style>
    </div>
  )
}

interface AvatarGroupProps {
  avatars: { src?: string; alt?: string; fallback?: string }[]
  max?: number
  size?: AvatarProps['size']
  className?: string
}

export function AvatarGroup({ avatars, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const remaining = avatars.length - max

  const overlaps = {
    xs: '-ml-2',
    sm: '-ml-2.5',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-5'
  }

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((avatar, i) => (
        <div key={i} className={cn(i > 0 && overlaps[size])}>
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            fallback={avatar.fallback}
            size={size}
            variant="cyber"
          />
        </div>
      ))}
      {remaining > 0 && (
        <div className={overlaps[size]}>
          <Avatar
            fallback={`+${remaining}`}
            size={size}
            variant="default"
          />
        </div>
      )}
    </div>
  )
}

interface UserCardProps {
  name: string
  title?: string
  avatar?: string
  level?: number
  xp?: number
  xpMax?: number
  status?: 'online' | 'offline' | 'away' | 'busy'
  className?: string
}

export function UserCard({
  name,
  title,
  avatar,
  level,
  xp,
  xpMax,
  status,
  className
}: UserCardProps) {
  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-lg bg-black/80 border border-cyan-500/30',
      'shadow-[0_0_15px_rgba(0,255,255,0.1)]',
      className
    )}>
      <Avatar
        src={avatar}
        alt={name}
        size="lg"
        variant="cyber"
        status={status}
        level={level}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-mono font-bold text-white truncate">{name}</h4>
        {title && (
          <p className="text-xs font-mono text-cyan-400">{title}</p>
        )}
        {xp !== undefined && xpMax !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
              <span>XP</span>
              <span>{xp}/{xpMax}</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(0,255,255,0.5)]"
                style={{ width: `${(xp / xpMax) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
