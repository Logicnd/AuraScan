import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

type Game = 'mines' | 'blackjack' | 'plinko';

const PAYOUTS: Record<Game, { winMultiplier: number; winChance: number }> = {
  mines: { winMultiplier: 1.8, winChance: 0.46 },
  blackjack: { winMultiplier: 2.1, winChance: 0.48 },
  plinko: { winMultiplier: 2.5, winChance: 0.35 },
};

export async function POST(request: Request) {
  const session = (await getAuthSession()) as { user?: { id?: string } } | null;
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const game = body?.game as Game;
  const wager = Number(body?.wager || 0);

  if (!['mines', 'blackjack', 'plinko'].includes(game)) {
    return NextResponse.json({ error: 'Unknown game' }, { status: 400 });
  }
  if (!wager || wager < 1) {
    return NextResponse.json({ error: 'Wager must be at least 1 Bit' }, { status: 400 });
  }

  const config = PAYOUTS[game];

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId }, select: { bits: true } });
      if (!user) throw new Error('User not found');
      if (user.bits < wager) throw new Error('Not enough Bits');

      const win = Math.random() < config.winChance;
      const payout = win ? Math.ceil(wager * config.winMultiplier) : 0;
      const delta = payout - wager;
      const balance = user.bits + delta;

      await tx.user.update({
        where: { id: userId },
        data: { bits: balance },
      });

      await tx.transaction.create({
        data: {
          userId,
          amount: delta,
          reason: `${game}_bet`,
          metadata: JSON.stringify({ wager, payout, win }),
        },
      });

      return { win, payout, balance, delta };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
