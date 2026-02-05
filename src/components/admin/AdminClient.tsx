"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import ky from "ky";
import { toast } from "sonner";
import { CoinsIcon, FlagIcon, ListChecksIcon, TerminalSquareIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Flag = { id: string; key: string; label: string; description?: string; enabled: boolean; updatedAt: string };
type User = { id: string; username: string; role: string; bits: number; tag: string; createdAt: string };

const fetcher = <T,>(url: string) => ky.get(url).json<T>();

export default function AdminClient() {
  const { data: flagData, mutate: refreshFlags } = useSWR<{ flags: Flag[] }>("/api/admin/flags", (url: string) =>
    fetcher<{ flags: Flag[] }>(url),
  );
  const { data: userData, mutate: refreshUsers } = useSWR<{ users: User[] }>("/api/admin/users", (url: string) =>
    fetcher<{ users: User[] }>(url),
  );

  const [flagForm, setFlagForm] = useState({ key: "", label: "", description: "", enabled: false });
  const [adjustForm, setAdjustForm] = useState({ userId: "", amount: 0, reason: "admin_adjust" });
  const [log, setLog] = useState<string[]>(["Admin console ready."]);

  useEffect(() => {
    if (userData?.users?.length) {
      setAdjustForm((prev) => ({ ...prev, userId: userData.users[0].id }));
    }
  }, [userData]);

  const pushLog = (entry: string) => setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${entry}`, ...prev].slice(0, 20));

  const toggleFlag = async (flag: Flag) => {
    try {
      await ky.post("/api/admin/flags", { json: { ...flag, enabled: !flag.enabled } });
      pushLog(`Flag ${flag.key} set to ${!flag.enabled}`);
      refreshFlags();
    } catch {
      toast.error("Failed to update flag");
      pushLog("Flag update failed");
    }
  };

  const createFlag = async () => {
    try {
      await ky.post("/api/admin/flags", { json: flagForm });
      toast.success("Flag saved");
      pushLog(`Flag ${flagForm.key} saved`);
      setFlagForm({ key: "", label: "", description: "", enabled: false });
      refreshFlags();
    } catch {
      toast.error("Could not save flag");
    }
  };

  const adjustBits = async () => {
    try {
      await ky.post("/api/bits/adjust", { json: adjustForm });
      toast.success("Balance adjusted");
      pushLog(`Bits adjusted for ${adjustForm.userId} by ${adjustForm.amount}`);
      refreshUsers();
    } catch {
      toast.error("Failed to adjust bits");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Feature toggles</p>
            <h3 className="text-xl font-semibold text-white">Global switches</h3>
          </div>
          <FlagIcon size={18} className="text-amber-300" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {flagData?.flags?.map((flag: Flag) => (
            <label
              key={flag.id}
              className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-black/40 p-4 transition hover:border-white/20"
            >
              <div>
                <p className="text-sm font-semibold text-white">{flag.label}</p>
                <p className="text-xs text-slate-400">{flag.description}</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                  {flag.key} • {dayjs(flag.updatedAt).fromNow()}
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={flag.enabled}
                onChange={() => toggleFlag(flag)}
              />
            </label>
          ))}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[2fr_1fr]">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Create / Update flag</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <input
                placeholder="key"
                value={flagForm.key}
                onChange={(e) => setFlagForm((f) => ({ ...f, key: e.target.value }))}
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
              />
              <input
                placeholder="Label"
                value={flagForm.label}
                onChange={(e) => setFlagForm((f) => ({ ...f, label: e.target.value }))}
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
              />
              <input
                placeholder="Description"
                value={flagForm.description}
                onChange={(e) => setFlagForm((f) => ({ ...f, description: e.target.value }))}
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none md:col-span-2"
              />
              <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={flagForm.enabled}
                  onChange={(e) => setFlagForm((f) => ({ ...f, enabled: e.target.checked }))}
                />
                Enabled
              </label>
              <button
                type="button"
                onClick={createFlag}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950"
              >
                Save flag
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Adjust bits</p>
            <div className="mt-3 space-y-2">
              <select
                value={adjustForm.userId}
                onChange={(e) => setAdjustForm((f) => ({ ...f, userId: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
              >
                {userData?.users?.map((u: User) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.bits} Bits)
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={adjustForm.amount}
                onChange={(e) => setAdjustForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
                placeholder="+/- amount"
              />
              <input
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm((f) => ({ ...f, reason: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
              />
              <button
                type="button"
                onClick={adjustBits}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100"
              >
                <CoinsIcon size={14} /> Apply
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Accounts</p>
            <h3 className="text-xl font-semibold text-white">Recent signups</h3>
          </div>
          <ListChecksIcon size={18} className="text-signal" />
        </div>
        <div className="mt-3 space-y-2">
          {userData?.users?.map((user: User) => (
            <div key={user.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-white">{user.username}</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                  {user.role} • {user.tag} • {dayjs(user.createdAt).format("MMM D, HH:mm")}
                </p>
              </div>
              <p className="text-sm font-semibold text-amber-200">{user.bits.toLocaleString()} Bits</p>
            </div>
          ))}
          {!userData?.users?.length ? <p className="text-sm text-slate-500">No users yet.</p> : null}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/60 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Terminal</p>
            <h3 className="text-xl font-semibold text-white">Command log</h3>
          </div>
          <TerminalSquareIcon size={18} className="text-emerald-300" />
        </div>
        <div className="mt-3 h-48 overflow-y-auto rounded-xl border border-white/5 bg-black/50 p-3 font-mono text-xs text-emerald-200">
          {log.map((entry, idx) => (
            <p key={idx}>{entry}</p>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLog([])}
          className="mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-white"
        >
          Clear log
        </button>
      </section>
    </div>
  );
}
