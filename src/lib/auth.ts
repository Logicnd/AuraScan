import { PrismaAdapter } from '@auth/prisma-adapter';
import type { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { LOGIN_REWARD, ROLE_TAGS, SIGNUP_BONUS } from './constants';
import { isReservedUsername, normalizeUsername } from './validators';
import { getOwnerUsername } from './ownership';

const ownerUsername = getOwnerUsername();

type AuthConfig = {
  adapter: ReturnType<typeof PrismaAdapter>;
  secret?: string;
  session: { strategy: 'jwt' };
  pages: { signIn: string };
  providers: unknown[];
  callbacks: unknown;
  events: unknown;
};

async function ensureUsername(base: string) {
  const cleaned = normalizeUsername(base).replace(/[^a-z0-9]/g, '').slice(0, 18) || 'player';
  let candidate = cleaned;
  let attempt = 0;
  // allow reserved only if matches owner username
  while (true) {
    const reserved = isReservedUsername(candidate) && candidate !== ownerUsername;
    const existing = await prisma.user.findUnique({ where: { username: candidate } });
    if (!reserved && !existing) {
      return candidate;
    }
    attempt += 1;
    candidate = `${cleaned}${attempt < 3 ? Date.now().toString().slice(-2 - attempt) : Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0')}`;
  }
}

async function ensureUserNumber(userId: string) {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { userNumber: true },
  });
  if (existing?.userNumber) return existing.userNumber;

  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.user.findUnique({
      where: { id: userId },
      select: { userNumber: true },
    });
    if (current?.userNumber) return current.userNumber;

    const { _max } = await tx.user.aggregate({
      _max: { userNumber: true },
    });
    const next = (_max.userNumber ?? 0) + 1;
    await tx.user.update({
      where: { id: userId },
      data: { userNumber: next },
    });
    return next;
  });

  return result;
}

async function awardLoginReward(userId: string) {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { bits: { increment: LOGIN_REWARD }, lastLoginAt: new Date() },
    }),
    prisma.transaction.create({
      data: {
        userId,
        amount: LOGIN_REWARD,
        reason: 'login_bonus',
        metadata: JSON.stringify({ message: 'Welcome back bonus' }),
      },
    }),
  ]);
}

export const authOptions: AuthConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = normalizeUsername(credentials?.username || '');
        const password = credentials?.password || '';

        if (!username || !password) {
          throw new Error('Username and password are required.');
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials.');
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          throw new Error('Invalid credentials.');
        }

        await awardLoginReward(user.id);

        const payload: User = {
          id: user.id,
          email: user.email ?? undefined,
          role: user.role,
          bits: user.bits + LOGIN_REWARD,
          tag: user.tag,
          username: user.username,
          userNumber: user.userNumber ?? undefined,
        };

        return payload as User;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: { user: User; account?: { provider?: string | undefined } | null; profile?: unknown }) {
      // Ensure username exists for OAuth users and assign bonus
      if (account?.provider === 'google' && user?.id) {
        const email = typeof (profile as { email?: string })?.email === 'string'
          ? (profile as { email?: string }).email
          : undefined;
        const proposed = email?.split('@')[0] || user.username || 'player';
        const username = await ensureUsername(proposed);
        const role = (user as User)?.role || 'USER';
        const userNumber = await ensureUserNumber(user.id);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            username,
            email: email ?? null,
            name: proposed,
            tag: ROLE_TAGS[role].label,
            role,
            bits: { increment: SIGNUP_BONUS },
            lastLoginAt: new Date(),
            userNumber,
          },
        }).catch(async () => {
          // If user not created yet (edge), create manually
          await prisma.user.create({
            data: {
              id: user.id,
              username,
              email: email ?? null,
              name: proposed,
              tag: ROLE_TAGS[role].label,
              role,
              bits: SIGNUP_BONUS,
              lastLoginAt: new Date(),
              userNumber,
            },
          });
        });

      await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: SIGNUP_BONUS,
          reason: 'oauth_signup_bonus',
          metadata: JSON.stringify({ provider: 'google' }),
        },
      });
      }
      return true;
    },
    async jwt({ token, user }: { token: Record<string, unknown>; user?: User | null }) {
      // merge fresh user data
      if (user) {
        const enriched = user as Partial<User>;
        token.role = enriched.role || token.role || 'USER';
        token.bits = (enriched.bits as number | undefined) ?? token.bits ?? SIGNUP_BONUS;
        token.tag = enriched.tag || ROLE_TAGS[token.role as string]?.label || 'Member';
        token.username = enriched.username || token.username;
      }
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: { username: true, role: true, tag: true, bits: true, userNumber: true },
        });
        if (dbUser) {
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.tag = dbUser.tag;
          token.bits = dbUser.bits;
          token.userNumber = dbUser.userNumber ?? (await ensureUserNumber(token.sub as string));
        }
      }
      return token;
    },
    async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
      const sessionUser = session.user as {
        id?: string;
        role?: string;
        bits?: number;
        tag?: string;
        username?: string;
        name?: string | null;
      } | undefined;
      if (sessionUser) {
        sessionUser.id = (token.sub as string) || sessionUser.id;
        sessionUser.role = (token.role as string) || 'USER';
        sessionUser.bits = (token.bits as number) ?? SIGNUP_BONUS;
        sessionUser.tag = (token.tag as string) || ROLE_TAGS.USER.label;
        sessionUser.username = (token.username as string) || sessionUser.name || 'player';
        session.user = sessionUser as unknown;
      }
      return session as unknown;
    },
  },
  events: {
    async signIn({ user }: { user?: User | null }) {
      if (!user?.id) return;
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      }).catch(() => {});
    },
    async createUser({ user }: { user?: User | null }) {
      if (!user?.id) return;
      const base = user.email?.split('@')[0] || user.username || 'player';
      const username = await ensureUsername(base);
      const totalUsers = await prisma.user.count();
      const isFirstUser = totalUsers === 1; // includes the freshly created record
      const role = isFirstUser || username === ownerUsername ? 'OWNER' : 'USER';
      const userNumber = await ensureUserNumber(user.id);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          username,
          tag: ROLE_TAGS[role].label,
          role,
          userNumber,
          bits: { increment: SIGNUP_BONUS },
        },
      }).catch(() => {});
      await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: SIGNUP_BONUS,
          reason: 'signup_bonus',
          metadata: JSON.stringify({ via: 'oauth_or_adapter' }),
        },
      }).catch(() => {});
    },
  },
};

export async function getAuthSession() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getServerSession(authOptions as any);
}
