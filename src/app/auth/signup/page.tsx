"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockIcon, MailIcon, ShieldPlusIcon, UserPlusIcon } from "lucide-react";
import { MIN_PASSWORD_LENGTH, RESERVED_USERNAMES } from "../../../lib/constants";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuggestions([]);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSuggestions(data?.suggestions || []);
        throw new Error(data.error || "Unable to create profile.");
      }
      // Auto sign-in after signup
      await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/arcade",
      });
      router.replace("/arcade");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create profile.");
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
          Pick a handle. Bits live on the server—no more local storage fakery. Reserved handles: {RESERVED_USERNAMES.slice(0, 6).join(", ")}…
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block text-xs uppercase tracking-[0.3em] text-mist">
          Handle
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
            <UserPlusIcon size={16} className="text-slate-500" />
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="eg. neon-player"
              className="w-full bg-transparent text-sm text-slate-100 outline-none"
            />
          </div>
        </label>

        <label className="block text-xs uppercase tracking-[0.3em] text-mist">
          Email (optional, only for resets)
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
            <MailIcon size={16} className="text-slate-500" />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
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
              placeholder={`At least ${MIN_PASSWORD_LENGTH} chars with A/a/0/!`}
              className="w-full bg-transparent text-sm text-slate-100 outline-none"
            />
          </div>
        </label>

        {error ? <p className="text-sm text-ember">{error}</p> : null}
        {suggestions.length ? (
          <p className="text-xs text-slate-400">
            Try:{" "}
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setUsername(s)}
                className="mr-2 rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-signal"
              >
                {s}
              </button>
            ))}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!username.trim() || !password.trim() || loading}
          className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-glow disabled:opacity-60"
        >
          {loading ? "Building profile…" : "Create access"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already in? <a href="/auth/login" className="text-signal hover:text-white">Return to login</a>
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-amber-200">
          <ShieldPlusIcon size={14} />
          Server-side authentication with hashed passwords & JWT sessions. Google OAuth is available if you prefer one tap.
        </div>
      </div>
    </div>
  );
}
