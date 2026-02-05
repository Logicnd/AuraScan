'use client';

import { useEffect } from 'react';
import { useGhostMemory } from '../hooks/useGhostMemory';

export default function SignalVisit() {
  const { recordSignalVisit, unlockFlag } = useGhostMemory();

  useEffect(() => {
    const next = recordSignalVisit();
    if (!next) return;
    if (next.signalVisits >= 5 && !next.unlockedFlags.includes('echo-route')) {
      unlockFlag('echo-route');
      console.log('[AURASCAN] anomaly registered');
    }
  }, [recordSignalVisit, unlockFlag]);

  return null;
}
