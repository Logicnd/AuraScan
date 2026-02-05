'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState('/');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const search = new URLSearchParams(window.location.search);
    setNext(search.get('next') || '/');
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Unable to sign in.');
      }
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Access</p>
        <h1 className="text-3xl font-semibold text-slate-100">Welcome back</h1>
        <p className="text-sm text-slate-400">
          Log in to unlock your dashboard. Your name stays on-device; no servers involved.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block text-xs uppercase tracking-[0.3em] text-mist">
          Display name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="eg. Nova"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-signal"
          />
        </label>
        {error ? <p className="text-sm text-ember">{error}</p> : null}
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-glow disabled:opacity-60"
        >
          {loading ? 'Connecting…' : 'Enter'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        New here? <a href="/auth/signup" className="text-signal hover:text-white">Create access</a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-slate-400">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
