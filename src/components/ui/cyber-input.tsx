'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'neon' | 'holographic' | 'terminal' | 'hud'
  glowColor?: 'cyan' | 'green' | 'magenta' | 'purple'
  showScanline?: boolean
}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, type, variant = 'default', glowColor = 'cyan', showScanline = false, ...props }, ref) => {
    const glowColors = {
      cyan: {
        border: 'border-cyan-500/50 focus:border-cyan-400',
        shadow: 'focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]',
        text: 'text-cyan-100 placeholder:text-cyan-500/50'
      },
      green: {
        border: 'border-green-500/50 focus:border-green-400',
        shadow: 'focus:shadow-[0_0_20px_rgba(57,255,20,0.3)]',
        text: 'text-green-100 placeholder:text-green-500/50'
      },
      magenta: {
        border: 'border-pink-500/50 focus:border-pink-400',
        shadow: 'focus:shadow-[0_0_20px_rgba(255,0,255,0.3)]',
        text: 'text-pink-100 placeholder:text-pink-500/50'
      },
      purple: {
        border: 'border-purple-500/50 focus:border-purple-400',
        shadow: 'focus:shadow-[0_0_20px_rgba(191,0,255,0.3)]',
        text: 'text-purple-100 placeholder:text-purple-500/50'
      }
    }

    const variants = {
      default: cn(
        "flex h-10 w-full rounded-md border bg-black/50 px-3 py-2 text-sm backdrop-blur-sm",
        "transition-all duration-300",
        glowColors[glowColor].border,
        glowColors[glowColor].shadow,
        glowColors[glowColor].text,
        "focus:outline-none focus:ring-1 focus:ring-current"
      ),
      neon: cn(
        "flex h-12 w-full rounded-lg border-2 bg-black px-4 py-3 text-sm",
        "transition-all duration-300",
        glowColors[glowColor].border,
        "focus:shadow-[0_0_30px_rgba(0,255,255,0.5),inset_0_0_20px_rgba(0,255,255,0.1)]",
        glowColors[glowColor].text,
        "focus:outline-none"
      ),
      holographic: cn(
        "flex h-12 w-full rounded-lg border bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10",
        "px-4 py-3 text-sm text-white placeholder:text-white/50",
        "border-white/20 focus:border-white/40",
        "focus:shadow-[0_0_30px_rgba(255,255,255,0.2)]",
        "backdrop-blur-xl transition-all duration-300",
        "focus:outline-none"
      ),
      terminal: cn(
        "flex h-10 w-full rounded-none border-b-2 border-l-0 border-r-0 border-t-0",
        "bg-transparent px-0 py-2 font-mono text-sm",
        "border-green-500/50 focus:border-green-400",
        "text-green-400 placeholder:text-green-500/30",
        "focus:outline-none transition-all duration-300",
        "caret-green-400"
      ),
      hud: cn(
        "flex h-12 w-full bg-black/80 px-4 py-3 text-sm",
        "border-2 border-cyan-500/50 text-cyan-300 placeholder:text-cyan-500/40",
        "focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]",
        "clip-path-[polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]",
        "focus:outline-none transition-all duration-300 font-mono"
      )
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            variants[variant],
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {showScanline && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
            <div 
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
              style={{ animation: 'scan-input 2s linear infinite' }}
            />
          </div>
        )}
        <style jsx>{`
          @keyframes scan-input {
            0% { top: 0; }
            100% { top: 100%; }
          }
        `}</style>
      </div>
    )
  }
)
CyberInput.displayName = "CyberInput"

interface CyberTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  glowColor?: 'cyan' | 'green' | 'magenta' | 'purple'
}

const CyberTextarea = React.forwardRef<HTMLTextAreaElement, CyberTextareaProps>(
  ({ className, glowColor = 'cyan', ...props }, ref) => {
    const glowStyles = {
      cyan: 'border-cyan-500/50 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] text-cyan-100',
      green: 'border-green-500/50 focus:border-green-400 focus:shadow-[0_0_20px_rgba(57,255,20,0.3)] text-green-100',
      magenta: 'border-pink-500/50 focus:border-pink-400 focus:shadow-[0_0_20px_rgba(255,0,255,0.3)] text-pink-100',
      purple: 'border-purple-500/50 focus:border-purple-400 focus:shadow-[0_0_20px_rgba(191,0,255,0.3)] text-purple-100'
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border bg-black/50 px-4 py-3 text-sm",
          "backdrop-blur-sm transition-all duration-300",
          "placeholder:text-current/30 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none",
          glowStyles[glowColor],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
CyberTextarea.displayName = "CyberTextarea"

export { CyberInput, CyberTextarea }
