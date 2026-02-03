import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  User,
  UserPreferences,
  UserStats,
  UserGamification,
  Achievement,
  Badge,
  Quest,
  ScanResult,
  Notification,
  Guild,
} from '@/types';
import { STORAGE_KEYS, GAMIFICATION_CONFIG } from '@/config';
import { calculateLevel } from '@/lib/utils';

// ============================================
// USER STORE
// ============================================

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user, error: null }),
      
      updatePreferences: (preferences) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              preferences: { ...currentUser.preferences, ...preferences },
            },
          });
        }
      },
      
      updateStats: (stats) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              stats: { ...currentUser.stats, ...stats },
            },
          });
        }
      },
      
      logout: () => set({ user: null, isAuthenticated: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: STORAGE_KEYS.user,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// ============================================
// GAMIFICATION STORE
// ============================================

interface GamificationState {
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  karma: number;
  streakDays: number;
  lastCheckIn: Date | null;
  achievements: Achievement[];
  badges: Badge[];
  quests: Quest[];
  guild: Guild | null;
  
  // Actions
  addXP: (amount: number, reason: string) => { leveledUp: boolean; newLevel: number };
  addKarma: (amount: number, reason: string) => void;
  updateStreak: () => { continued: boolean; broken: boolean; newStreak: number };
  unlockAchievement: (achievement: Achievement) => void;
  awardBadge: (badge: Badge) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  claimQuestReward: (questId: string) => void;
  setGuild: (guild: Guild | null) => void;
  resetGamification: () => void;
}

const initialGamificationState = {
  level: 1,
  currentXP: 0,
  totalXP: 0,
  xpToNextLevel: GAMIFICATION_CONFIG.baseXPPerLevel,
  karma: 0,
  streakDays: 0,
  lastCheckIn: null,
  achievements: [],
  badges: [],
  quests: [],
  guild: null,
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      ...initialGamificationState,
      
      addXP: (amount, _reason) => {
        const state = get();
        const newTotalXP = state.totalXP + amount;
        const levelData = calculateLevel(newTotalXP);
        const leveledUp = levelData.level > state.level;
        
        set({
          totalXP: newTotalXP,
          level: levelData.level,
          currentXP: levelData.currentXP,
          xpToNextLevel: levelData.xpToNextLevel,
        });
        
        return { leveledUp, newLevel: levelData.level };
      },
      
      addKarma: (amount, _reason) => {
        const state = get();
        const newKarma = Math.min(
          GAMIFICATION_CONFIG.maxKarma,
          Math.max(0, state.karma + amount)
        );
        set({ karma: newKarma });
      },
      
      updateStreak: () => {
        const state = get();
        const now = new Date();
        const lastCheckIn = state.lastCheckIn ? new Date(state.lastCheckIn) : null;
        
        if (!lastCheckIn) {
          set({ streakDays: 1, lastCheckIn: now });
          return { continued: false, broken: false, newStreak: 1 };
        }
        
        const diffDays = Math.floor(
          (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (diffDays === 0) {
          // Already checked in today
          return { continued: false, broken: false, newStreak: state.streakDays };
        }
        
        if (diffDays === 1) {
          // Streak continues
          const newStreak = state.streakDays + 1;
          set({ streakDays: newStreak, lastCheckIn: now });
          return { continued: true, broken: false, newStreak };
        }
        
        // Streak broken
        set({ streakDays: 1, lastCheckIn: now });
        return { continued: false, broken: true, newStreak: 1 };
      },
      
      unlockAchievement: (achievement) => {
        const state = get();
        const exists = state.achievements.find((a) => a.id === achievement.id);
        if (!exists) {
          set({ achievements: [...state.achievements, achievement] });
          // Award XP and Karma
          get().addXP(achievement.xpReward, `Achievement: ${achievement.name}`);
          get().addKarma(achievement.karmaReward, `Achievement: ${achievement.name}`);
        }
      },
      
      awardBadge: (badge) => {
        const state = get();
        const exists = state.badges.find((b) => b.id === badge.id);
        if (!exists) {
          set({ badges: [...state.badges, badge] });
        }
      },
      
      updateQuestProgress: (questId, progress) => {
        const state = get();
        set({
          quests: state.quests.map((quest) =>
            quest.id === questId
              ? {
                  ...quest,
                  progress,
                  status: progress >= quest.maxProgress ? 'completed' : quest.status,
                }
              : quest
          ),
        });
      },
      
      claimQuestReward: (questId) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === questId);
        if (quest && quest.status === 'completed') {
          get().addXP(quest.rewards.xp, `Quest: ${quest.title}`);
          get().addKarma(quest.rewards.karma, `Quest: ${quest.title}`);
          set({
            quests: state.quests.map((q) =>
              q.id === questId ? { ...q, status: 'claimed' } : q
            ),
          });
        }
      },
      
      setGuild: (guild) => set({ guild }),
      
      resetGamification: () => set(initialGamificationState),
    }),
    {
      name: STORAGE_KEYS.gamification,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================
// SCAN STORE
// ============================================

interface ScanState {
  currentScan: ScanResult | null;
  scanHistory: ScanResult[];
  isScanning: boolean;
  scanError: string | null;
  dailyScanCount: number;
  lastScanReset: Date | null;
  
  // Actions
  setCurrentScan: (scan: ScanResult | null) => void;
  addToHistory: (scan: ScanResult) => void;
  removeFromHistory: (scanId: string) => void;
  clearHistory: () => void;
  setScanning: (scanning: boolean) => void;
  setScanError: (error: string | null) => void;
  incrementDailyScanCount: () => void;
  resetDailyScanCount: () => void;
  canScan: (isPremium: boolean) => boolean;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set, get) => ({
      currentScan: null,
      scanHistory: [],
      isScanning: false,
      scanError: null,
      dailyScanCount: 0,
      lastScanReset: null,
      
      setCurrentScan: (scan) => set({ currentScan: scan, scanError: null }),
      
      addToHistory: (scan) => {
        const state = get();
        set({
          scanHistory: [scan, ...state.scanHistory].slice(0, 100), // Keep last 100
          currentScan: scan,
        });
      },
      
      removeFromHistory: (scanId) => {
        const state = get();
        set({
          scanHistory: state.scanHistory.filter((s) => s.id !== scanId),
        });
      },
      
      clearHistory: () => set({ scanHistory: [], currentScan: null }),
      
      setScanning: (isScanning) => set({ isScanning }),
      
      setScanError: (scanError) => set({ scanError }),
      
      incrementDailyScanCount: () => {
        const state = get();
        const now = new Date();
        const lastReset = state.lastScanReset ? new Date(state.lastScanReset) : null;
        
        // Check if we need to reset the count (new day)
        if (!lastReset || now.toDateString() !== lastReset.toDateString()) {
          set({ dailyScanCount: 1, lastScanReset: now });
        } else {
          set({ dailyScanCount: state.dailyScanCount + 1 });
        }
      },
      
      resetDailyScanCount: () => set({ dailyScanCount: 0, lastScanReset: new Date() }),
      
      canScan: (isPremium) => {
        const state = get();
        const limit = isPremium ? 1000 : 10;
        return state.dailyScanCount < limit;
      },
    }),
    {
      name: STORAGE_KEYS.scans,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scanHistory: state.scanHistory.slice(0, 50), // Only persist last 50
        dailyScanCount: state.dailyScanCount,
        lastScanReset: state.lastScanReset,
      }),
    }
  )
);

