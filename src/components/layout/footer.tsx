'use client'

import { Github, Twitter, Terminal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  
  // Don't show footer on auth pages or landing page
  if (pathname.startsWith('/auth') || pathname === '/') return null

  return (
    <footer className="border-t border-zinc-800 bg-black py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <Terminal className="w-4 h-4 text-green-500" />
            </div>
            <span className="font-bold tracking-tight text-white">
              AuraScan
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="#" className="hover:text-green-500 transition-colors">Privacy Protocol</Link>
            <Link href="#" className="hover:text-green-500 transition-colors">Terms of Engagement</Link>
            <Link href="#" className="hover:text-green-500 transition-colors">System Status</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-zinc-600 font-mono">
          © 2024 AuraScan Industries. All rights reserved. NO SYSTEM IS SAFE.
        </div>
      </div>
    </footer>
  )
}
