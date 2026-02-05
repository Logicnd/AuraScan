import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  const userId = typeof body?.userId === 'string' ? body.userId : '';
  const amount = Number(body?.amount ?? 0);
  const reason = typeof body?.reason === 'string' ? body.reason.trim() : 'admin_adjust';

  if (!userId) {
    return NextResponse.json({ error: 'User is required.' }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount === 0) {
    return NextResponse.json({ error: 'Adjustment amount is required.' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId }, select: { bits: true } });
      if (!user) throw new Error('User not found');
      const nextBalance = user.bits + amount;
      if (nextBalance < 0) {
        throw new Error('Balance cannot go below zero.');
      }

      await tx.user.update({
        where: { id: userId },
        data: { bits: nextBalance },
      });

      await tx.transaction.create({
        data: {
          userId,
          amount,
          reason,
          metadata: JSON.stringify({ source: 'admin_panel' }),
        },
      });

      return { balance: nextBalance };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