// ============================================
// NOTIFICATION STORE
// ============================================

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => {
    const state = get();
    set({
      notifications: [notification, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    });
  },
  
  markAsRead: (notificationId) => {
    const state = get();
    const notification = state.notifications.find((n) => n.id === notificationId);
    if (notification && !notification.isRead) {
      set({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      });
    }
  },
  
  markAllAsRead: () => {
    const state = get();
    set({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    });
  },
  
  removeNotification: (notificationId) => {
    const state = get();
    const notification = state.notifications.find((n) => n.id === notificationId);
    set({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
      unreadCount: notification && !notification.isRead
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    });
  },
  
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

// ============================================
// UI STORE
// ============================================

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  isOnline: boolean;
  installPromptDeferred: boolean;
  showInstallBanner: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  setOnline: (online: boolean) => void;
  setInstallPromptDeferred: (deferred: boolean) => void;
  setShowInstallBanner: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarOpen: false,
      activeModal: null,
      modalData: null,
      isOnline: true,
      installPromptDeferred: false,
      showInstallBanner: false,
      
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => {
        const state = get();
        set({ sidebarOpen: !state.sidebarOpen });
      },
      
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      
      openModal: (activeModal, modalData = undefined) => set({ activeModal, modalData }),
      
      closeModal: () => set({ activeModal: null, modalData: undefined }),
      
      setOnline: (isOnline) => set({ isOnline }),
      
      setInstallPromptDeferred: (installPromptDeferred) => set({ installPromptDeferred }),
      
      setShowInstallBanner: (showInstallBanner) => set({ showInstallBanner }),
    }),
    {
      name: STORAGE_KEYS.preferences,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// ============================================
// AR STORE
// ============================================

interface ARState {
  isARActive: boolean;
  hasARPermission: boolean;
  arCapabilities: {
    hasCamera: boolean;
    hasWebXR: boolean;
    supportsDepth: boolean;
  };
  currentARScan: {
    imageData: string | null;
    extractedText: string | null;
    analysis: ScanResult | null;
  } | null;
  
  // Actions
  setARActive: (active: boolean) => void;
  setARPermission: (hasPermission: boolean) => void;
  setARCapabilities: (capabilities: Partial<ARState['arCapabilities']>) => void;
  setCurrentARScan: (scan: ARState['currentARScan']) => void;
  clearARScan: () => void;
}

export const useARStore = create<ARState>()((set) => ({
  isARActive: false,
  hasARPermission: false,
  arCapabilities: {
    hasCamera: false,
    hasWebXR: false,
    supportsDepth: false,
  },
  currentARScan: null,
  
  setARActive: (isARActive) => set({ isARActive }),
  setARPermission: (hasARPermission) => set({ hasARPermission }),
  setARCapabilities: (capabilities) => set((state) => ({
    arCapabilities: { ...state.arCapabilities, ...capabilities },
  })),
  setCurrentARScan: (currentARScan) => set({ currentARScan }),
  clearARScan: () => set({ currentARScan: null }),
}));
