"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MIN_PASSWORD_LENGTH } from "../../../lib/constants";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Reset failed. Try requesting a new link.");
      }
      setStatus("done");
      setMessage("Password updated. You can log in with your new password.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to reset password.");
    }
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-white/10 bg-black/40 p-8 text-slate-200">
        <h1 className="text-2xl font-semibold">Reset link missing</h1>
        <p className="text-sm text-slate-400">The reset link is missing or malformed. Request a fresh link and try again.</p>
        <a href="/auth/forgot" className="text-signal hover:text-white">
          Request reset link
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-glow">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-mist">Account</p>
        <h1 className="text-3xl font-semibold text-slate-100">Choose a new password</h1>
        <p className="text-sm text-slate-400">Set a new password for your AuraScan account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-xs uppercase tracking-[0.3em] text-mist">
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={MIN_PASSWORD_LENGTH}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-100 outline-none"
            required
          />
        </label>

        {message ? <p className="text-sm text-slate-300">{message}</p> : null}

        <button
          type="submit"
          disabled={!password.trim() || status === "submitting"}
          className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-glow disabled:opacity-60"
        >
          {status === "submitting" ? "Updating..." : "Update password"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Return to{" "}
        <a href="/auth/login" className="text-signal hover:text-white">
          login
        </a>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-300">Loading reset form…</div>}>
      <ResetForm />
    </Suspense>
  );
}
