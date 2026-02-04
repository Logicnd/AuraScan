'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedProgressProps {
  value: number
  max?: number
  showValue?: boolean
  variant?: 'default' | 'neon' | 'gradient' | 'striped' | 'cyber'
  color?: 'cyan' | 'green' | 'magenta' | 'purple' | 'orange' | 'rainbow'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function AnimatedProgress({
  value,
  max = 100,
  showValue = false,
  variant = 'neon',
  color = 'cyan',
  size = 'md',
  animated = true,
  className
}: AnimatedProgressProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    if (animated) {
      const duration = 1000
      const steps = 60
      const increment = percentage / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= percentage) {
          setDisplayValue(percentage)
          clearInterval(timer)
        } else {
          setDisplayValue(current)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    } else {
      setDisplayValue(percentage)
    }
  }, [percentage, animated])

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  }

  const colorStyles = {
    cyan: {
      bg: 'bg-cyan-500',
      glow: 'shadow-[0_0_10px_rgba(0,255,255,0.5)]',
      gradient: 'from-cyan-600 to-cyan-400'
    },
    green: {
      bg: 'bg-green-500',
      glow: 'shadow-[0_0_10px_rgba(57,255,20,0.5)]',
      gradient: 'from-green-600 to-green-400'
    },
    magenta: {
      bg: 'bg-pink-500',
      glow: 'shadow-[0_0_10px_rgba(255,0,255,0.5)]',
      gradient: 'from-pink-600 to-pink-400'
    },
    purple: {
      bg: 'bg-purple-500',
      glow: 'shadow-[0_0_10px_rgba(191,0,255,0.5)]',
      gradient: 'from-purple-600 to-purple-400'
    },
    orange: {
      bg: 'bg-orange-500',
      glow: 'shadow-[0_0_10px_rgba(255,165,0,0.5)]',
      gradient: 'from-orange-600 to-orange-400'
    },
    rainbow: {
      bg: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 to-purple-500',
      glow: 'shadow-[0_0_15px_rgba(255,255,255,0.3)]',
      gradient: 'from-red-500 via-cyan-500 to-purple-500'
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return cn(colorStyles[color].bg, colorStyles[color].glow)
      case 'gradient':
        return cn('bg-gradient-to-r', colorStyles[color].gradient)
      case 'striped':
        return cn(
          colorStyles[color].bg,
          'bg-[length:20px_20px]',
          'bg-gradient-to-r from-transparent via-white/20 to-transparent',
          animated && 'animate-[stripe_1s_linear_infinite]'
        )
      case 'cyber':
        return cn(
          'bg-gradient-to-r',
          colorStyles[color].gradient,
          colorStyles[color].glow,
          'relative overflow-hidden',
          "after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] after:animate-[shimmer_2s_infinite]"
        )
      default:
        return colorStyles[color].bg
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {showValue && (
        <div className="flex justify-between text-xs font-mono text-zinc-500 mb-1">
          <span>{Math.round(displayValue)}%</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className={cn(
        'w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800',
        sizes[size]
      )}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', getVariantStyles())}
          style={{ width: `${displayValue}%` }}
        />
      </div>
      
      <style jsx>{`
        @keyframes stripe {
          0% { background-position: 0 0; }
          100% { background-position: 20px 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: 'cyan' | 'green' | 'magenta' | 'purple'
  showValue?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 100,
  strokeWidth = 8,
  color = 'cyan',
  showValue = true,
  className
}: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedValue / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(percentage), 100)
    return () => clearTimeout(timer)
  }, [percentage])

  const colors = {
    cyan: { stroke: '#00ffff', glow: 'drop-shadow(0 0 10px rgba(0,255,255,0.5))' },
    green: { stroke: '#39ff14', glow: 'drop-shadow(0 0 10px rgba(57,255,20,0.5))' },
    magenta: { stroke: '#ff00ff', glow: 'drop-shadow(0 0 10px rgba(255,0,255,0.5))' },
    purple: { stroke: '#bf00ff', glow: 'drop-shadow(0 0 10px rgba(191,0,255,0.5))' }
  }

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ filter: colors[color].glow }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color].stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="font-mono font-bold"
            style={{ color: colors[color].stroke, fontSize: size / 4 }}
          >
            {Math.round(animatedValue)}%
          </span>
        </div>
      )}
    </div>
  )
}

interface SegmentedProgressProps {
  value: number
  segments?: number
  color?: 'cyan' | 'green' | 'magenta'
  className?: string
}

export function SegmentedProgress({
  value,
  segments = 10,
  color = 'cyan',
  className
}: SegmentedProgressProps) {
  const filledSegments = Math.round((value / 100) * segments)

  const colors = {
    cyan: { filled: 'bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]', empty: 'bg-zinc-800' },
    green: { filled: 'bg-green-500 shadow-[0_0_10px_rgba(57,255,20,0.5)]', empty: 'bg-zinc-800' },
    magenta: { filled: 'bg-pink-500 shadow-[0_0_10px_rgba(255,0,255,0.5)]', empty: 'bg-zinc-800' }
  }

  return (
    <div className={cn('flex gap-1', className)}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 h-3 rounded-sm transition-all duration-300',
            i < filledSegments ? colors[color].filled : colors[color].empty
          )}
          style={{ transitionDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  )
}
