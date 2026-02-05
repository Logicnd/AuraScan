import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const serviceChecks = [
  {
    id: 'supabase',
    label: 'Supabase Vault',
    keys: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
  },
  {
    id: 'openai',
    label: 'Ethics Engine',
    keys: ['OPENAI_API_KEY']
  },
  {
    id: 'stripe',
    label: 'Stripe Relay',
    keys: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET']
  },
  {
    id: 'pricing',
    label: 'Pricing Matrix',
    keys: ['STRIPE_PRICE_ID_MONTHLY', 'STRIPE_PRICE_ID_YEARLY']
  },
  {
    id: 'encryption',
    label: 'Encryption Core',
    keys: ['SCAN_SECRET', 'ENCRYPTION_KEY']
  }
];

const metricLabels = ['Server Pulse', 'Signal Integrity', 'Entropy', 'Archive Sync'];

function checksumFromSecrets(secrets: Array<string | undefined>) {
  const seed = secrets.filter((secret): secret is string => Boolean(secret)).join('|') || 'aurascan';
  return createHash('sha256').update(seed).digest();
}

function percentFromByte(byte: number, min = 58, max = 96) {
  const span = max - min;
  return min + (byte % span);
}

export async function GET() {
  const secrets = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.OPENAI_API_KEY,
    process.env.STRIPE_SECRET_KEY,
    process.env.SCAN_SECRET,
    process.env.ENCRYPTION_KEY
  ];

  const digest = checksumFromSecrets(secrets);
  const metrics = metricLabels.map((label, index) => {
    const value = percentFromByte(digest[index]);
    return {
      label,
      value,
      checksum: `${digest[index].toString(16)}-${label.length}`
    };
  });

  const services = serviceChecks.map((service) => {
    const configured = service.keys.every((key) => Boolean(process.env[key]));
    const present = service.keys.filter((key) => Boolean(process.env[key]));
    return {
      id: service.id,
      label: service.label,
      status: configured ? 'online' : present.length ? 'partial' : 'offline',
      coverage: `${present.length}/${service.keys.length}`
    };
  });

  return NextResponse.json({ metrics, services });
}
