'use client';

import { useMemo } from 'react';
import { useGhostMemory } from '../hooks/useGhostMemory';

const whispers = [
  { min: 1, text: 'Signal stabilized.' },
  { min: 2, text: 'You again.' },
  { min: 4, text: 'Pattern repeats.' },
  { min: 6, text: 'We remember this.' },
  { min: 9, text: 'Do not linger.' }
];

export default function GhostWhisper() {
  const { profile } = useGhostMemory();

  const message = useMemo(() => {
    if (!profile) return null;
    const match = [...whispers].reverse().find((whisper) => profile.totalVisits >= whisper.min);
    return match?.text ?? null;
  }, [profile]);

  if (!message) return null;

  return (
    <p className="text-xs uppercase tracking-[0.35em] text-mist/70">{message}</p>
  );
}
