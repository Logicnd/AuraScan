'use client';

import { useEffect, useState } from 'react';

const lines = [
  'Console: welcome back, watcher.',
  'Note: handle stored locally; no cloud calls.',
  'Hint: footer dot hides a route.',
  'Lab: deterministic scans cached for speed.',
  'Library: search is manual for now.',
  'Signal: repeat lines unlock /null faster.',
  'Badge: logo taps still count — quietly.',
  'Status: numbers are simulated, mood is real.'
];

export default function SignalStream() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log('Signal detected. Do not trust the output.');
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % lines.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="text-xs uppercase tracking-[0.3em] text-mist">Live Transmission</div>
      <div className="mt-6 font-mono text-sm text-slate-200">
        <div className="h-6 overflow-hidden">
          <div className="animate-type whitespace-nowrap">{lines[index]}</div>
        </div>
        <div className="mt-6 grid gap-2 text-xs text-slate-500">
          <p>rot13: ervc rf gbb gvyyrq</p>
          <p>binary: 01100101 01100011 01101000 01101111</p>
        </div>
      </div>
    </div>
  );
}
