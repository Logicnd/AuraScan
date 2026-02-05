'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(data.error || 'Unable to create profile.');
      }
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Create</p>
        <h1 className="text-3xl font-semibold text-slate-100">Spin up your persona</h1>
        <p className="text-sm text-slate-400">
          Pick a handle. We keep it local and greet you every time you return.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block text-xs uppercase tracking-[0.3em] text-mist">
          Handle
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="eg. Umbra"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-signal"
          />
        </label>
        {error ? <p className="text-sm text-ember">{error}</p> : null}
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-glow disabled:opacity-60"
        >
          {loading ? 'Building profile…' : 'Create access'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already in? <a href="/auth/login" className="text-signal hover:text-white">Return to login</a>
      </p>
    </div>
  );
}
