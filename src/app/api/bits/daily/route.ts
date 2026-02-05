import { NextResponse } from 'next/server';
import { claimDailyReward } from '../../../../lib/bits';
import { getAuthSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = (await getAuthSession()) as { user?: { id?: string } } | null;
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const balance = await claimDailyReward(userId);
    return NextResponse.json({ balance });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
