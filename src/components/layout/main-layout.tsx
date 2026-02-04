'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LevelBadge, StreakBadge } from '@/components/ui/badge';
import { useGamificationStore, useUserStore, useNotificationStore, useUIStore } from '@/store';

// Navigation items
const NAV_ITEMS = [
  {
    href: '/',
    label: 'Scan',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/feed',
    label: 'Feed',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    href: '/templates',
    label: 'Templates',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    href: '/learn',
    label: 'Learn',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

// Header Component
export const Header: React.FC = () => {
  const { level, streakDays } = useGamificationStore();
  const { user } = useUserStore();
  const { unreadCount } = useNotificationStore();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b safe-area-inset-top">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Home Button - Always Visible */}
        <Link href="/" className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
          pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-base hidden sm:inline whitespace-nowrap">Home</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.slice(1).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}>
                  <span>{item.icon}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <Link href="/" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Level & Streak - Hide on very small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <LevelBadge level={level} size="sm" />
            {streakDays > 0 && (
              <StreakBadge days={streakDays} size="sm" />
            )}
          </div>

          {/* Avatar */}
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold hover:ring-2 ring-primary/50 transition-all">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

// Bottom Navigation Component
export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Simplified nav items for mobile
  const mobileNavItems = [
    {
      href: '/',
      label: 'Scan',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: '/templates',
      label: 'Templates',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      href: '/leaderboard',
      label: 'Leaderboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="nav-bottom bg-background/95 backdrop-blur-xl border-t">
      <div className="flex justify-around items-center w-full h-full">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// Sidebar Component (for desktop)
export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { level, karma, streakDays } = useGamificationStore();
  const { user } = useUserStore();

  const sidebarItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/templates', label: 'Templates', icon: '📋' },
    { href: '/feed', label: 'Ethics Feed', icon: '📰' },
    { href: '/learn', label: 'Learn', icon: '📚' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { href: '/guilds', label: 'Guilds', icon: '⚔️' },
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className={cn(
          'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 bg-card border-r overflow-y-auto',
          'flex flex-col lg:translate-x-0 lg:static lg:z-0 lg:top-0 lg:h-full'
        )}
      >
        {/* User Profile Section */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm">
              {user?.displayName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-sm">{user?.displayName || 'Explorer'}</h3>
              <p className="text-xs text-muted-foreground">Level {level}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-secondary/50">
              <p className="font-bold text-primary">{level}</p>
              <p className="text-muted-foreground">Level</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50">
              <p className="font-bold text-emerald-500">{karma}</p>
              <p className="text-muted-foreground">Karma</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/50">
              <p className="font-bold text-yellow-500">{streakDays}</p>
              <p className="text-muted-foreground">Streak</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Premium CTA */}
        {!user?.isPremium && (
          <div className="p-3 border-t">
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30">
              <h4 className="font-semibold text-sm mb-1">Go Premium</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Unlock unlimited scans & advanced features
              </p>
              <Button variant="default" size="sm" className="w-full text-xs">
                $2.99/month
              </Button>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
};

// Main Layout Component
interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1 w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 border-r bg-card">
          <Sidebar />
        </div>

        {/* Main Content - Properly Centered */}
        <main className="flex-1 w-full pb-20 lg:pb-0">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

// PWA Install Banner
export const InstallBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { showInstallBanner, setShowInstallBanner } = useUIStore();

  if (dismissed || !showInstallBanner) return null;

  const handleInstall = async () => {
    // Trigger install prompt
    const deferredPrompt = (window as Window & { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="install-banner"
    >
      <div className="flex-1">
        <h4 className="font-bold">Install AuraScan</h4>
        <p className="text-sm text-white/80">Add to home screen for the best experience</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-white hover:bg-white/20"
        >
          Later
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleInstall}
        >
          Install
        </Button>
      </div>
    </motion.div>
  );
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default MainLayout;
