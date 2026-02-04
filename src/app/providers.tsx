'use client';

import React, { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toast';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('SW registered:', registration);
          },
          (registrationError) => {
            console.log('SW registration failed:', registrationError);
          }
        );
      });
    }

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      (window as Window & { deferredPrompt?: Event }).deferredPrompt = e;
    });
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
      <Toaster />
    </div>
  );
}
