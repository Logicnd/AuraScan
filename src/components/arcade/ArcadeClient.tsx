"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import ky from "ky";
import { CoinsIcon, GiftIcon, RocketIcon, TerminalIcon, TrophyIcon } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import dayjs from "dayjs";

type Leader = { id: string; username: string; bits: number; role: string; tag: string };
type Transaction = { id: string; amount: number; reason: string; metadata?: Record<string, unknown> | null; createdAt: string };

type Props = {
  initialBits: number;
  leaderboard: Leader[];
  user: { id: string; username: string; role: string; tag: string };
  transactions: Transaction[];
};

const fetcher = (url: string) => ky.get(url).json<{ leaders: Leader[] }>();

const games = [
  {
    key: "mines",
    title: "Mines",
    blurb: "Tiptoe across a volatile grid. Cash out before it blows.",
    accent: "bg-emerald-400/20 border-emerald-400/30",
  },
  {
    key: "blackjack",
    title: "Blackjack",
    blurb: "Beat the dealer—fast hands, cleaner odds, no cash lost.",
    accent: "bg-cyan-400/20 border-cyan-400/30",
  },
  {
    key: "plinko",
    title: "Plinko",
    blurb: "Drop, bounce, pray. Big arcs, bigger swings.",
    accent: "bg-amber-400/20 border-amber-400/30",
  },
] as const;

