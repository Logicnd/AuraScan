import { createHmac } from 'crypto';
import { buildScanResult, seedFromInput } from './scanCore';

const EMPTY_SECRET = '';

function resolveSecret() {
  return (
    process.env.SCAN_SECRET ||
    process.env.ENCRYPTION_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    EMPTY_SECRET
  );
}

function seedFromSecret(input: string, secret: string) {
  const digest = createHmac('sha256', secret).update(input).digest();
  return digest.readUInt32BE(0);
}

export function runSecureScan(input: string) {
  const secret = resolveSecret();
  if (!secret) {
    return {
      mode: 'public' as const,
      result: buildScanResult(seedFromInput(input), input)
    };
  }

  return {
    mode: 'keyed' as const,
    result: buildScanResult(seedFromSecret(input, secret), input)
  };
}
