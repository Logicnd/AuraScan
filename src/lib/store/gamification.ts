import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Quest = {
  id: string
  title: string
  description: string
  xp: number
  completed: boolean
}

export type UserLevel = {
  level: number
  xp: number
  xpToNextLevel: number
  title: string
}

interface GamificationState {
  level: number
  xp: number
  xpToNextLevel: number
  title: string
  quests: Quest[]
  
  // Actions
  addXp: (amount: number) => void
  completeQuest: (questId: string) => void
  resetProgress: () => void
}

const TITLES = [
  "Script Kiddie",
  "Neophyte",
  "Apprentice",
  "Journeyman",
  "Adept",
  "Cyber-Ninja",
  "Elite Hacker",
  "Netrunner",
  "Console Cowboy",
  "Digital Deity"
]

export const useGamification = create<GamificationState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      title: TITLES[0],
      quests: [
        { id: 'daily-login', title: 'Daily Login', description: 'Jack into the matrix.', xp: 50, completed: false },
        { id: 'scan-ai', title: 'First Scan', description: 'Analyze an AI model for bias.', xp: 100, completed: false },
        { id: 'invite-friend', title: 'Recruit Operative', description: 'Expand the resistance.', xp: 200, completed: false },
      ],

      addXp: (amount) => {
        set((state) => {
          let newXp = state.xp + amount
          let newLevel = state.level
          let newXpToNextLevel = state.xpToNextLevel
          let newTitle = state.title

          // Level up logic
          while (newXp >= newXpToNextLevel) {
            newXp -= newXpToNextLevel
            newLevel++
            newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5)
            newTitle = TITLES[Math.min(newLevel - 1, TITLES.length - 1)]
            // You could trigger a level up modal/toast here via a side effect in the component
          }

          return {
            xp: newXp,
            level: newLevel,
            xpToNextLevel: newXpToNextLevel,
            title: newTitle
          }
        })
      },

      completeQuest: (questId) => {
        const state = get()
        const quest = state.quests.find(q => q.id === questId)
        if (quest && !quest.completed) {
          set((state) => ({
            quests: state.quests.map(q => q.id === questId ? { ...q, completed: true } : q)
          }))
          state.addXp(quest.xp)
        }
      },

      resetProgress: () => set({
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        title: TITLES[0],
        quests: [
          { id: 'daily-login', title: 'Daily Login', description: 'Jack into the matrix.', xp: 50, completed: false },
          { id: 'scan-ai', title: 'First Scan', description: 'Analyze an AI model for bias.', xp: 100, completed: false },
          { id: 'invite-friend', title: 'Recruit Operative', description: 'Expand the resistance.', xp: 200, completed: false },
        ]
      })
    }),
    {
      name: 'aurascan-gamification-storage',
    }
  )
)
