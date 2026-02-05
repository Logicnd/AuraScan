import { NextResponse } from 'next/server';
import { getLeaderboard } from '../../../lib/bits';

export async function GET() {
  const leaders = await getLeaderboard(25);
  return NextResponse.json({ leaders });
}
