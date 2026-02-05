import { NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { getAuthSession } from './auth';

export type AdminSession = Session & {
  user?: { id?: string; role?: string };
};

export async function requireAdmin() {
  const session = (await getAuthSession()) as AdminSession | null;
  const role = session?.user?.role;
  if (!session?.user?.id || !role || !['OWNER', 'ADMIN'].includes(role)) {
    return { session: null, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session, response: null };
}
