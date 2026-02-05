'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useGhostMemory } from '../hooks/useGhostMemory';

export default function GhostTracker() {
  const pathname = usePathname();
  const { recordVisit } = useGhostMemory();

  useEffect(() => {
    if (!pathname) return;
    recordVisit(pathname);
  }, [pathname, recordVisit]);

  return null;
}
