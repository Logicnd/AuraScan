export type GhostProfile = {
  firstVisit: string;
  totalVisits: number;
  lastScanHash: string | null;
  unlockedFlags: string[];
  lastSeenRoute: string;
  entropySeed: string;
  scanCount: number;
  signalVisits: number;
  logoClicks: number;
};

const STORAGE_KEY = 'aurascan:ghost-memory:v1';

const createEntropySeed = () => {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0].toString(16);
  }
  return Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .padStart(8, '0');
};

export const createGhostProfile = (route = '/', initialVisits = 1): GhostProfile => {
  const now = new Date().toISOString();
  return {
    firstVisit: now,
    totalVisits: initialVisits,
    lastScanHash: null,
    unlockedFlags: [],
    lastSeenRoute: route,
    entropySeed: createEntropySeed(),
    scanCount: 0,
    signalVisits: 0,
    logoClicks: 0
  };
};

export const loadGhostProfile = (): GhostProfile | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GhostProfile;
  } catch {
    return null;
  }
};

export const saveGhostProfile = (profile: GhostProfile) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const updateGhostProfile = (updater: (profile: GhostProfile) => GhostProfile) => {
  const current = loadGhostProfile() ?? createGhostProfile('/', 0);
  const next = updater(current);
  saveGhostProfile(next);
  return next;
};

export const hashInput = (input: string) => {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const hasUnlock = (profile: GhostProfile | null, flag: string) =>
  Boolean(profile?.unlockedFlags.includes(flag));

export const addUnlock = (profile: GhostProfile, flag: string) => {
  if (profile.unlockedFlags.includes(flag)) return profile;
  return { ...profile, unlockedFlags: [...profile.unlockedFlags, flag] };
};
