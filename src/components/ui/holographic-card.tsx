'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface HolographicCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'cyan' | 'green' | 'magenta' | 'purple'
  animated?: boolean
}

export function HolographicCard({
  children,
  className,
  glowColor = 'cyan',
  animated = true
}: HolographicCardProps) {
  const glowColors = {
    cyan: 'rgba(0, 255, 255, 0.3)',
    green: 'rgba(57, 255, 20, 0.3)',
    magenta: 'rgba(255, 0, 255, 0.3)',
    purple: 'rgba(191, 0, 255, 0.3)'
  }

  const borderColors = {
    cyan: 'border-cyan-500/30',
    green: 'border-green-500/30',
    magenta: 'border-pink-500/30',
    purple: 'border-purple-500/30'
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border backdrop-blur-xl',
        'bg-black/40 transition-all duration-500',
        borderColors[glowColor],
        animated && 'hover:scale-[1.02] hover:border-opacity-60',
        className
      )}
      style={{
        boxShadow: `0 0 30px ${glowColors[glowColor]}, inset 0 0 30px ${glowColors[glowColor].replace('0.3', '0.1')}`
      }}
    >
      {/* Holographic shimmer overlay */}
      <div 
        className={cn(
          'absolute inset-0 opacity-20 pointer-events-none',
          animated && 'holographic-bg'
        )}
      />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px]" />
      </div>

      {/* HUD corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-current opacity-50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-current opacity-50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-current opacity-50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-current opacity-50" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

interface GlassCardProps {
  children: ReactNode
  className?: string
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

export function GlassCard({ children, className, blur = 'lg' }: GlassCardProps) {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-white/5 border border-white/10',
        blurMap[blur],
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        className
      )}
    >
      {children}
    </div>
  )
}

interface NeonCardProps {
  children: ReactNode
  className?: string
  color?: 'cyan' | 'green' | 'magenta' | 'purple' | 'orange'
  hover?: boolean
}

export function NeonCard({ children, className, color = 'cyan', hover = true }: NeonCardProps) {
  const colorMap = {
    cyan: { border: '#00ffff', glow: 'rgba(0, 255, 255, 0.4)' },
    green: { border: '#39ff14', glow: 'rgba(57, 255, 20, 0.4)' },
    magenta: { border: '#ff00ff', glow: 'rgba(255, 0, 255, 0.4)' },
    purple: { border: '#bf00ff', glow: 'rgba(191, 0, 255, 0.4)' },
    orange: { border: '#ff6600', glow: 'rgba(255, 102, 0, 0.4)' }
  }

  return (
    <div
      className={cn(
        'relative rounded-lg bg-black/60 p-px transition-all duration-300',
        hover && 'hover:scale-[1.01]',
        className
      )}
      style={{
        boxShadow: `0 0 20px ${colorMap[color].glow}`,
        border: `1px solid ${colorMap[color].border}40`
      }}
    >
      <div className="relative rounded-lg bg-black/80 p-6">
        {children}
      </div>
    </div>
  )
}