export default function ArcadeClient({ initialBits, leaderboard, user, transactions }: Props) {
  const [bits, setBits] = useState(initialBits);
  const [log, setLog] = useState<string[]>(["Booting arcade core..."]);
  const [recent, setRecent] = useState<Transaction[]>(transactions);
  const [wagers, setWagers] = useState<Record<string, number>>({
    mines: 25,
    blackjack: 50,
    plinko: 75,
  });

  const { data: liveLeaderboard } = useSWR("/api/leaderboard", fetcher, { refreshInterval: 12_000 });

  const leaders = liveLeaderboard?.leaders ?? leaderboard;

  const pushLog = (entry: string) =>
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${entry}`, ...prev].slice(0, 12));

  const handleDaily = async () => {
    try {
      const res = await ky.post("/api/bits/daily").json<{ balance: number }>();
      setBits(res.balance);
      pushLog(`Daily bonus claimed. Balance: ${res.balance} Bits`);
      toast.success("Daily bonus added", { description: `New balance: ${res.balance.toLocaleString()} Bits` });
    } catch (error) {
      const message = (error as Error).message || "Already claimed or unavailable.";
      pushLog(message);
      toast.error(message);
    }
  };

  const play = async (game: string) => {
    try {
      const wager = wagers[game] || 0;
      const res = await ky
        .post("/api/arcade/play", { json: { game, wager } })
        .json<{ win: boolean; payout: number; balance: number; delta: number }>();
      setBits(res.balance);
      setRecent((prev) =>
        [
          {
            id: crypto.randomUUID(),
            amount: res.delta,
            reason: `${game}_bet`,
            createdAt: new Date().toISOString(),
            metadata: { wager, payout: res.payout, win: res.win },
          },
          ...prev,
        ].slice(0, 12),
      );
      pushLog(`${game} ${res.win ? "WIN" : "LOSE"} | Δ ${res.delta} | balance ${res.balance}`);
      toast(res.win ? "Win!" : "Tough break", {
        description: `${res.delta >= 0 ? "+" : ""}${res.delta} Bits — new balance ${res.balance.toLocaleString()}`,
      });
    } catch (error) {
      const message = (error as Error).message || "Bet failed";
      toast.error(message);
      pushLog(message);
    }
  };

  const terminalHint = useMemo(
    () => [
      "Type 'help' for commands: balance, daily, clear",
      "Use bits responsibly—this is F2P, no cash.",
      "Reserved handles are blocked for safety.",
    ],
    [],
  );

  const runCommand = (value: string) => {
    const cmd = value.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "help") {
      pushLog("Commands: balance, daily, clear, leaderboard");
    } else if (cmd === "balance") {
      pushLog(`Balance: ${bits} Bits`);
    } else if (cmd === "daily") {
      handleDaily();
    } else if (cmd === "leaderboard") {
      const top = leaders
        .slice(0, 5)
        .map((l) => `${l.username} (${l.bits})`)
        .join(" · ");
      pushLog(`Top: ${top}`);
    } else if (cmd === "clear") {
      setLog([]);
    } else {
      pushLog(`Unknown command: ${cmd}`);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-amber-100">
            Bits
            <CoinsIcon size={16} />
          </div>
          <p className="mt-2 text-3xl font-semibold text-amber-200">{bits.toLocaleString()}</p>
          <p className="text-xs text-amber-100/80">Stored server-side</p>
        </div>
        <button
          type="button"
          onClick={handleDaily}
          className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-left transition hover:border-emerald-200/60 hover:bg-emerald-300/20"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-emerald-100">
            Daily Bonus
            <GiftIcon size={16} />
          </div>
          <p className="mt-2 text-2xl font-semibold text-emerald-100">+250 Bits</p>
          <p className="text-xs text-emerald-100/80">Claim once per day</p>
        </button>
        <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-cyan-100">
            Rank
            <TrophyIcon size={16} />
          </div>
          <p className="mt-2 text-2xl font-semibold text-cyan-100">{user.tag}</p>
          <p className="text-xs text-cyan-100/80">{user.role}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-200">
            Player
            <RocketIcon size={16} />
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{user.username}</p>
          <p className="text-xs text-slate-400">Account-based save, no trading.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {games.map((game) => (
          <div
            key={game.key}
            className={clsx(
              "rounded-2xl border p-5 shadow-inner shadow-black/40 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30",
              game.accent,
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{game.title}</h3>
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">{game.key}</span>
            </div>
            <p className="mt-2 text-sm text-white/80">{game.blurb}</p>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={bits}
                value={wagers[game.key]}
                onChange={(e) =>
                  setWagers((prev) => ({ ...prev, [game.key]: Number(e.target.value || 0) }))
                }
                className="w-24 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
              />
              <button
                type="button"
                onClick={() => play(game.key)}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
              >
                Play ({wagers[game.key]} Bits)
              </button>
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/60">
              Server-resolved outcome • logged in DB
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Bits leaderboard</p>
              <h3 className="text-xl font-semibold text-white">Top earners</h3>
            </div>
            <TrophyIcon size={18} className="text-amber-300" />
          </div>
          <div className="mt-4 space-y-2">
            {leaders.map((leader: Leader, index: number) => (
              <div
                key={leader.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{leader.username}</p>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                      {leader.tag} • {leader.role}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-amber-200">{leader.bits.toLocaleString()} Bits</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Terminal</p>
              <h3 className="text-xl font-semibold text-white">Arcade console</h3>
            </div>
            <TerminalIcon size={18} className="text-signal" />
          </div>
          <div className="mt-3 h-48 overflow-y-auto rounded-xl border border-white/5 bg-black/50 p-3 font-mono text-xs text-emerald-200">
            {log.length === 0 ? (
              <p className="text-slate-500">Console quiet. Run help.</p>
            ) : (
              log.map((entry, idx) => <p key={idx}>{entry}</p>)
            )}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const value = (e.currentTarget.elements.namedItem("command") as HTMLInputElement).value;
              runCommand(value);
              (e.currentTarget.elements.namedItem("command") as HTMLInputElement).value = "";
            }}
          >
            <input
              name="command"
              placeholder="balance | daily | help"
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
            />
            <button
              type="submit"
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              Run
            </button>
          </form>
          <div className="mt-2 text-[11px] text-slate-500">
            {terminalHint.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Recent activity</p>
            <h3 className="text-xl font-semibold text-white">Transactions</h3>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {recent.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-white">{item.reason}</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                  {dayjs(item.createdAt).format("MMM D, HH:mm")}
                </p>
              </div>
              <p className={clsx("text-sm font-semibold", item.amount >= 0 ? "text-emerald-200" : "text-amber-200")}>
                {item.amount >= 0 ? "+" : ""}
                {item.amount} Bits
              </p>
            </div>
          ))}
          {recent.length === 0 ? <p className="text-sm text-slate-500">No transactions yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
