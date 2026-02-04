'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface RadarScanProps {
  size?: number
  color?: string
  scanSpeed?: number
  dotCount?: number
  className?: string
}

export function RadarScan({
  size = 200,
  color = '#00ffff',
  scanSpeed = 3,
  dotCount = 8,
  className
}: RadarScanProps) {
  const [dots, setDots] = useState<{ x: number; y: number; opacity: number }[]>([])

  useEffect(() => {
    // Generate random dots
    const newDots = Array.from({ length: dotCount }).map(() => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      opacity: Math.random() * 0.5 + 0.5
    }))
    setDots(newDots)
  }, [dotCount])

  return (
    <div
      className={cn('relative rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, transparent 0%, ${color}10 100%)`,
        border: `2px solid ${color}40`
      }}
    >
      {/* Concentric circles */}
      {[0.25, 0.5, 0.75].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            top: `${(1 - scale) * 50}%`,
            left: `${(1 - scale) * 50}%`,
            border: `1px solid ${color}20`
          }}
        />
      ))}

      {/* Cross lines */}
      <div
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{ background: `${color}20` }}
      />
      <div
        className="absolute top-0 bottom-0 left-1/2 w-px"
        style={{ background: `${color}20` }}
      />

      {/* Radar sweep */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          animation: `radar-sweep ${scanSpeed}s linear infinite`
        }}
      >
        <div
          className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
          style={{
            background: `conic-gradient(from -90deg, transparent 0deg, ${color}60 30deg, transparent 60deg)`
          }}
        />
      </div>

      {/* Detection dots */}
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            transform: 'translate(-50%, -50%)',
            background: color,
            opacity: dot.opacity,
            boxShadow: `0 0 10px ${color}`
          }}
        />
      ))}

      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background: color,
          boxShadow: `0 0 15px ${color}`
        }}
      />

      <style jsx>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

interface ScanLineEffectProps {
  children: React.ReactNode
  scanning?: boolean
  color?: string
  speed?: number
  className?: string
}

export function ScanLineEffect({
  children,
  scanning = true,
  color = '#00ffff',
  speed = 2,
  className
}: ScanLineEffectProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      
      {scanning && (
        <div
          className="absolute left-0 right-0 h-1 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 20px ${color}`,
            animation: `scan-move ${speed}s ease-in-out infinite`
          }}
        />
      )}

      <style jsx>{`
        @keyframes scan-move {
          0%, 100% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}

interface PulseScanProps {
  size?: number
  color?: string
  pulseCount?: number
  className?: string
}

export function PulseScan({
  size = 150,
  color = '#00ffff',
  pulseCount = 3,
  className
}: PulseScanProps) {
  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      {/* Pulse rings */}
      {Array.from({ length: pulseCount }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}`,
            animation: `pulse-expand 2s ease-out infinite`,
            animationDelay: `${i * (2 / pulseCount)}s`
          }}
        />
      ))}

      {/* Center */}
      <div
        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background: color,
          boxShadow: `0 0 20px ${color}`
        }}
      />

      <style jsx>{`
        @keyframes pulse-expand {
          0% {
            transform: scale(0.3);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

interface HexagonRadarProps {
  size?: number
  color?: string
  className?: string
}

export function HexagonRadar({
  size = 200,
  color = '#00ffff',
  className
}: HexagonRadarProps) {
  const points = [0, 60, 120, 180, 240, 300].map(angle => {
    const rad = (angle * Math.PI) / 180
    return {
      x: 50 + 45 * Math.cos(rad),
      y: 50 + 45 * Math.sin(rad)
    }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Hexagon layers */}
        {[1, 0.66, 0.33].map((scale, i) => (
          <path
            key={i}
            d={pathD}
            fill="none"
            stroke={color}
            strokeOpacity={0.2}
            strokeWidth={0.5}
            transform={`scale(${scale}) translate(${(1 - scale) * 50} ${(1 - scale) * 50})`}
          />
        ))}

        {/* Main hexagon */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeOpacity={0.5}
          strokeWidth={1}
        />

        {/* Animated sweep */}
        <g style={{ animation: 'hex-rotate 4s linear infinite' }}>
          <line
            x1="50"
            y1="50"
            x2="95"
            y2="50"
            stroke={color}
            strokeWidth={2}
            strokeOpacity={0.8}
          />
        </g>

        {/* Center point */}
        <circle cx="50" cy="50" r="3" fill={color} />
      </svg>

      <style jsx>{`
        @keyframes hex-rotate {
          from { transform: rotate(0deg); transform-origin: center; }
          to { transform: rotate(360deg); transform-origin: center; }
        }
      `}</style>
    </div>
  )
}
