'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface KarmaMeterProps {
  value: number // -100 to 100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showValue?: boolean
  className?: string
}

export function KarmaMeter({
  value,
  size = 'md',
  showLabel = true,
  showValue = true,
  className
}: KarmaMeterProps) {
  const clampedValue = Math.max(-100, Math.min(100, value))
  const normalizedValue = (clampedValue + 100) / 200 // 0 to 1
  
  const getKarmaStatus = () => {
    if (clampedValue >= 75) return { label: 'SAINT', color: 'text-cyan-400', glow: 'cyan' }
    if (clampedValue >= 50) return { label: 'HERO', color: 'text-green-400', glow: 'green' }
    if (clampedValue >= 25) return { label: 'GOOD', color: 'text-lime-400', glow: 'lime' }
    if (clampedValue >= -25) return { label: 'NEUTRAL', color: 'text-yellow-400', glow: 'yellow' }
    if (clampedValue >= -50) return { label: 'DUBIOUS', color: 'text-orange-400', glow: 'orange' }
    if (clampedValue >= -75) return { label: 'VILLAIN', color: 'text-red-400', glow: 'red' }
    return { label: 'CORRUPT', color: 'text-red-600', glow: 'red' }
  }

  const status = getKarmaStatus()

  const sizes = {
    sm: { width: 150, height: 80, stroke: 6 },
    md: { width: 200, height: 110, stroke: 8 },
    lg: { width: 280, height: 150, stroke: 10 }
  }

  const { width, height, stroke } = sizes[size]
  const radius = (height - stroke) 
  const centerX = width / 2
  const centerY = height

  // Arc parameters (180-degree arc)
  const startAngle = Math.PI
  const endAngle = 0
  const angle = startAngle - (startAngle - endAngle) * normalizedValue

  const startX = centerX - radius * Math.cos(startAngle)
  const startY = centerY - radius * Math.sin(startAngle)
  const endX = centerX - radius * Math.cos(endAngle)
  const endY = centerY - radius * Math.sin(endAngle)

  const pointerX = centerX - radius * Math.cos(angle)
  const pointerY = centerY - radius * Math.sin(angle)

  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width, height: height + 20 }}>
        <svg width={width} height={height + 20} viewBox={`0 0 ${width} ${height + 20}`}>
          {/* Background arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="karmaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Colored arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="url(#karmaGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            opacity={0.3}
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const tickAngle = startAngle - (startAngle - endAngle) * (tick / 100)
            const innerRadius = radius - stroke
            const outerRadius = radius + stroke / 2
            const x1 = centerX - innerRadius * Math.cos(tickAngle)
            const y1 = centerY - innerRadius * Math.sin(tickAngle)
            const x2 = centerX - outerRadius * Math.cos(tickAngle)
            const y2 = centerY - outerRadius * Math.sin(tickAngle)
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={2}
              />
            )
          })}

          {/* Pointer */}
          <motion.g
            initial={{ rotate: 180 }}
            animate={{ rotate: 180 - normalizedValue * 180 }}
            style={{ originX: `${centerX}px`, originY: `${centerY}px` }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          >
            <circle
              cx={pointerX}
              cy={pointerY}
              r={stroke / 2 + 4}
              fill="white"
              filter="url(#glow)"
            />
            <circle
              cx={pointerX}
              cy={pointerY}
              r={stroke / 2}
              fill="currentColor"
              className={status.color}
            />
          </motion.g>

          {/* Center point */}
          <circle cx={centerX} cy={centerY} r={4} fill="white" opacity={0.5} />
        </svg>

        {/* Labels */}
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-red-400">-100</div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyan-400">+100</div>
      </div>

      {/* Value and Label */}
      <div className="text-center -mt-2">
        {showValue && (
          <motion.div
            key={clampedValue}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={cn('text-2xl font-mono font-bold', status.color)}
          >
            {clampedValue > 0 ? '+' : ''}{clampedValue}
          </motion.div>
        )}
        {showLabel && (
          <div className={cn('text-xs font-mono tracking-wider', status.color)}>
            {status.label}
          </div>
        )}
      </div>
    </div>
  )
}

interface EthicsGaugeProps {
  categories: Array<{
    name: string
    value: number // 0 to 100
    icon?: string
  }>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function EthicsGauge({ categories, size = 'md', className }: EthicsGaugeProps) {
  const getColor = (value: number) => {
    if (value >= 80) return 'text-green-400 bg-green-500'
    if (value >= 60) return 'text-lime-400 bg-lime-500'
    if (value >= 40) return 'text-yellow-400 bg-yellow-500'
    if (value >= 20) return 'text-orange-400 bg-orange-500'
    return 'text-red-400 bg-red-500'
  }

  const sizes = {
    sm: { bar: 'h-1.5', text: 'text-[10px]', gap: 'gap-1.5' },
    md: { bar: 'h-2', text: 'text-xs', gap: 'gap-2' },
    lg: { bar: 'h-3', text: 'text-sm', gap: 'gap-3' }
  }

  const sizeStyle = sizes[size]

  return (
    <div className={cn(
      'bg-black/60 border border-cyan-500/30 rounded-lg p-4',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Ethics Rating
        </h3>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-zinc-600 font-mono">LIVE</span>
        </div>
      </div>

      <div className={cn('space-y-3', sizeStyle.gap)}>
        {categories.map((category) => {
          const colorClass = getColor(category.value)
          return (
            <div key={category.name}>
              <div className="flex items-center justify-between mb-1">
                <span className={cn('font-mono text-zinc-400', sizeStyle.text)}>
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {category.name}
                </span>
                <span className={cn('font-mono font-bold', sizeStyle.text, colorClass.split(' ')[0])}>
                  {category.value}%
                </span>
              </div>
              <div className={cn('w-full bg-zinc-800 rounded-full overflow-hidden', sizeStyle.bar)}>
                <motion.div
                  className={cn('h-full rounded-full', colorClass.split(' ')[1])}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.value}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    boxShadow: `0 0 10px currentColor`
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall score */}
      <div className="mt-4 pt-4 border-t border-cyan-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500">OVERALL RATING</span>
          <span className={cn(
            'text-lg font-mono font-bold',
            getColor(categories.reduce((acc, c) => acc + c.value, 0) / categories.length).split(' ')[0]
          )}>
            {Math.round(categories.reduce((acc, c) => acc + c.value, 0) / categories.length)}%
          </span>
        </div>
      </div>
    </div>
  )
}

// Demo data
export const demoEthicsCategories = [
  { name: 'Environmental', value: 72, icon: '🌍' },
  { name: 'Labor Practices', value: 45, icon: '👷' },
  { name: 'Transparency', value: 88, icon: '🔍' },
  { name: 'Animal Welfare', value: 33, icon: '🐾' },
  { name: 'Community Impact', value: 65, icon: '🏘️' }
]
