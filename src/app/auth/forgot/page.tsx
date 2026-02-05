"use client";

import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        throw new Error("Unable to send reset link right now.");
      }
      setStatus("sent");
      setMessage("If that email is registered, we just sent a reset link (valid for 30 minutes).");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-glow">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-mist">Account</p>
        <h1 className="text-3xl font-semibold text-slate-100">Reset password</h1>
        <p className="text-sm text-slate-400">
          Enter the email on your AuraScan account. We&apos;ll send a secure link that expires in 30 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-xs uppercase tracking-[0.3em] text-mist">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@aurascan.lol"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-100 outline-none"
            required
          />
        </label>

        {message ? <p className="text-sm text-slate-300">{message}</p> : null}

        <button
          type="submit"
          disabled={!email.trim() || status === "sending"}
          className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-glow disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Remembered your password?{" "}
        <a href="/auth/login" className="text-signal hover:text-white">
          Back to login
        </a>
      </p>
    </div>
  );
}
