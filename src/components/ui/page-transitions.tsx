'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Page transition context
interface TransitionContextType {
  isTransitioning: boolean
  startTransition: (callback: () => void) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

interface TransitionProviderProps {
  children: ReactNode
  duration?: number
  variant?: 'fade' | 'slide' | 'glitch' | 'matrix' | 'scan'
}

export function TransitionProvider({
  children,
  duration = 500,
  variant = 'glitch'
}: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const startTransition = useCallback((callback: () => void) => {
    setIsTransitioning(true)
    setShowOverlay(true)

    setTimeout(() => {
      callback()
      setTimeout(() => {
        setShowOverlay(false)
        setIsTransitioning(false)
      }, duration / 2)
    }, duration / 2)
  }, [duration])

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
      
      {showOverlay && (
        <TransitionOverlay variant={variant} duration={duration} />
      )}
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error('usePageTransition must be used within a TransitionProvider')
  }
  return context
}

// Transition overlay components
interface TransitionOverlayProps {
  variant: 'fade' | 'slide' | 'glitch' | 'matrix' | 'scan'
  duration: number
}

function TransitionOverlay({ variant, duration }: TransitionOverlayProps) {
  const variants = {
    fade: <FadeTransition duration={duration} />,
    slide: <SlideTransition duration={duration} />,
    glitch: <GlitchTransition duration={duration} />,
    matrix: <MatrixTransition duration={duration} />,
    scan: <ScanTransition duration={duration} />
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {variants[variant]}
    </div>
  )
}

function FadeTransition({ duration }: { duration: number }) {
  return (
    <div
      className="absolute inset-0 bg-black"
      style={{
        animation: `fade-transition ${duration}ms ease-in-out`
      }}
    >
      <style jsx>{`
        @keyframes fade-transition {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function SlideTransition({ duration }: { duration: number }) {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-black to-cyan-500"
      style={{
        animation: `slide-transition ${duration}ms ease-in-out`
      }}
    >
      <style jsx>{`
        @keyframes slide-transition {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

function GlitchTransition({ duration }: { duration: number }) {
  return (
    <div className="absolute inset-0">
      {/* Glitch bars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 bg-cyan-500"
          style={{
            height: `${Math.random() * 10 + 2}px`,
            top: `${Math.random() * 100}%`,
            animation: `glitch-bar ${duration / 2}ms ease-in-out`,
            animationDelay: `${Math.random() * 100}ms`,
            opacity: Math.random() * 0.8 + 0.2
          }}
        />
      ))}
      
      {/* Flash */}
      <div
        className="absolute inset-0 bg-white"
        style={{
          animation: `flash ${duration}ms ease-in-out`
        }}
      />

      <style jsx>{`
        @keyframes glitch-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
        @keyframes flash {
          0% { opacity: 0; }
          25% { opacity: 0.3; }
          50% { opacity: 0; }
          75% { opacity: 0.1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function MatrixTransition({ duration }: { duration: number }) {
  const chars = '01アイウエオカキクケコ'
  
  return (
    <div className="absolute inset-0 bg-black/90 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 text-green-500 font-mono text-sm whitespace-nowrap"
          style={{
            left: `${i * 3.33}%`,
            animation: `matrix-fall ${duration}ms linear`,
            animationDelay: `${Math.random() * 200}ms`
          }}
        >
          {Array.from({ length: 30 }).map((_, j) => (
            <div key={j} style={{ opacity: 1 - j * 0.03 }}>
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </div>
      ))}

      <style jsx>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  )
}

function ScanTransition({ duration }: { duration: number }) {
  return (
    <div className="absolute inset-0">
      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-1 bg-cyan-500"
        style={{
          boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
          animation: `scan-line ${duration}ms ease-in-out`
        }}
      />
      
      {/* Trailing effect */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
        style={{
          animation: `scan-trail ${duration}ms ease-in-out`
        }}
      />

      <style jsx>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scan-trail {
          0% { opacity: 1; transform: translateY(-100%); }
          100% { opacity: 0; transform: translateY(100%); }
        }
      `}</style>
    </div>
  )
}

// Page wrapper with enter/exit animations
interface AnimatedPageProps {
  children: ReactNode
  className?: string
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <div
      className={cn('animate-page-enter', className)}
    >
      {children}
      
      <style jsx>{`
        @keyframes page-enter {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-page-enter {
          animation: page-enter 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
