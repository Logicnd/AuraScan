export const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'owner',
  'root',
  'test',
  'tester',
  'system',
  'operator',
  'moderator',
  'mod',
  'staff',
  'developer',
  'dev',
  'support',
  'team',
  'sys',
  'console',
  'server',
  'bot',
];

export const MIN_PASSWORD_LENGTH = 8;

export const STRONG_PASSWORD_RULES = [
  /[A-Z]/,
  /[a-z]/,
  /[0-9]/,
  /[^A-Za-z0-9]/,
];

export const DAILY_REWARD_AMOUNT = 250;
export const SIGNUP_BONUS = 1000;
export const LOGIN_REWARD = 100;

export const ROLE_TAGS: Record<string, { label: string; color: string }> = {
  OWNER: { label: 'Owner', color: 'bg-amber-400 text-slate-950' },
  ADMIN: { label: 'Admin', color: 'bg-rose-500 text-slate-50' },
  USER: { label: 'Member', color: 'bg-white/10 text-slate-100' },
};
