'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  addUnlock,
  createGhostProfile,
  hashInput,
  loadGhostProfile,
  saveGhostProfile,
  updateGhostProfile,
  type GhostProfile
} from '../lib/ghostMemory';

export const useGhostMemory = (route?: string) => {
  const [profile, setProfile] = useState<GhostProfile | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = loadGhostProfile();
    if (existing) {
      setProfile(existing);
      return;
    }
    if (route) {
      const next = createGhostProfile(route);
      saveGhostProfile(next);
      setProfile(next);
    }
  }, [route]);

  const sync = useCallback((updater: (profile: GhostProfile) => GhostProfile) => {
    const next = updateGhostProfile(updater);
    setProfile(next);
    return next;
  }, []);

  const recordVisit = useCallback(
    (nextRoute: string) => {
      if (typeof window === 'undefined') return null;
      const existing = loadGhostProfile();
      if (!existing) {
        const fresh = createGhostProfile(nextRoute);
        saveGhostProfile(fresh);
        setProfile(fresh);
        return fresh;
      }
      const next = updateGhostProfile((current) => ({
        ...current,
        totalVisits:
          current.lastSeenRoute === nextRoute ? current.totalVisits : current.totalVisits + 1,
        lastSeenRoute: nextRoute
      }));
      setProfile(next);
      return next;
    },
    [setProfile]
  );

  const recordScan = useCallback(
    (input: string) => {
      if (!input.trim()) return null;
      const scanHash = hashInput(input.trim());
      return sync((current) => {
        if (current.lastScanHash === scanHash) {
          return { ...current, lastScanHash: scanHash };
        }
        return {
          ...current,
          scanCount: current.scanCount + 1,
          lastScanHash: scanHash
        };
      });
    },
    [sync]
  );

  const recordSignalVisit = useCallback(
    () =>
      sync((current) => ({
        ...current,
        signalVisits: current.signalVisits + 1
      })),
    [sync]
  );

  const recordLogoClick = useCallback(
    () =>
      sync((current) => ({
        ...current,
        logoClicks: current.logoClicks + 1
      })),
    [sync]
  );

  const unlockFlag = useCallback(
    (flag: string) =>
      sync((current) => ({
        ...addUnlock(current, flag)
      })),
    [sync]
  );

  return {
    profile,
    recordVisit,
    recordScan,
    recordSignalVisit,
    recordLogoClick,
    unlockFlag
  };
};
