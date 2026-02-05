import Link from 'next/link';
import Container from '../components/Container';
import { getSessionUser } from '../lib/session';

export default async function HomePage() {
  const user = await getSessionUser();
  const isAuthed = user.id !== 'anonymous';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-12 top-16 h-64 w-64 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute right-6 top-40 h-52 w-52 rounded-full bg-emerald-400/10 blur-[100px]" />
      </div>

      <Container className="flex min-h-screen items-center py-16">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-mist">AuraScan</p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
              Minimal surface. Serious signal.
            </h1>
            <p className="max-w-2xl text-base text-slate-300">
              A clean entry to your scans and sessions. Log in to access the console and archived work.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/login"
              className="rounded-full bg-signal px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-950 shadow-glow"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 hover:bg-white/10"
            >
              Create access
            </Link>
            {isAuthed ? (
              <Link
                href="/scan"
                className="rounded-full border border-signal/50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-signal hover:bg-signal/10"
              >
                Open console
              </Link>
            ) : null}
          </div>

          <div className="grid gap-4 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-mist">Secure</p>
              <p className="mt-2 text-slate-100">Private sessions, encrypted at rest.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-mist">Fast</p>
              <p className="mt-2 text-slate-100">Deterministic scans without UI noise.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-mist">Ready</p>
              <p className="mt-2 text-slate-100">Jump into the lab when you sign in.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
