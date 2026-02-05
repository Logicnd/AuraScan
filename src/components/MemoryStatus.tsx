'use client';

import Card from './Card';
import { useGhostMemory } from '../hooks/useGhostMemory';

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export default function MemoryStatus() {
  const { profile } = useGhostMemory();
  const seed = profile ? parseInt(profile.entropySeed, 16) : 0;

  const resonance = profile ? clamp((profile.totalVisits * 11 + seed) % 101) : 0;
  const signature = profile ? clamp((profile.scanCount * 13 + seed) % 97) : 0;
  const loopCount = profile ? clamp((profile.scanCount * 7 + seed) % 89) : 0;
  const drift = profile ? clamp((profile.signalVisits * 9 + seed) % 83) : 0;

  const items = [
    { label: 'Visitor resonance', value: resonance },
    { label: 'Persistent signature', value: signature },
    { label: 'Loop count', value: loopCount },
    { label: 'Signal drift', value: drift }
  ];

  return (
    <div className="mt-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Memory</p>
        <h2 className="text-2xl font-semibold text-slate-100">Persistent trace</h2>
        <p className="text-sm text-slate-400">
          Values are abstracted. No personal identifiers are stored.
        </p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {items.map((item) => (
          <Card key={item.label}>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-halo/80 shadow-glow"
                style={{ width: `${item.value}%` }}
              />
            </div>
            <p className="mt-4 text-xs text-slate-500">checksum: {item.value.toString(16)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
