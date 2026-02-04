'use client'

import { cn } from '@/lib/utils'

interface FloatingOrbsProps {
  count?: number
  colors?: string[]
  minSize?: number
  maxSize?: number
  className?: string
}

export function FloatingOrbs({
  count = 5,
  colors = ['#00ffff', '#39ff14', '#ff00ff', '#bf00ff'],
  minSize = 100,
  maxSize = 300,
  className
}: FloatingOrbsProps) {
  return (
    <div className={cn('fixed inset-0 overflow-hidden pointer-events-none z-0', className)}>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * (maxSize - minSize) + minSize
        const color = colors[i % colors.length]
        const delay = Math.random() * 5
        const duration = 15 + Math.random() * 10
        const startX = Math.random() * 100
        const startY = Math.random() * 100

        return (
          <div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              left: `${startX}%`,
              top: `${startY}%`,
              animation: `float-orb-${i} ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`
            }}
          />
        )
      })}
      
      <style jsx>{`
        ${Array.from({ length: count }).map((_, i) => `
          @keyframes float-orb-${i} {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
            }
            25% { 
              transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${0.8 + Math.random() * 0.4});
            }
            50% { 
              transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${0.8 + Math.random() * 0.4});
            }
            75% { 
              transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${0.8 + Math.random() * 0.4});
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  )
}

interface GlowingOrbProps {
  size?: number
  color?: string
  pulseSpeed?: number
  className?: string
}

export function GlowingOrb({
  size = 200,
  color = '#00ffff',
  pulseSpeed = 3,
  className
}: GlowingOrbProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: color,
          opacity: 0.3,
          animation: `pulse-orb ${pulseSpeed}s ease-in-out infinite`
        }}
      />
      
      {/* Middle glow */}
      <div
        className="absolute inset-[15%] rounded-full blur-xl"
        style={{
          background: color,
          opacity: 0.5,
          animation: `pulse-orb ${pulseSpeed}s ease-in-out infinite`,
          animationDelay: '0.2s'
        }}
      />
      
      {/* Core */}
      <div
        className="absolute inset-[30%] rounded-full"
        style={{
          background: `radial-gradient(circle, white 0%, ${color} 50%, transparent 100%)`,
          boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`
        }}
      />

      <style jsx>{`
        @keyframes pulse-orb {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

interface EnergyRingProps {
  size?: number
  color?: string
  thickness?: number
  speed?: number
  className?: string
}

export function EnergyRing({
  size = 150,
  color = '#00ffff',
  thickness = 2,
  speed = 3,
  className
}: EnergyRingProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      {/* Rotating ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `${thickness}px solid transparent`,
          borderTopColor: color,
          borderRightColor: color,
          animation: `spin-ring ${speed}s linear infinite`,
          boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}20`
        }}
      />
      
      {/* Static ring */}
      <div
        className="absolute inset-[10%] rounded-full"
        style={{
          border: `${thickness / 2}px solid ${color}40`
        }}
      />

      <style jsx>{`
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
