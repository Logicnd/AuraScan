'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock } from 'lucide-react'
import { MatrixRain } from '@/components/ui/matrix-rain'
import { GlitchText } from '@/components/ui/glitch-text'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { ZodError } from 'zod'

const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      updatePasswordSchema.parse({ password, confirmPassword })

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Credentials Reconfigured', {
          description: 'Access protocols updated successfully.'
        })
        router.push('/dashboard')
      }
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error('Validation Error', {
          description: error.errors[0].message
        })
      } else {
        toast.error('System Failure', {
          description: 'An unexpected error occurred.'
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
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px] animate-pulse" />
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
            <Lock className="w-10 h-10 text-green-500" />
          </motion.div>
          <div className="mb-2">
            <GlitchText text="SECURE LINK" className="text-3xl font-bold tracking-tighter text-white" />
          </div>
          <p className="text-zinc-400 font-mono text-sm">
            Set new access credentials.
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300 font-mono text-xs uppercase tracking-wider">New Password</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-300 font-mono text-xs uppercase tracking-wider">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-zinc-950/80 border-zinc-800 focus:border-green-500/50 font-mono"
              />
            </div>

            {loading ? (
              <Button disabled className="w-full bg-green-600/20 text-green-500 border border-green-500/50 h-11 font-mono uppercase tracking-widest">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Protocols...
              </Button>
            ) : (
              <Button type="submit" variant="neon" className="w-full h-11 font-mono uppercase tracking-widest text-sm shadow-[0_0_20px_-5px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.6)] transition-all duration-300">
                Establish New Code
              </Button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  )
}
