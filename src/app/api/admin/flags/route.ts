import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getAuthSession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = (await getAuthSession()) as { user?: { id?: string; role?: string } } | null;
  const role = (session?.user as { role?: string })?.role;
  if (!role || !['OWNER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const flags = await prisma.featureToggle.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ flags });
}

export async function POST(request: Request) {
  const session = (await getAuthSession()) as { user?: { id?: string; role?: string } } | null;
  const role = (session?.user as { role?: string })?.role;
  if (!role || !['OWNER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const key = typeof body?.key === 'string' ? body.key : '';
  const label = typeof body?.label === 'string' ? body.label : '';
  const description = typeof body?.description === 'string' ? body.description : '';
  const enabled = Boolean(body?.enabled);

  if (!key || !label) {
    return NextResponse.json({ error: 'Key and label are required.' }, { status: 400 });
  }

  const userId = (session?.user as { id?: string })?.id;

  const flag = await prisma.featureToggle.upsert({
    where: { key },
    create: {
      key,
      label,
      description,
      enabled,
      ownerId: userId || undefined,
    },
    update: {
      label,
      description,
      enabled,
      ownerId: userId || undefined,
    },
  });

  return NextResponse.json({ ok: true, flag });
}
