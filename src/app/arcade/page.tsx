import Container from '../../components/Container';
import ArcadeClient from '../../components/arcade/ArcadeClient';
import TerminalBlock from '../../components/TerminalBlock';
import { getSessionUser } from '../../lib/session';
import { getLeaderboard, getRecentTransactions } from '../../lib/bits';

export const metadata = {
  title: 'Gambling Arcade',
  description: 'Bits Casino — free-to-play arcade with server-side accounts.',
};

export default async function ArcadePage() {
  const user = await getSessionUser();
  const leaderboard = await getLeaderboard(15);
  const transactions = (await getRecentTransactions(user.id)).map((tx) => ({
    ...tx,
    createdAt: tx.createdAt.toISOString(),
    metadata: tx.metadata ? JSON.parse(tx.metadata) : null,
  }));

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-0 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="absolute right-10 top-32 h-[380px] w-[380px] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <Container className="py-12 md:py-16 space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-100">
              Gambling Arcade
              <span className="rounded-full bg-amber-300/20 px-2 py-1 text-[10px] font-semibold text-amber-200">Bits Casino</span>
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-100 md:text-5xl">Free-to-play, server-first.</h1>
            <p className="max-w-3xl text-lg text-slate-300">
              Earn Bits daily. Spend them on Mines, Blackjack, and Plinko. Everything is account-bound, logged in the database, and guarded against
              reserved usernames. Welcome back, {user.username}.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#games"
                className="hover-flicker rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow"
              >
                Launch games
              </a>
              <a
                href="/admin"
                className="hover-flicker rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100"
              >
                Admin panel
              </a>
              <a
                href="/profile"
                className="hover-flicker rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100"
              >
                Edit profile
              </a>
            </div>
          </div>

          <TerminalBlock title="Bits Console">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Player</span>
                <span className="text-amber-200">{user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Balance</span>
                <span className="text-amber-200">{user.bits.toLocaleString()} Bits</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rank</span>
                <span className="text-emerald-200">{user.tag}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Persistence</span>
                <span className="text-signal">Database-backed</span>
              </div>
            </div>
          </TerminalBlock>
        </div>

        <div id="games">
          <ArcadeClient initialBits={user.bits} leaderboard={leaderboard} user={user} transactions={transactions} />
        </div>
      </Container>
    </div>
  );
}
