"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ChromeIcon, LockIcon, UserIcon } from "lucide-react";
import { MIN_PASSWORD_LENGTH } from "../../../lib/constants";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const next = searchParams.get("next") || "/";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
        callbackUrl: next,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setError(null);
    signIn("google", { callbackUrl: next });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-mist">Access</p>
        <h1 className="text-3xl font-semibold text-slate-100">Welcome back</h1>
        <p className="text-sm text-slate-400">
          Log in to unlock your dashboard. Bits, badges, and games are bound to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-[0.3em] text-mist">
            Username
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
              <UserIcon size={16} className="text-slate-500" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="eg. nova"
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
              />
            </div>
          </label>
          <label className="block text-xs uppercase tracking-[0.3em] text-mist">
            Password
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
              <LockIcon size={16} className="text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} chars`}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
              />
            </div>
          </label>
        </div>
        {error ? <p className="text-sm text-ember">{error}</p> : null}
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="submit"
            disabled={!username.trim() || !password.trim() || loading}
            className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-glow disabled:opacity-60"
          >
            {loading ? "Connecting…" : "Enter"}
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-100 hover:bg-white/10"
          >
            <ChromeIcon size={16} />
            Continue with Google
          </button>
        </div>
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
