'use client'

import { EditProfileForm } from '@/components/profile/edit-profile-form'
import { GlitchText } from '@/components/ui/glitch-text'
import { useGamification } from '@/lib/store/gamification'
import { Shield, Settings, Camera } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { title, level, xp } = useGamification()

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
              <div className="absolute inset-0 rounded-full border-2 border-green-500/50 group-hover:border-green-500 transition-colors" />
              <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
                <span className="text-4xl font-bold text-zinc-600">ZC</span>
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">ZeroCool</h2>
            <div className="text-sm text-green-500 font-mono mb-4">{title}</div>
            
            <div className="grid grid-cols-2 gap-4 text-left p-4 bg-black/50 rounded-lg border border-zinc-800">
              <div>
                <div className="text-xs text-zinc-500 uppercase">Level</div>
                <div className="text-xl font-bold text-white">{level}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 uppercase">XP</div>
                <div className="text-xl font-bold text-white">{xp}</div>
              </div>
            </div>
          </motion.div>

          {/* Badges Mockup */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Earned Badges
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-green-500/50 transition-colors flex items-center justify-center">
                  <Shield className="w-4 h-4 text-zinc-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
              <Settings className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-bold">
                <GlitchText text="OPERATIVE SETTINGS" />
              </h2>
            </div>
            
            <EditProfileForm />
          </div>
        </div>
      </div>
    </div>
  )
}
