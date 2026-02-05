import { NextResponse } from 'next/server';
import { getAuthSession } from '../../../../lib/auth';
import { claimDailyReward } from '../../../../lib/bits';

export async function POST() {
  const session = (await getAuthSession()) as { user?: { id?: string } } | null;
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const balance = await claimDailyReward(userId);
    return NextResponse.json({ ok: true, balance });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
