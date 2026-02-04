'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CyberHeaderProps {
  user?: {
    name: string
    avatar?: string
    level: number
    xp: number
    maxXp: number
  }
  notifications?: number
  className?: string
}

export function CyberHeader({ user, notifications = 0, className }: CyberHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 150)
    }, 5000 + Math.random() * 5000)
    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50',
      'bg-black/80 backdrop-blur-md border-b border-cyan-500/30',
      className
    )}>
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <div className="relative px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="relative w-10 h-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0.5 bg-black rounded-lg flex items-center justify-center">
              <span className="text-xl">🔍</span>
            </div>
            {/* Glow */}
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          <div className={cn('font-mono', glitchActive && 'animate-glitch-text')}>
            <div className="text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text">
              AURASCAN
            </div>
            <div className="text-[10px] text-zinc-600 tracking-wider">
              TRUTH_ENGINE v2.0
            </div>
          </div>
        </Link>

        {/* Center - Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Scan', 'Investigate', 'Database', 'Leaderboard'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="px-4 py-2 text-sm font-mono text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Status indicators */}
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono text-zinc-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>CONNECTED</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span>⏱</span>
              <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-zinc-400 hover:text-cyan-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold"
              >
                {notifications > 9 ? '9+' : notifications}
              </motion.span>
            )}
          </button>

          {/* User */}
          {user ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 bg-zinc-900/80 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all"
            >
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-magenta-500 flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">{user.name[0]}</span>
                )}
                {/* Level badge */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-black border border-cyan-500 rounded text-[8px] font-mono text-cyan-400 flex items-center justify-center">
                  {user.level}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-mono text-white">{user.name}</div>
                <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-magenta-500"
                    style={{ width: `${(user.xp / user.maxXp) * 100}%` }}
                  />
                </div>
              </div>
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-mono text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/10 transition-all"
            >
              Connect
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-cyan-400"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-cyan-500/20"
          >
            <nav className="p-4 space-y-2 bg-black/95">
              {['Scan', 'Investigate', 'Database', 'Leaderboard', 'Settings'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="block px-4 py-3 text-sm font-mono text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-cyan-500/50" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-cyan-500/50" />
    </header>
  )
}

// Cyber Footer
export function CyberFooter({ className }: { className?: string }) {
  return (
    <footer className={cn(
      'relative bg-black/80 border-t border-cyan-500/30 py-8',
      className
    )}>
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo section */}
          <div>
            <div className="font-mono text-lg font-bold text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text mb-2">
              AURASCAN
            </div>
            <p className="text-xs text-zinc-600 font-mono">
              Exposing corporate secrets through collective investigation
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: ['Scan', 'Investigate', 'Database', 'API'] },
            { title: 'Resources', links: ['Docs', 'Blog', 'Community', 'Support'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'License', 'Security'] }
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase()}`}
                      className="text-sm text-zinc-500 hover:text-cyan-400 font-mono transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-zinc-600">
            © {new Date().getFullYear()} AURASCAN // TRUTH_ENGINE
          </div>
          <div className="flex items-center gap-4">
            {['🐦', '💬', '📧', '🔗'].map((icon, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded-lg border border-cyan-500/30 flex items-center justify-center text-sm hover:bg-cyan-500/10 transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
