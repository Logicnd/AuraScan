'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Command {
  id: string
  label: string
  description?: string
  shortcut?: string[]
  icon?: React.ReactNode
  action: () => void
  category?: string
}

interface CommandPaletteProps {
  commands: Command[]
  isOpen: boolean
  onClose: () => void
  placeholder?: string
  className?: string
}

export function CommandPalette({
  commands,
  isOpen,
  onClose,
  placeholder = 'Search commands...',
  className
}: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category?.toLowerCase().includes(search.toLowerCase())
  )

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    const category = cmd.category || 'General'
    if (!acc[category]) acc[category] = []
    acc[category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % filteredCommands.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length)
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
          onClose()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }, [filteredCommands, selectedIndex, onClose])

  // Global shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          // Parent should handle opening
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isOpen, onClose])

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    selectedEl?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className={cn(
              'fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50',
              className
            )}
          >
            <div className="bg-black/95 border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(0,255,255,0.15)] overflow-hidden">
              {/* Search Input */}
              <div className="relative border-b border-cyan-500/20">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setSelectedIndex(0)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full bg-transparent px-12 py-4 text-white font-mono text-sm outline-none placeholder:text-zinc-600"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="px-2 py-1 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded">ESC</kbd>
                </div>
              </div>

              {/* Commands List */}
              <div ref={listRef} className="max-h-[400px] overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-zinc-600 font-mono text-sm">No commands found</div>
                    <div className="text-zinc-700 font-mono text-xs mt-1">
                      Try a different search term
                    </div>
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, cmds]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider bg-zinc-900/50">
                        {category}
                      </div>
                      {cmds.map((cmd) => {
                        const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id)
                        return (
                          <button
                            key={cmd.id}
                            data-index={globalIndex}
                            onClick={() => {
                              cmd.action()
                              onClose()
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 text-left transition-all',
                              globalIndex === selectedIndex
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'text-zinc-400 hover:bg-zinc-900'
                            )}
                          >
                            {cmd.icon && (
                              <span className="text-lg opacity-70">{cmd.icon}</span>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm truncate">{cmd.label}</div>
                              {cmd.description && (
                                <div className="font-mono text-xs text-zinc-600 truncate">
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                            {cmd.shortcut && (
                              <div className="flex items-center gap-1">
                                {cmd.shortcut.map((key, i) => (
                                  <kbd
                                    key={i}
                                    className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-500 rounded"
                                  >
                                    {key}
                                  </kbd>
                                ))}
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-zinc-600">
                <div className="flex items-center gap-4">
                  <span><kbd className="px-1 py-0.5 bg-zinc-800 rounded">↑↓</kbd> Navigate</span>
                  <span><kbd className="px-1 py-0.5 bg-zinc-800 rounded">↵</kbd> Select</span>
                  <span><kbd className="px-1 py-0.5 bg-zinc-800 rounded">ESC</kbd> Close</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  <span>{filteredCommands.length} commands</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for command palette
export function useCommandPalette(commands: Command[]) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
    CommandPaletteComponent: (
      <CommandPalette
        commands={commands}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    )
  }
}
