import Link from 'next/link';
import Card from '../components/Card';
import Container from '../components/Container';
import TerminalBlock from '../components/TerminalBlock';
import ArchiveGrid from '../components/ArchiveGrid';
import { getSessionUser } from '../lib/session';

const quickLinks = [
  { href: '/scan', title: 'Start a scan', detail: 'Deterministic output, zero fluff.' },
  { href: '/archive', title: 'Browse library', detail: 'Saved sessions, fragments, logs.' },
  { href: '/signal', title: 'Live signals', detail: 'Rolling updates and console feed.' },
  { href: '/status', title: 'System status', detail: 'Pulse, integrity, sync health.' },
];

export default function DashboardPage() {
  const user = getSessionUser();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute right-10 top-32 h-[340px] w-[340px] rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      <Container className="py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-mist">
              Welcome back
              <span className="text-signal">{user.name}</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight text-slate-100 md:text-5xl">
                Your console is awake.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Signal intelligence without the drama. Navigate, scan, and stash insights.
                We keep a few secrets tucked away—find them if you can.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/scan"
                className="hover-flicker rounded-full bg-signal px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow"
              >
                Open Lab
              </Link>
              <Link
                href="/archive"
                className="hover-flicker rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100"
              >
                Library
              </Link>
              <Link
                href="/signal"
                className="hover-flicker rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100"
              >
                Signals
              </Link>
            </div>
            <p className="sr-only">base64: L2Rhc2hib2FyZA==</p>
          </div>

          <TerminalBlock title="Presence">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="text-signal">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Identity</span>
                <span>{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Surface Access</span>
                <span>Unlocked</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hidden Threads</span>
                <span className="text-halo">Active</span>
              </div>
            </div>
          </TerminalBlock>
        </div>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Card key={item.href} title={item.title} className="h-full">
              <p className="mt-3 text-sm text-slate-400">{item.detail}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex items-center text-xs uppercase tracking-[0.3em] text-signal hover:text-white"
              >
                Enter
              </Link>
            </Card>
          ))}
        </div>
      </Container>

      <Container className="pb-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <TerminalBlock title="Hints">
            <p className="text-sm text-slate-300">
              We pared back the theatrics. Clean controls, deeper depth. A few doors remain hidden:
              watch the console, the footer dot, and the copy that doesn&rsquo;t blink.
            </p>
            <p className="mt-4 text-xs text-slate-500">hex: 2f6e756c6c</p>
          </TerminalBlock>
          <Card title="Recent Library" className="p-8">
            <ArchiveGrid limit={3} />
          </Card>
        </div>
      </Container>
    </div>
  );
}
