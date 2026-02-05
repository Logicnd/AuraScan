import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { getAuthSession } from '../../../lib/auth';
import { getOwnerUsername } from '../../../lib/ownership';
import { isReservedUsername, normalizeUsername, validatePassword } from '../../../lib/validators';

export async function GET() {
  const session = (await getAuthSession()) as { user?: { id?: string } } | null;
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      bits: true,
      tag: true,
      userNumber: true,
      createdAt: true,
      passwordHash: true,
    },
  });
  return NextResponse.json({ user, hasPassword: Boolean(user?.passwordHash) });
}

export async function PUT(request: Request) {
  const session = (await getAuthSession()) as { user?: { id?: string } } | null;
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const usernameInput = typeof body?.username === 'string' ? body.username : '';
  const emailInput = typeof body?.email === 'string' ? body.email : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : '';

  const updates: Record<string, unknown> = {};
  const ownerUsername = getOwnerUsername();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (usernameInput) {
    const username = normalizeUsername(usernameInput);
    if (!username) {
      return NextResponse.json({ error: 'Username cannot be empty' }, { status: 400 });
    }
    if (isReservedUsername(username) && username !== ownerUsername) {
      return NextResponse.json({ error: 'That username is reserved.' }, { status: 409 });
    }
    if (username !== user.username) {
      const exists = await prisma.user.findUnique({ where: { username } });
      if (exists) {
        return NextResponse.json({ error: 'Username already taken.' }, { status: 409 });
      }
      updates.username = username;
    }
  }

  if (emailInput) {
    const email = emailInput.trim().toLowerCase();
    if (email !== user.email) {
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) {
        return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
      }
      updates.email = email;
    }
  }

  if (password) {
    const issue = validatePassword(password);
    if (issue) {
      return NextResponse.json({ error: issue }, { status: 400 });
    }
    if (user.passwordHash) {
      const matches = await bcrypt.compare(currentPassword || '', user.passwordHash);
      if (!matches) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }
    }
    updates.passwordHash = await bcrypt.hash(password, 12);
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ ok: true, user });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: { id: true, username: true, email: true, role: true, bits: true, tag: true, userNumber: true, updatedAt: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
