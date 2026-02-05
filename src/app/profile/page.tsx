"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LockIcon, MailIcon, SaveIcon, UserIcon } from "lucide-react";

type Profile = {
  id: string;
  username: string;
  email?: string | null;
  role: string;
  bits: number;
  tag: string;
  userNumber?: number | null;
  passwordHash?: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile({ ...data.user, passwordHash: data.hasPassword ? "set" : null });
        setUsername(data.user?.username ?? "");
        setEmail(data.user?.email ?? "");
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, currentPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update profile.");
      setProfile(data.user);
      setPassword("");
      setCurrentPassword("");
      toast.success("Profile updated");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div className="p-6 text-slate-300">Loading profile…</div>;
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-signal/10 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-3xl space-y-8 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-mist">Profile</p>
          <h1 className="text-3xl font-semibold text-slate-100">Account & Identity</h1>
          <p className="text-sm text-slate-400">Edit your handle, email, and password. Bits stay intact.</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <label className="block text-xs uppercase tracking-[0.3em] text-mist">
            Username
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
              <UserIcon size={16} className="text-slate-500" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
              />
            </div>
          </label>

          <label className="block text-xs uppercase tracking-[0.3em] text-mist">
            Email (optional)
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
              <MailIcon size={16} className="text-slate-500" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label className="block text-xs uppercase tracking-[0.3em] text-mist">
            New password (optional)
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
              <LockIcon size={16} className="text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 outline-none"
                placeholder="Leave blank to keep current"
              />
            </div>
          </label>

          {profile?.passwordHash ? (
            <label className="block text-xs uppercase tracking-[0.3em] text-mist">
              Current password (needed to change password)
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <LockIcon size={16} className="text-slate-500" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-100 outline-none"
                  placeholder="Enter current password"
                />
              </div>
            </label>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-glow disabled:opacity-50"
          >
            <SaveIcon size={16} />
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p>User ID: #{profile.userNumber ?? 'pending'}</p>
          <p>Bits: {profile.bits.toLocaleString()}</p>
          <p>Role: {profile.role}</p>
          <p>Tag: {profile.tag}</p>
        </div>
      </div>
    </div>
  );
}
