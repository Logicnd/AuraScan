import { MIN_PASSWORD_LENGTH, RESERVED_USERNAMES, STRONG_PASSWORD_RULES } from './constants';

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function isReservedUsername(username: string) {
  const normalized = normalizeUsername(username);
  return RESERVED_USERNAMES.some((reserved) => normalized === reserved || normalized.startsWith(`${reserved}-`));
}

export function validatePassword(password: string): string | null {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  const missing = STRONG_PASSWORD_RULES.filter((rule) => !rule.test(password));
  if (missing.length) {
    return 'Password must include upper, lower, number, and symbol.';
  }
  return null;
}

export function suggestUsernames(base: string, count = 3): string[] {
  const cleaned = normalizeUsername(base).replace(/[^a-z0-9]/g, '');
  const now = Date.now().toString().slice(-4);
  const random = () => Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0');
  const variants = new Set<string>();

  while (variants.size < count) {
    variants.add(`${cleaned || 'player'}${variants.size === 0 ? now : random()}`);
  }

  return Array.from(variants);
}
