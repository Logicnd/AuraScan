"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockIcon, MailIcon, ShieldPlusIcon, UserPlusIcon } from "lucide-react";
import { MIN_PASSWORD_LENGTH, RESERVED_USERNAMES } from "../../../lib/constants";

type SignupError = { message: string; field?: "username" | "email" | "password"; code?: string } | null;

const usernamePattern = /^[a-z0-9-]+$/;

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<SignupError>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [touched, setTouched] = useState({ username: false, email: false, password: false });

  const usernameIssue = useMemo(() => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed) return "Handle is required.";
    if (trimmed.length < 3 || trimmed.length > 18) return "Handle must be 3-18 characters.";
    if (!usernamePattern.test(trimmed)) return "Use letters, numbers, or dashes only.";
    return null;
  }, [username]);

  const usernameWarning = useMemo(() => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed) return null;
    const reserved = RESERVED_USERNAMES.some(
      (reservedName) => trimmed === reservedName || trimmed.startsWith(`${reservedName}-`),
    );
    if (!reserved) return null;
    return "That handle is reserved unless you own the instance.";
  }, [username]);

  const passwordIssue = useMemo(() => {
    if (!password.trim()) return "Password is required.";
    if (password.length < MIN_PASSWORD_LENGTH) return `At least ${MIN_PASSWORD_LENGTH} characters.`;
    const checks = [
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    if (checks.includes(false)) return "Include upper, lower, number, and symbol.";
    return null;
  }, [password]);

  const emailIssue = useMemo(() => {
    const trimmed = email.trim();
    if (!trimmed) return null;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.toLowerCase());
    return valid ? null : "Email format looks invalid.";
  }, [email]);

  const canSubmit = !usernameIssue && !passwordIssue && !emailIssue && !loading;

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
      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        // ignore parse errors; we'll fall back to status text
      }
      const parsed = data as {
        ok?: boolean;
        error?: string;
        suggestions?: string[];
        field?: "username" | "email" | "password";
        code?: string;
      } | null;
      if (!response.ok || parsed?.ok === false) {
        setSuggestions(parsed?.suggestions || []);
        const message = parsed?.error || response.statusText || "Unable to create profile.";
        const err = new Error(message) as Error & { field?: "username" | "email" | "password"; code?: string };
        err.field = parsed?.field;
        err.code = parsed?.code;
        throw err;
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
      if (err instanceof Error) {
        const typed = err as Error & { field?: "username" | "email" | "password"; code?: string };
        setError({ message: typed.message, field: typed.field, code: typed.code });
      } else {
        setError({ message: "Unable to create profile." });
      }
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
              onChange={(event) => setUsername(event.target.value.toLowerCase())}
              onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
              placeholder="eg. neon-player"
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full bg-transparent text-sm text-slate-100 outline-none"
            />
          </div>
          {touched.username && usernameIssue ? (
            <p className="mt-2 text-xs text-ember">{usernameIssue}</p>
          ) : null}
          {!usernameIssue && usernameWarning ? (
            <p className="mt-2 text-xs text-amber-200">{usernameWarning}</p>
          ) : null}
          {error?.field === "username" ? <p className="mt-2 text-xs text-ember">{error.message}</p> : null}
        </label>

        <label className="block text-xs uppercase tracking-[0.3em] text-mist">
          Email (optional, only for resets)
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
            <MailIcon size={16} className="text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full bg-transparent text-sm text-slate-100 outline-none"
            />
          </div>
          {touched.email && emailIssue ? <p className="mt-2 text-xs text-ember">{emailIssue}</p> : null}
          {error?.field === "email" ? <p className="mt-2 text-xs text-ember">{error.message}</p> : null}
        </label>

        <label className="block text-xs uppercase tracking-[0.3em] text-mist">
          Password
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
            <LockIcon size={16} className="text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              placeholder={`At least ${MIN_PASSWORD_LENGTH} chars with A/a/0/!`}
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full bg-transparent text-sm text-slate-100 outline-none"
            />
          </div>
          {touched.password && passwordIssue ? (
            <p className="mt-2 text-xs text-ember">{passwordIssue}</p>
          ) : null}
          {error?.field === "password" ? <p className="mt-2 text-xs text-ember">{error.message}</p> : null}
        </label>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Rules</p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <div>
              <p className="font-semibold text-white">Handle</p>
              <p className="text-slate-400">3-18 chars, lowercase, digits, dashes.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Password</p>
              <p className="text-slate-400">Upper + lower + number + symbol.</p>
            </div>
          </div>
        </div>

        {error && !error.field ? <p className="text-sm text-ember">{error.message}</p> : null}
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
          disabled={!canSubmit}
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
