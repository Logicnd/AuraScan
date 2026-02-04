'use client'

import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-green-500 opacity-50 animate-glitch-1 clip-path-polygon-1">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-50 animate-glitch-2 clip-path-polygon-2">
        {text}
      </span>
    </div>
  )
}
