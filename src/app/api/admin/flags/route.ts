import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const flags = await prisma.featureToggle.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ flags });
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json().catch(() => null);
  const key = typeof body?.key === 'string' ? body.key.trim() : '';
  const label = typeof body?.label === 'string' ? body.label.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const enabled = Boolean(body?.enabled);

  if (!key || !label) {
    return NextResponse.json({ error: 'Key and label are required.' }, { status: 400 });
  }

  const flag = await prisma.featureToggle.upsert({
    where: { key },
    update: { label, description, enabled },
    create: { key, label, description, enabled },
  });

  return NextResponse.json({ ok: true, flag });
}
