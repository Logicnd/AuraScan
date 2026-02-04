'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface GlitchImageProps {
  src: string
  alt: string
  width: number
  height: number
  intensity?: 'low' | 'medium' | 'high'
  continuous?: boolean
  hoverTrigger?: boolean
  className?: string
}

export function GlitchImage({
  src,
  alt,
  width,
  height,
  intensity = 'medium',
  continuous = false,
  hoverTrigger = true,
  className
}: GlitchImageProps) {
  const [isGlitching, setIsGlitching] = useState(continuous)

  useEffect(() => {
    if (continuous) {
      const interval = setInterval(() => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      }, 3000 + Math.random() * 2000)
      return () => clearInterval(interval)
    }
  }, [continuous])

  const intensityValues = {
    low: { offset: 2, opacity: 0.3 },
    medium: { offset: 5, opacity: 0.5 },
    high: { offset: 10, opacity: 0.7 }
  }

  const { offset, opacity } = intensityValues[intensity]

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
      onMouseEnter={() => hoverTrigger && setIsGlitching(true)}
      onMouseLeave={() => hoverTrigger && !continuous && setIsGlitching(false)}
    >
      {/* Base image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
      />

      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Red channel offset */}
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              transform: `translateX(${offset}px)`,
              filter: 'url(#redChannel)',
              opacity
            }}
          >
            <Image src={src} alt="" width={width} height={height} className="object-cover" />
          </div>

          {/* Cyan channel offset */}
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              transform: `translateX(-${offset}px)`,
              filter: 'url(#cyanChannel)',
              opacity
            }}
          >
            <Image src={src} alt="" width={width} height={height} className="object-cover" />
          </div>

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
            }}
          />

          {/* Random glitch bars */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 bg-cyan-500/30"
              style={{
                height: Math.random() * 10 + 2,
                top: `${Math.random() * 100}%`,
                transform: `translateX(${Math.random() * 20 - 10}px)`,
                animation: `glitch-bar ${0.1 + Math.random() * 0.2}s ease-in-out`
              }}
            />
          ))}
        </>
      )}

      {/* SVG filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="redChannel">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="cyanChannel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes glitch-bar {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  continuous?: boolean
}

export function GlitchTextAdvanced({
  text,
  className,
  intensity = 'medium',
  continuous = false
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(continuous)

  useEffect(() => {
    if (continuous) {
      const interval = setInterval(() => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 150)
      }, 2000 + Math.random() * 3000)
      return () => clearInterval(interval)
    }
  }, [continuous])

  const intensityClasses = {
    low: 'glitch-intensity-low',
    medium: 'glitch-intensity-medium',
    high: 'glitch-intensity-high'
  }

  return (
    <span
      className={cn(
        'relative inline-block',
        isGlitching && intensityClasses[intensity],
        className
      )}
      data-text={text}
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => !continuous && setIsGlitching(false)}
    >
      {text}
      
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-cyan-500 opacity-70"
            style={{ 
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              animation: 'glitch-top 0.2s infinite'
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-red-500 opacity-70"
            style={{ 
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              animation: 'glitch-bottom 0.3s infinite'
            }}
          >
            {text}
          </span>
        </>
      )}

      <style jsx>{`
        @keyframes glitch-top {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-3px, -2px); }
          40% { transform: translate(3px, 2px); }
          60% { transform: translate(-2px, 1px); }
          80% { transform: translate(2px, -1px); }
        }
        @keyframes glitch-bottom {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(3px, 2px); }
          40% { transform: translate(-3px, -2px); }
          60% { transform: translate(2px, -1px); }
          80% { transform: translate(-2px, 1px); }
        }
      `}</style>
    </span>
  )
}

interface CorruptedTextProps {
  text: string
  corruptionLevel?: number // 0-1
  className?: string
}

export function CorruptedText({
  text,
  corruptionLevel = 0.3,
  className
}: CorruptedTextProps) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    const corruptChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▀▄'
    
    const corrupt = () => {
      const chars = text.split('')
      const corrupted = chars.map(char => {
        if (char === ' ') return char
        if (Math.random() < corruptionLevel) {
          return corruptChars[Math.floor(Math.random() * corruptChars.length)]
        }
        return char
      })
      setDisplayText(corrupted.join(''))
    }

    const interval = setInterval(corrupt, 100)
    return () => clearInterval(interval)
  }, [text, corruptionLevel])

  return (
    <span className={cn('font-mono', className)}>
      {displayText}
    </span>
  )
}
