import { MIN_PASSWORD_LENGTH, RESERVED_USERNAMES, STRONG_PASSWORD_RULES } from './constants';

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);
  if (!normalized) {
    return 'Handle is required.';
  }
  if (normalized.length < 3 || normalized.length > 18) {
    return 'Handle must be 3-18 characters.';
  }
  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return 'Handle can only include letters, numbers, and dashes.';
  }
  return null;
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

export function validateEmail(email: string | null): string | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  if (!valid) return 'Email format looks invalid.';
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
