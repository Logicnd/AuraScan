'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import Container from './Container';
import { useGhostMemory } from '../hooks/useGhostMemory';

const links = [
  { href: '/', label: 'Home' },
  { href: '/scan', label: 'Scan' },
  { href: '/archive', label: 'Archive' },
  { href: '/signal', label: 'Signal Log' },
  { href: '/status', label: 'Status' }
];

export default function Navbar() {
  const { profile, recordLogoClick, unlockFlag } = useGhostMemory();
  const hasUnlocks = Boolean(profile?.unlockedFlags.length);

  const statusLabel = useMemo(
    () => (hasUnlocks ? 'Anomaly registered' : 'No anomalies'),
    [hasUnlocks]
  );

  const handleLogoClick = () => {
    const next = recordLogoClick();
    if (!next) return;
    if (next.logoClicks >= 7 && !next.unlockedFlags.includes('glyph')) {
      unlockFlag('glyph');
      console.log('[AURASCAN] anomaly registered');
    }
  };

  return (
    <nav className="border-b border-white/5 bg-black/30 backdrop-blur">
      <Container className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-lg font-semibold text-slate-100"
            onClick={handleLogoClick}
          >
            AuraScan<span className="text-signal">.lol</span>
          </Link>
          {profile?.unlockedFlags.includes('glyph') ? (
            <span className="text-xs uppercase tracking-[0.5em] text-signal">*</span>
          ) : null}
          <span
            className={`h-2 w-2 rounded-full ${
              hasUnlocks ? 'bg-ember shadow-glow' : 'bg-white/20'
            }`}
            title={statusLabel}
          />
        </div>
        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover-flicker transition">
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/scan"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200"
        >
          Run Scan
        </Link>
      </Container>
    </nav>
  );
}
