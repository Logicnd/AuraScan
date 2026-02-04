'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  variant?: 'default' | 'cyber' | 'neon'
  delay?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  side = 'top',
  variant = 'cyber',
  delay = 200,
  className
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsVisible(false)
  }

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-current border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-current border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-current border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-current border-t-transparent border-b-transparent border-l-transparent'
  }

  const variants = {
    default: 'bg-zinc-900 border-zinc-800 text-zinc-200',
    cyber: 'bg-black/95 border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(0,255,255,0.2)]',
    neon: 'bg-black border-green-500 text-green-400 shadow-[0_0_20px_rgba(57,255,20,0.3)]'
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-xs font-mono border rounded whitespace-nowrap',
            'animate-tooltip-enter',
            positions[side],
            variants[variant],
            className
          )}
        >
          {/* HUD corners for cyber variant */}
          {variant === 'cyber' && (
            <>
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyan-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-500" />
            </>
          )}
          
          {content}
          
          {/* Arrow */}
          <div className={cn(
            'absolute w-0 h-0 border-4',
            arrows[side],
            variant === 'cyber' && 'border-t-cyan-500/50',
            variant === 'neon' && 'border-t-green-500',
            variant === 'default' && 'border-t-zinc-800'
          )} />
        </div>
      )}

      <style jsx>{`
        @keyframes tooltip-enter {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(${side === 'top' ? '5px' : side === 'bottom' ? '-5px' : '0'});
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-tooltip-enter {
          animation: tooltip-enter 0.15s ease-out;
        }
      `}</style>
    </div>
  )
}

interface InfoTooltipProps {
  content: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function InfoTooltip({ content, side = 'top' }: InfoTooltipProps) {
  return (
    <Tooltip content={content} side={side} variant="cyber">
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-cyan-500/50 text-cyan-500 text-[10px] cursor-help hover:bg-cyan-500/10 transition-colors">
        ?
      </span>
    </Tooltip>
  )
}
