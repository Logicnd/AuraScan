import { rot13, toBase64, toBinary, toHex } from './cipher';

export type ScanResult = {
  aura: string;
  threat: string;
  anomalyIndex: string;
  frequency: number;
  confidence: number;
  action: string;
  fragments: string[];
};

const auraPalette = [
  'Iridescent Cyan',
  'Crimson Haze',
  'Viridian Pulse',
  'Obsidian Glow',
  'Silver Drift',
  'Umbral Violet'
];

const threatRatings = ['Minimal', 'Low', 'Moderate', 'Elevated', 'Severe', 'Critical'];

const actions = [
  'Isolate input for 24 cycles.',
  'Cross-reference with archive sector 4.',
  'Initiate silent observation protocol.',
  'Escalate to manual review.',
  'Purge cache and re-run scan.',
  'Hold output for midnight re-evaluation.'
];

export function seedFromInput(input: string) {
  let hash = 2166136261;
  const normalized = input.toLowerCase();
  for (let i = 0; i < normalized.length; i += 1) {
    hash ^= normalized.charCodeAt(i);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, list: T[]) {
  return list[Math.floor(rng() * list.length)];
}

export function buildScanResult(seed: number, input: string): ScanResult {
  const rng = mulberry32(seed);

  const aura = pick(rng, auraPalette);
  const threat = pick(rng, threatRatings);
  const anomalyIndex = (rng() * 10).toFixed(2);
  const frequency = Math.floor(200 + rng() * 800);
  const confidence = Math.floor(62 + rng() * 37);
  const action = pick(rng, actions);

  const fragments = [
    `base64: ${toBase64(`/archive/${seed.toString(16).slice(0, 4)}`)}`,
    `rot13: ${rot13(input).slice(0, 24)}`,
    `hex: ${toHex(input).slice(0, 24)}`,
    `binary: ${toBinary(input).split(' ').slice(0, 6).join(' ')}`
  ];

  return {
    aura,
    threat,
    anomalyIndex,
    frequency,
    confidence,
    action,
    fragments
  };
}
