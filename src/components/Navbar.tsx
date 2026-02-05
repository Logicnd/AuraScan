'use client';

import Link from 'next/link';
import { useState } from 'react';
import Container from './Container';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/scan', label: 'Lab' },
  { href: '/archive', label: 'Library' },
  { href: '/signal', label: 'Signals' },
  { href: '/status', label: 'Status' },
];

type NavbarProps = {
  name?: string;
};

export default function Navbar({ name }: NavbarProps) {
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      // stay quiet; user can refresh
      console.error(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <nav className="border-b border-white/5 bg-black/30 backdrop-blur">
      <Container className="flex items-center justify-between py-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold text-slate-100">
            AuraScan<span className="text-signal">.io</span>
          </Link>
          <span className="h-2 w-2 rounded-full bg-signal shadow-glow" title="System online" />
        </div>
        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover-flicker transition">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-200">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em]">
            {name || 'Operator'}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={busy}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200 hover:bg-white/10"
          >
            {busy ? '...' : 'Sign out'}
          </button>
        </div>
      </Container>
    </nav>
  );
}
