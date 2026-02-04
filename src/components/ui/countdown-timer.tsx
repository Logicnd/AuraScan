'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  targetDate: Date | string
  onComplete?: () => void
  variant?: 'default' | 'cyber' | 'hud' | 'minimal'
  showLabels?: boolean
  className?: string
}

export function CountdownTimer({
  targetDate,
  onComplete,
  variant = 'cyber',
  showLabels = true,
  className
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const updateTimer = () => {
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        setIsComplete(true)
        onComplete?.()
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  const formatNumber = (n: number) => n.toString().padStart(2, '0')

  if (isComplete) {
    return (
      <div className={cn('font-mono text-cyan-400 text-center', className)}>
        <span className="text-2xl animate-pulse">COMPLETE</span>
      </div>
    )
  }

  const variants = {
    default: (
      <div className={cn('flex gap-4 font-mono', className)}>
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-3xl font-bold text-white">{formatNumber(value)}</div>
            {showLabels && (
              <div className="text-xs text-zinc-500 uppercase">{key}</div>
            )}
          </div>
        ))}
      </div>
    ),
    cyber: (
      <div className={cn('flex gap-2', className)}>
        {Object.entries(timeLeft).map(([key, value], i) => (
          <div key={key} className="relative">
            <div className="bg-black/80 border border-cyan-500/50 rounded-lg p-3 min-w-[60px] text-center shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              <div className="text-2xl font-mono font-bold text-cyan-400">
                {formatNumber(value)}
              </div>
              {showLabels && (
                <div className="text-[10px] text-cyan-500/60 uppercase tracking-wider mt-1">
                  {key}
                </div>
              )}
            </div>
            {i < 3 && (
              <span className="absolute top-1/2 -right-2 -translate-y-1/2 text-cyan-500 text-xl font-bold">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    ),
    hud: (
      <div className={cn('font-mono', className)}>
        <div className="flex items-center gap-1 text-cyan-400">
          <span className="text-xs text-cyan-500/50">T-</span>
          <span className="text-xl">{formatNumber(timeLeft.days)}</span>
          <span className="text-cyan-500/50">:</span>
          <span className="text-xl">{formatNumber(timeLeft.hours)}</span>
          <span className="text-cyan-500/50">:</span>
          <span className="text-xl">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-cyan-500/50">:</span>
          <span className="text-xl">{formatNumber(timeLeft.seconds)}</span>
        </div>
        {showLabels && (
          <div className="flex gap-4 text-[8px] text-zinc-600 mt-1">
            <span className="w-6 text-center">DAY</span>
            <span className="w-6 text-center">HRS</span>
            <span className="w-6 text-center">MIN</span>
            <span className="w-6 text-center">SEC</span>
          </div>
        )}
      </div>
    ),
    minimal: (
      <div className={cn('font-mono text-cyan-400', className)}>
        {formatNumber(timeLeft.days)}d {formatNumber(timeLeft.hours)}h{' '}
        {formatNumber(timeLeft.minutes)}m {formatNumber(timeLeft.seconds)}s
      </div>
    )
  }

  return variants[variant]
}

interface TimerProps {
  duration: number // in seconds
  onComplete?: () => void
  autoStart?: boolean
  className?: string
}

export function Timer({
  duration,
  onComplete,
  autoStart = true,
  className
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(autoStart)

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, onComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((duration - timeLeft) / duration) * 100

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-4">
        <div className="font-mono text-2xl text-cyan-400">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 text-xs font-mono border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors"
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        <button
          onClick={() => {
            setTimeLeft(duration)
            setIsRunning(false)
          }}
          className="px-3 py-1 text-xs font-mono border border-zinc-700 text-zinc-400 rounded hover:bg-zinc-800 transition-colors"
        >
          RESET
        </button>
      </div>
    </div>
  )
}

interface ClockDisplayProps {
  format?: '12h' | '24h'
  showSeconds?: boolean
  showDate?: boolean
  variant?: 'default' | 'cyber' | 'minimal'
  className?: string
}

export function ClockDisplay({
  format = '24h',
  showSeconds = true,
  showDate = false,
  variant = 'cyber',
  className
}: ClockDisplayProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = () => {
    let hours = time.getHours()
    const minutes = time.getMinutes().toString().padStart(2, '0')
    const seconds = time.getSeconds().toString().padStart(2, '0')
    let period = ''

    if (format === '12h') {
      period = hours >= 12 ? ' PM' : ' AM'
      hours = hours % 12 || 12
    }

    const hoursStr = hours.toString().padStart(2, '0')
    return `${hoursStr}:${minutes}${showSeconds ? ':' + seconds : ''}${period}`
  }

  const formatDate = () => {
    return time.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const variants = {
    default: (
      <div className={cn('font-mono text-white', className)}>
        <div className="text-2xl">{formatTime()}</div>
        {showDate && <div className="text-xs text-zinc-500">{formatDate()}</div>}
      </div>
    ),
    cyber: (
      <div className={cn('font-mono', className)}>
        <div className="text-3xl text-cyan-400" style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>
          {formatTime()}
        </div>
        {showDate && (
          <div className="text-xs text-cyan-500/60 tracking-wider">{formatDate()}</div>
        )}
      </div>
    ),
    minimal: (
      <span className={cn('font-mono text-zinc-400', className)}>
        {formatTime()}
      </span>
    )
  }

  return variants[variant]
}
