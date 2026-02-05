import type { Session } from 'next-auth';
import { getAuthSession } from './auth';
import { ROLE_TAGS } from './constants';

export type SessionUser = {
  id: string;
  username: string;
  bits: number;
  role: string;
  tag: string;
  userNumber?: number;
};

const FALLBACK_USER: SessionUser = {
  id: 'anonymous',
  username: 'Operator',
  bits: 0,
  role: 'USER',
  tag: ROLE_TAGS.USER.label,
};

export async function getSessionUser(): Promise<SessionUser> {
  try {
    const session = (await getAuthSession()) as Session | null;
    if (!session?.user) return FALLBACK_USER;
    return {
      id: session.user.id,
      username: session.user.username || session.user.name || FALLBACK_USER.username,
      bits: session.user.bits ?? FALLBACK_USER.bits,
      role: session.user.role ?? FALLBACK_USER.role,
      tag: session.user.tag ?? FALLBACK_USER.tag,
      userNumber: session.user.userNumber ?? undefined,
    };
  } catch (error) {
    console.error('Failed to read session', error);
    return FALLBACK_USER;
  }
}
