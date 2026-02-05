'use client';

import { useEffect, useMemo, useState } from 'react';
import ScanResultPanel from './ScanResultPanel';
import TerminalBlock from './TerminalBlock';
import { runScan, type ScanResult } from '../lib/scanEngine';
import { useGhostMemory } from '../hooks/useGhostMemory';

export default function ScanUI() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [mode, setMode] = useState<'keyed' | 'public' | 'local'>('public');
  const [status, setStatus] = useState('Awaiting target.');
  const { recordScan, unlockFlag } = useGhostMemory();

  const trimmed = useMemo(() => input.trim(), [input]);

  useEffect(() => {
    if (!trimmed) {
      setResult(null);
      setStatus('Awaiting target.');
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setStatus('Engaging secure scan...');
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: trimmed }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Scan failed.');
        }

        const data = (await response.json()) as { mode: 'keyed' | 'public'; result: ScanResult };
        setResult(data.result);
        setMode(data.mode);
        setStatus(
          data.mode === 'keyed'
            ? 'Secure scan engaged. Keyed output locked.'
            : 'Public scan active. Add SCAN_SECRET for keyed output.'
        );
      } catch {
        if (controller.signal.aborted) return;
        setResult(runScan(trimmed));
        setMode('local');
        setStatus('Fallback scan active (local).');
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  useEffect(() => {
    if (!result || !trimmed) return;
    const next = recordScan(trimmed);
    if (!next) return;
    if (next.scanCount >= 3 && !next.unlockedFlags.includes('archive-ghost')) {
      unlockFlag('archive-ghost');
      console.log('[AURASCAN] anomaly registered');
    }
  }, [recordScan, result, trimmed, unlockFlag]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <TerminalBlock title="Input Channel">
          <label className="text-xs uppercase tracking-[0.3em] text-mist">Target</label>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter name or phrase..."
            className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-signal"
          />
          <p className="mt-3 text-xs text-slate-500">{status}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-mist">
            {mode === 'keyed' ? 'Keyed' : mode === 'public' ? 'Public' : 'Local'} Mode
            <span
              className={`h-2 w-2 rounded-full ${
                mode === 'keyed'
                  ? 'bg-signal shadow-glow'
                  : mode === 'public'
                  ? 'bg-halo'
                  : 'bg-ember'
              }`}
            />
          </div>
        </TerminalBlock>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          <p className="text-slate-500">System note</p>
          <p className="mt-3">
            Deterministic sandbox: same input, same output. Perfect for repeatability.
          </p>
          <p className="mt-4 text-xs text-slate-600">hex: 2f6563686f</p>
        </div>
      </div>
      <div className="space-y-6">
        {result ? (
          <ScanResultPanel result={result} />
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
            Submit a target to generate an aura reading.
          </div>
        )}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-xs text-slate-500">
          base64: L3NpZ25hbA==
        </div>
      </div>
    </div>
  );
}
