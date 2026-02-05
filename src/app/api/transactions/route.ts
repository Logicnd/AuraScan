import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getAuthSession } from '../../../lib/auth';

export async function GET() {
  const session = (await getAuthSession()) as { user?: { id?: string } } | null;
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const items = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return NextResponse.json({ transactions: items });
}
