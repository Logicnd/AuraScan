import { cookies } from 'next/headers';

export type SessionUser = {
  name: string;
};

const FALLBACK_NAME = 'Operator';

export function getSessionUser(): SessionUser {
  try {
    const raw = cookies().get('aurascan_user')?.value;
    if (!raw) return { name: FALLBACK_NAME };
    const parsed = JSON.parse(decodeURIComponent(raw)) as SessionUser;
    if (!parsed?.name) return { name: FALLBACK_NAME };
    return { name: parsed.name };
  } catch {
    return { name: FALLBACK_NAME };
  }
}
