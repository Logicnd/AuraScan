import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthSession } from '../../../../lib/auth';

export async function GET() {
  const session = (await getAuthSession()) as { user?: { id?: string; role?: string } } | null;
  const role = (session?.user as { role?: string })?.role;
  if (!role || !['OWNER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, username: true, email: true, role: true, bits: true, tag: true, createdAt: true },
  });
  return NextResponse.json({ users });
}
