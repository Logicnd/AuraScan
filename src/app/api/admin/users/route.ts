import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      username: true,
      role: true,
      bits: true,
      tag: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}
