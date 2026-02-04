'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, LayoutDashboard, Scan, Trophy, Settings, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { XPBar } from '@/components/ui/xp-bar'

export function Navbar() {
  const pathname = usePathname()
  
  // Don't show navbar on auth pages
  if (pathname.startsWith('/auth') || pathname === '/') return null

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Mission Control' },
    { href: '/scan', icon: Scan, label: 'Ethics Scanner' },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/profile', icon: User, label: 'Operative ID' },
    { href: '/settings', icon: Settings, label: 'Protocol Settings' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-green-900/20 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:border-green-500/50 transition-colors">
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <span className="font-bold tracking-tight text-white group-hover:text-green-400 transition-colors">
            AuraScan
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block w-64">
          <XPBar />
        </div>
      </div>
    </header>
  )
}
