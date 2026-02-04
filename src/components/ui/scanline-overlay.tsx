'use client'

import { cn } from '@/lib/utils'

interface ScanlineOverlayProps {
  opacity?: number
  speed?: 'slow' | 'medium' | 'fast'
  color?: string
  className?: string
}

export function ScanlineOverlay({
  opacity = 0.1,
  speed = 'medium',
  color = 'cyan',
  className
}: ScanlineOverlayProps) {
  const speeds = {
    slow: '8s',
    medium: '4s',
    fast: '2s'
  }

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-50', className)}>
      {/* Static scanlines */}
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, ${opacity}) 2px,
            rgba(0, 0, 0, ${opacity}) 4px
          )`
        }}
      />
      
      {/* Moving scanline */}
      <div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, var(--neon-${color}), transparent)`,
          boxShadow: `0 0 10px var(--neon-${color})`,
          animation: `scan-vertical ${speeds[speed]} linear infinite`
        }}
      />

      <style jsx>{`
        @keyframes scan-vertical {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}

interface CRTEffectProps {
  children: React.ReactNode
  className?: string
  enableFlicker?: boolean
  enableCurvature?: boolean
}

export function CRTEffect({
  children,
  className,
  enableFlicker = true,
  enableCurvature = false
}: CRTEffectProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        enableFlicker && 'crt-flicker',
        className
      )}
      style={enableCurvature ? {
        borderRadius: '20px',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.5)'
      } : undefined}
    >
      {children}
      
      {/* CRT glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  )
}

interface VignetteProps {
  intensity?: 'light' | 'medium' | 'heavy'
  className?: string
}

export function Vignette({ intensity = 'medium', className }: VignetteProps) {
  const intensityMap = {
    light: '50px',
    medium: '100px',
    heavy: '150px'
  }

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-40', className)}
      style={{
        boxShadow: `inset 0 0 ${intensityMap[intensity]} rgba(0, 0, 0, 0.5)`
      }}
    />
  )
}

interface NoiseOverlayProps {
  opacity?: number
  className?: string
}

export function NoiseOverlay({ opacity = 0.03, className }: NoiseOverlayProps) {
  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-50', className)}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }}
    />
  )
}
