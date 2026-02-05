import Link from 'next/link';
import ArchiveGrid from '../components/ArchiveGrid';
import Card from '../components/Card';
import Container from '../components/Container';
import TerminalBlock from '../components/TerminalBlock';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>
      <Container className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-mist">
              Signal Layer v2.6
              <span className="h-2 w-2 animate-pulseSoft rounded-full bg-signal shadow-glow" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-slate-100 md:text-6xl">
                AuraScan
                <span className="block text-glow text-signal">Trace the quiet anomalies.</span>
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                An ominous interface for scanning residual aura, cataloging irregularities,
                and logging the signals that should not exist.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/scan"
                className="hover-flicker rounded-full bg-signal px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow"
              >
                Run Scan
              </Link>
              <Link
                href="/archive"
                className="hover-flicker rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100"
              >
                View Archive
              </Link>
              <Link
                href="/signal"
                className="hover-flicker rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100"
              >
                Signal Log
              </Link>
            </div>
            <p className="sr-only">YmFzZTY0Oi9udWxs</p>
          </div>
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="scanline-sweep absolute inset-0" />
            </div>
            <TerminalBlock title="Live Scanner">
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Pulse</span>
                  <span className="text-signal">Stable</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Entropy</span>
                  <span className="text-ember">0.43</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Drift Index</span>
                  <span>Delta-12.8</span>
                </div>
              </div>
            </TerminalBlock>
          </div>
        </div>
      </Container>

      <Container className="pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <TerminalBlock title="Protocol Notes">
            <p className="text-sm text-slate-300">
              Do not trust the first reading. Cross-check the signal archive for residual
              interference and note any repeating patterns.
            </p>
            <p className="mt-4 text-xs text-slate-500">rot13:cnffjbeqf ner jvguvat</p>
          </TerminalBlock>
          <Card title="Operational Layers" className="p-8">
            <ul className="mt-6 space-y-4 text-sm text-slate-300">
              <li>Signal intake calibration with adaptive drift compensation.</li>
              <li>Archive correlation to map anomaly repeats.</li>
              <li>Human oversight protocols for high entropy sequences.</li>
            </ul>
            <p className="mt-6 text-xs text-slate-500">binary: 01101110 01110101 01101100 01101100</p>
          </Card>
        </div>
      </Container>

      <Container className="pb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">Recent Archive Entries</h2>
          <Link href="/archive" className="text-sm text-signal hover:text-white">
            Browse full archive
          </Link>
        </div>
        <ArchiveGrid limit={3} />
      </Container>
    </div>
  );
}
