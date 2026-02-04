'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CommandHistory {
  command: string
  output: React.ReactNode
  timestamp: Date
  status?: 'success' | 'error' | 'info'
}

interface CommandLineProps {
  onCommand?: (command: string) => Promise<{ output: React.ReactNode; status?: 'success' | 'error' | 'info' }>
  initialCommands?: CommandHistory[]
  welcomeMessage?: React.ReactNode
  prompt?: string
  className?: string
}

export function CommandLine({
  onCommand,
  initialCommands = [],
  welcomeMessage,
  prompt = '❯',
  className
}: CommandLineProps) {
  const [history, setHistory] = useState<CommandHistory[]>(initialCommands)
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [history, scrollToBottom])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isProcessing) return

    const command = input.trim()
    setInput('')
    setHistoryIndex(-1)
    setIsProcessing(true)

    // Built-in commands
    if (command === 'clear') {
      setHistory([])
      setIsProcessing(false)
      return
    }

    if (command === 'help') {
      setHistory(prev => [...prev, {
        command,
        output: (
          <div className="space-y-1 text-zinc-400">
            <div><span className="text-cyan-400">clear</span> - Clear terminal</div>
            <div><span className="text-cyan-400">help</span> - Show this help</div>
            <div><span className="text-cyan-400">echo [text]</span> - Print text</div>
            <div><span className="text-cyan-400">date</span> - Show current date</div>
            <div><span className="text-cyan-400">whoami</span> - Show user info</div>
          </div>
        ),
        timestamp: new Date(),
        status: 'info'
      }])
      setIsProcessing(false)
      return
    }

    if (command.startsWith('echo ')) {
      setHistory(prev => [...prev, {
        command,
        output: command.slice(5),
        timestamp: new Date(),
        status: 'success'
      }])
      setIsProcessing(false)
      return
    }

    if (command === 'date') {
      setHistory(prev => [...prev, {
        command,
        output: new Date().toLocaleString(),
        timestamp: new Date(),
        status: 'success'
      }])
      setIsProcessing(false)
      return
    }

    if (command === 'whoami') {
      setHistory(prev => [...prev, {
        command,
        output: (
          <div className="text-cyan-400">
            <div>User: <span className="text-white">Agent_Zero</span></div>
            <div>Level: <span className="text-green-400">42</span></div>
            <div>Status: <span className="text-green-400">Active</span></div>
          </div>
        ),
        timestamp: new Date(),
        status: 'success'
      }])
      setIsProcessing(false)
      return
    }

    // Custom command handler
    if (onCommand) {
      try {
        const result = await onCommand(command)
        setHistory(prev => [...prev, {
          command,
          output: result.output,
          timestamp: new Date(),
          status: result.status || 'success'
        }])
      } catch (error) {
        setHistory(prev => [...prev, {
          command,
          output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date(),
          status: 'error'
        }])
      }
    } else {
      setHistory(prev => [...prev, {
        command,
        output: `Command not found: ${command}`,
        timestamp: new Date(),
        status: 'error'
      }])
    }

    setIsProcessing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const commands = history.filter(h => h.command).map(h => h.command)
      if (commands.length > 0) {
        const newIndex = historyIndex < commands.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commands[commands.length - 1 - newIndex] || '')
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        const commands = history.filter(h => h.command).map(h => h.command)
        setInput(commands[commands.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      // Auto-complete could be added here
    }
  }

  return (
    <div 
      className={cn(
        'bg-black/95 border border-cyan-500/30 rounded-lg overflow-hidden',
        'shadow-[0_0_30px_rgba(0,255,255,0.1)]',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border-b border-cyan-500/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-zinc-500 text-xs font-mono">AURA://TERMINAL</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-400 font-mono">CONNECTED</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={containerRef}
        className="h-[400px] overflow-y-auto p-4 font-mono text-sm space-y-2"
      >
        {/* Welcome Message */}
        {welcomeMessage && (
          <div className="mb-4 pb-4 border-b border-cyan-500/10">
            {welcomeMessage}
          </div>
        )}

        {/* History */}
        {history.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            {/* Command */}
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">{prompt}</span>
              <span className="text-white">{item.command}</span>
            </div>
            {/* Output */}
            {item.output && (
              <div className={cn(
                'pl-4',
                item.status === 'error' && 'text-red-400',
                item.status === 'success' && 'text-zinc-300',
                item.status === 'info' && 'text-zinc-400'
              )}>
                {item.output}
              </div>
            )}
          </motion.div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-cyan-400">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-white outline-none"
            autoFocus
          />
          {isProcessing && (
            <span className="text-cyan-400 animate-pulse">Processing...</span>
          )}
        </form>

        {/* Cursor */}
        {!isProcessing && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute w-2 h-4 bg-cyan-400"
            style={{ visibility: 'hidden' }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-zinc-900/50 border-t border-cyan-500/10 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600">
          <span>↑↓ History</span>
          <span>TAB Autocomplete</span>
          <span>CTRL+C Cancel</span>
        </div>
        <div className="text-[10px] font-mono text-zinc-600">
          {history.length} commands
        </div>
      </div>
    </div>
  )
}

// Default welcome message
export const defaultWelcomeMessage = (
  <div className="text-cyan-400 space-y-1">
    <pre className="text-[10px] text-cyan-500/70">{`
 █████╗ ██╗   ██╗██████╗  █████╗ 
██╔══██╗██║   ██║██╔══██╗██╔══██╗
███████║██║   ██║██████╔╝███████║
██╔══██║██║   ██║██╔══██╗██╔══██║
██║  ██║╚██████╔╝██║  ██║██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
    `}</pre>
    <div className="text-zinc-400">Welcome to AURA Terminal v2.0</div>
    <div className="text-zinc-600">Type <span className="text-cyan-400">help</span> for available commands</div>
  </div>
)
