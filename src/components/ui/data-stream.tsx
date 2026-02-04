'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface DataStreamProps {
  className?: string
  direction?: 'vertical' | 'horizontal'
  speed?: 'slow' | 'medium' | 'fast'
  color?: 'cyan' | 'green' | 'magenta'
  density?: 'low' | 'medium' | 'high'
}

export function DataStream({
  className,
  direction = 'vertical',
  speed = 'medium',
  color = 'green',
  density = 'medium'
}: DataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const colors = {
      cyan: '#00ffff',
      green: '#39ff14',
      magenta: '#ff00ff'
    }

    const speeds = {
      slow: 2,
      medium: 4,
      fast: 8
    }

    const densities = {
      low: 15,
      medium: 10,
      high: 5
    }

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 14
    const columns = Math.floor(canvas.width / densities[density])
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = colors[color]
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = direction === 'vertical' ? i * densities[density] : drops[i] * densities[density]
        const y = direction === 'vertical' ? drops[i] * fontSize : i * fontSize

        // Add glow effect to some characters
        if (Math.random() > 0.95) {
          ctx.shadowBlur = 10
          ctx.shadowColor = colors[color]
        } else {
          ctx.shadowBlur = 0
        }

        ctx.fillText(char, x, y)

        const limit = direction === 'vertical' ? canvas.height : canvas.width

        if ((direction === 'vertical' ? drops[i] * fontSize : drops[i] * densities[density]) > limit && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i] += speeds[speed] / 10
      }
    }

    const interval = setInterval(draw, 33)
    window.addEventListener('resize', resize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [direction, speed, color, density])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0', className)}
    />
  )
}

interface BinaryStreamProps {
  text?: string
  className?: string
  speed?: number
}

export function BinaryStream({ text = '01', className, speed = 50 }: BinaryStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chars = text.split('')
    const interval = setInterval(() => {
      const spans = container.querySelectorAll('span')
      spans.forEach((span) => {
        if (Math.random() > 0.9) {
          span.textContent = chars[Math.floor(Math.random() * chars.length)]
        }
      })
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <div ref={containerRef} className={cn('font-mono text-green-500/50 text-xs overflow-hidden', className)}>
      {Array.from({ length: 100 }).map((_, i) => (
        <span key={i}>{text[i % text.length]}</span>
      ))}
    </div>
  )
}

interface CodeRainProps {
  className?: string
}

export function CodeRain({ className }: CodeRainProps) {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 text-green-500 font-mono text-sm opacity-30"
          style={{
            left: `${i * 5}%`,
            animation: `fall ${3 + Math.random() * 5}s linear infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} style={{ opacity: 1 - j * 0.05 }}>
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  )
}
