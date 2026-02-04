'use client'

import { useState } from 'react'
import { Save, User, AtSign } from 'lucide-react'
import { toast } from 'sonner'

export function EditProfileForm() {
  const [name, setName] = useState('ZeroCool')
  const [email, setEmail] = useState('zerocool@hacktheplanet.com')
  const [bio, setBio] = useState('Hacking the Gibson.')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('PROFILE UPDATED', {
      description: 'Identity matrix reconfigured.'
    })
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-500 uppercase">Operative Name</label>
        <div className="relative">
          <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-500 uppercase">Comm Link</label>
        <div className="relative">
          <AtSign className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-500 uppercase">Manifesto</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-green-500 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-zinc-800 hover:bg-green-600 hover:text-black text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        SAVE CHANGES
      </button>
    </form>
  )
}
