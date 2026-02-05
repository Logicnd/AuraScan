'use client';

import { useMemo } from 'react';
import ArchiveCard from './ArchiveCard';
import { archiveEntries } from '../lib/archiveData';
import { useGhostMemory } from '../hooks/useGhostMemory';

type ArchiveGridProps = {
  limit?: number;
};

export default function ArchiveGrid({ limit }: ArchiveGridProps) {
  const { profile } = useGhostMemory();
  const entries = useMemo(() => {
    const unlocked = profile?.unlockedFlags ?? [];
    const visible = archiveEntries.filter(
      (entry) => !entry.requiresFlag || unlocked.includes(entry.requiresFlag)
    );
    return limit ? visible.slice(0, limit) : visible;
  }, [limit, profile]);

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry) => (
        <ArchiveCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
