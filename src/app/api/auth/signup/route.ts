import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';
import { ROLE_TAGS, SIGNUP_BONUS } from '../../../../lib/constants';
import { getOwnerUsername } from '../../../../lib/ownership';
import { isReservedUsername, normalizeUsername, suggestUsernames, validatePassword } from '../../../../lib/validators';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const usernameRaw = typeof body?.username === 'string' ? body.username : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const emailRaw = typeof body?.email === 'string' ? body.email : '';

    const username = normalizeUsername(usernameRaw);
    const email = emailRaw?.trim().toLowerCase() || null;
    const ownerUsername = getOwnerUsername();

    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    if (isReservedUsername(username) && username !== ownerUsername) {
      return NextResponse.json(
        {
          error: 'That handle is reserved.',
          suggestions: suggestUsernames(username),
        },
        { status: 409 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        {
          error: 'Username already taken.',
          suggestions: suggestUsernames(username),
        },
        { status: 409 },
      );
    }

    if (email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
      }
    }

    const passwordIssue = validatePassword(password);
    if (passwordIssue) {
      return NextResponse.json({ error: passwordIssue }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const totalUsers = await tx.user.count();
      const isFirstUser = totalUsers === 0;
      const role = isFirstUser || username === ownerUsername ? 'OWNER' : 'USER';
      const tag = ROLE_TAGS[role].label;
      const { _max } = await tx.user.aggregate({ _max: { userNumber: true } });
      const nextNumber = (_max.userNumber ?? 0) + 1;

      const created = await tx.user.create({
        data: {
          username,
          email,
          passwordHash,
          role,
          tag,
          bits: SIGNUP_BONUS,
          userNumber: nextNumber,
        },
        select: { id: true, username: true, role: true, bits: true, tag: true, userNumber: true },
      });

      await tx.transaction.create({
        data: {
          userId: created.id,
          amount: SIGNUP_BONUS,
          reason: 'signup_bonus',
          metadata: JSON.stringify({ source: 'manual_signup' }),
        },
      });

      return created;
    });

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error('Signup failed', error);
    return NextResponse.json({ error: 'Signup failed. Please try again.' }, { status: 500 });
  }
}
