'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypingTerminalProps {
  text: string | string[]
  speed?: number
  delay?: number
  cursor?: boolean
  className?: string
  onComplete?: () => void
  loop?: boolean
  prefix?: string
}

export function TypingTerminal({
  text,
  speed = 50,
  delay = 1000,
  cursor = true,
  className,
  onComplete,
  loop = false,
  prefix = '> '
}: TypingTerminalProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const lines = useMemo(() => (Array.isArray(text) ? text : [text]), [text])

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      if (loop) {
        setTimeout(() => {
          setDisplayedText('')
          setCurrentLineIndex(0)
        }, delay * 2)
      } else {
        onComplete?.()
      }
      return
    }

    const currentLine = lines[currentLineIndex]
    const fullText = prefix + currentLine

    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1))
      }, speed + Math.random() * 30)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText('')
        setCurrentLineIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [displayedText, currentLineIndex, lines, speed, delay, loop, prefix, onComplete])

  return (
    <div className={cn('font-mono text-green-400', className)}>
      <span>{displayedText}</span>
      {cursor && (
        <span className="typing-cursor animate-pulse">▌</span>
      )}
    </div>
  )
}

interface TerminalWindowProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function TerminalWindow({
  children,
  title = 'terminal',
  className
}: TerminalWindowProps) {
  return (
    <div className={cn(
      'rounded-lg overflow-hidden border border-zinc-800 bg-black/90',
      'shadow-[0_0_30px_rgba(0,255,255,0.1)]',
      className
    )}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-zinc-500 font-mono ml-2">{title}</span>
      </div>
      
      {/* Content */}
      <div className="p-4 min-h-[100px]">
        {children}
      </div>
    </div>
  )
}

interface AnimatedCommandLineProps {
  commands: { command: string; output?: string; delay?: number }[]
  className?: string
}

export function AnimatedCommandLine({ commands, className }: AnimatedCommandLineProps) {
  const [visibleCommands, setVisibleCommands] = useState<number>(0)
  const [currentText, setCurrentText] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    if (visibleCommands >= commands.length) return

    const cmd = commands[visibleCommands]
    const fullText = `$ ${cmd.command}`

    if (currentText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setCurrentText(fullText.slice(0, currentText.length + 1))
      }, 30 + Math.random() * 20)
      return () => clearTimeout(timeout)
    } else if (!showOutput) {
      const timeout = setTimeout(() => {
        setShowOutput(true)
      }, 200)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentText('')
        setShowOutput(false)
        setVisibleCommands(prev => prev + 1)
      }, cmd.delay || 1500)
      return () => clearTimeout(timeout)
    }
  }, [currentText, showOutput, visibleCommands, commands])

  return (
    <div className={cn('font-mono text-sm space-y-2', className)}>
      {commands.slice(0, visibleCommands).map((cmd, i) => (
        <div key={i}>
          <div className="text-green-400">$ {cmd.command}</div>
          {cmd.output && <div className="text-zinc-400 ml-2">{cmd.output}</div>}
        </div>
      ))}
      
      {visibleCommands < commands.length && (
        <div>
          <span className="text-green-400">{currentText}</span>
          <span className="typing-cursor">▌</span>
          {showOutput && commands[visibleCommands].output && (
            <div className="text-zinc-400 ml-2 animate-pulse">
              {commands[visibleCommands].output}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
