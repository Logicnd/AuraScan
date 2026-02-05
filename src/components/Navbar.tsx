'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { CoinsIcon, CrownIcon } from 'lucide-react';
import Container from './Container';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/scan', label: 'Lab' },
  { href: '/archive', label: 'Library' },
  { href: '/signal', label: 'Signals' },
  { href: '/status', label: 'Status' },
  { href: '/arcade', label: 'Arcade' },
  { href: '/profile', label: 'Profile' },
];

type NavbarProps = {
  name?: string;
  bits?: number;
  tag?: string;
  role?: string;
};

export default function Navbar({ name, bits = 0, tag = 'Member', role = 'USER' }: NavbarProps) {
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOut({ callbackUrl: '/auth/login' });
    } catch (error) {
      console.error(error);
      setBusy(false);
    }
  };

  const roleBadge = (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em]">
      {name || 'Operator'}
    </span>
  );

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
          {['OWNER', 'ADMIN'].includes(role) ? (
            <Link href="/admin" className="hover-flicker text-amber-300 transition">
              Admin
            </Link>
          ) : null}
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-200">
          <span className="flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
            <CoinsIcon size={14} />
            {bits.toLocaleString()} Bits
          </span>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-200">
            {['OWNER', 'ADMIN'].includes(role) ? <CrownIcon size={14} className="text-amber-200" /> : null}
            {tag}
          </span>
          {roleBadge}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={busy}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-200 hover:bg-white/10 disabled:opacity-60"
          >
            {busy ? '...' : 'Sign out'}
          </button>
        </div>
      </Container>
    </nav>
  );
}
