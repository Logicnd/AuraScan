'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ShieldCheck } from 'lucide-react'
import { MatrixRain } from '@/components/ui/matrix-rain'
import { GlitchText } from '@/components/ui/glitch-text'
import { toast } from 'sonner'
import { loginSchema } from '@/lib/validation'
import { ZodError } from 'zod'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate input
      loginSchema.parse({ email, password })

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Access Granted', {
          description: 'Welcome back, Operative.'
        })
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // Display the first validation error
        toast.error('Validation Error', {
          description: error.issues[0].message
        })
      } else {
        toast.error('System Failure', {
          description: 'An unexpected error occurred during the login sequence.'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden relative selection:bg-green-500/30">
      <MatrixRain />
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 z-10 relative"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black border border-green-500/30 mb-6 shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)] backdrop-blur-xl"
          >
            <ShieldCheck className="w-10 h-10 text-green-500" />
          </motion.div>
          <div className="mb-2">
            <GlitchText text="SYSTEM ACCESS" className="text-3xl font-bold tracking-tighter text-white" />
          </div>
          <p className="text-zinc-400 font-mono text-sm">
            Enter credentials to bypass security.
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 font-mono text-xs uppercase tracking-wider">Operative ID (Email)</Label>
              <Input
                id="email"
                type="email"
                placeholder="operative@aurascan.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-950/80 border-zinc-800 focus:border-green-500/50 font-mono"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300 font-mono text-xs uppercase tracking-wider">Access Code</Label>
                <Link
                  href="/auth/reset-password"
                  className="text-[10px] text-green-500 hover:text-green-400 transition-colors font-mono uppercase"
                >
                  Reset Protocol?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-950/80 border-zinc-800 focus:border-green-500/50 font-mono"
              />
            </div>

            {loading ? (
              <Button disabled className="w-full bg-green-600/20 text-green-500 border border-green-500/50 h-11 font-mono uppercase tracking-widest">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decryption in progress...
              </Button>
            ) : (
              <Button type="submit" variant="neon" className="w-full h-11 font-mono uppercase tracking-widest text-sm shadow-[0_0_20px_-5px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.6)] transition-all duration-300">
                Initialize Session
              </Button>
            )}

            <div className="mt-6 text-center text-xs text-zinc-500 font-mono">
              Don&apos;t have an identity?{" "}
              <Link href="/auth/signup" className="text-green-500 hover:text-green-400 font-medium hover:underline decoration-green-500/50 underline-offset-4">
                JOIN THE RESISTANCE
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
