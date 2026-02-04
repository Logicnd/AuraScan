'use client'

import { useRef, useState, useEffect, ReactNode, MouseEvent as ReactMouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltAmount?: number
  glareOpacity?: number
  scale?: number
  perspective?: number
  disabled?: boolean
}

export function TiltCard({
  children,
  className,
  tiltAmount = 15,
  glareOpacity = 0.2,
  scale = 1.02,
  perspective = 1000,
  disabled = false
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glareStyle, setGlareStyle] = useState({})

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltAmount
    const rotateY = ((x - centerX) / centerX) * tiltAmount

    setTransform(`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`)
    
    // Calculate glare position
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100
    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
      opacity: 1
    })
  }

  const handleMouseLeave = () => {
    setTransform('')
    setGlareStyle({ opacity: 0 })
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden transition-transform duration-200 ease-out',
        className
      )}
      style={{ transform, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={glareStyle}
      />
    </div>
  )
}

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({
  children,
  className,
  strength = 30
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    setPosition({
      x: distanceX / rect.width * strength,
      y: distanceY / rect.height * strength
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <button
      ref={buttonRef}
      className={cn('transition-transform duration-200', className)}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
  delay?: number
}

export function FloatingElement({
  children,
  className,
  amplitude = 10,
  duration = 3,
  delay = 0
}: FloatingElementProps) {
  return (
    <div
      className={cn('animate-float', className)}
      style={{
        animation: `float-element ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      {children}
      
      <style jsx>{`
        @keyframes float-element {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-${amplitude}px); }
        }
      `}</style>
    </div>
  )
}

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  spotlightSize?: number
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(0, 255, 255, 0.15)',
  spotlightSize = 300
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setSpotlightPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div
      ref={cardRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(${spotlightSize}px circle at ${spotlightPosition.x}px ${spotlightPosition.y}px, ${spotlightColor}, transparent 100%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
    </div>
  )
}

interface GlowingBorderProps {
  children: ReactNode
  className?: string
  colors?: string[]
  speed?: number
  borderWidth?: number
}

export function GlowingBorder({
  children,
  className,
  colors = ['#00ffff', '#ff00ff', '#39ff14'],
  speed = 3,
  borderWidth = 2
}: GlowingBorderProps) {
  return (
    <div className={cn('relative p-px rounded-lg', className)}>
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(${90}deg, ${colors.join(', ')})`,
          backgroundSize: '300% 300%',
          animation: `gradient-rotate ${speed}s linear infinite`,
          padding: borderWidth
        }}
      />
      
      {/* Content container */}
      <div className="relative rounded-lg bg-black">
        {children}
      </div>

      <style jsx>{`
        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
