import { NextResponse } from 'next/server';
import { adjustBits } from '../../../../lib/bits';
import { getAuthSession } from '../../../../lib/auth';

export async function POST(request: Request) {
  const session = (await getAuthSession()) as { user?: { id?: string; role?: string } } | null;
  const role = (session?.user as { role?: string })?.role;
  if (!role || !['OWNER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const userId = typeof body?.userId === 'string' ? body.userId : '';
  const amount = Number(body?.amount || 0);
  const reason = typeof body?.reason === 'string' ? body.reason : 'admin_adjust';
  const actorId = (session?.user as { id?: string })?.id;

  if (!userId || Number.isNaN(amount) || !amount) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const balance = await adjustBits(userId, amount, reason, { actor: actorId });
    return NextResponse.json({ ok: true, balance });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
