'use client'

import { useState } from 'react'
import { Volume2, Bell, Shield, Trash2, LogOut } from 'lucide-react'
import { GlitchText } from '@/components/ui/glitch-text'
import { useGamification } from '@/lib/store/gamification'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { resetProgress } = useGamification()
  const router = useRouter()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleReset = () => {
    if (confirm('WARNING: This will wipe all mission data. Are you sure?')) {
      resetProgress()
      toast.error('SYSTEM RESET', { description: 'All progress has been purged.' })
      router.push('/')
    }
  }

  const handleLogout = () => {
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <GlitchText text="SYSTEM CONFIGURATION" />
          </h1>
          <p className="text-zinc-400">Manage interface protocols and security settings.</p>
        </div>

        {/* Audio & Visual */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Interface Settings
          </h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">Audio Feedback</div>
                <div className="text-sm text-zinc-500">Interface sounds and alerts</div>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-green-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">Mission Alerts</div>
                <div className="text-sm text-zinc-500">Push notifications for new quests</div>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-green-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-900/30 bg-red-900/5 p-6 space-y-6">
          <h2 className="text-lg font-bold text-red-500 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Danger Zone
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Purge Data</div>
              <div className="text-sm text-zinc-500">Permanently delete all progress</div>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              RESET
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-red-900/20">
            <div>
              <div className="font-bold text-white">Disconnect</div>
              <div className="text-sm text-zinc-500">Terminate current session</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
