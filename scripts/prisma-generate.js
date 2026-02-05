const { spawnSync } = require('child_process');

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'file:./prisma/dev.db';
  console.log('[prisma] DATABASE_URL missing, defaulting to file:./prisma/dev.db');
}
if (!env.NEXTAUTH_SECRET) {
  env.NEXTAUTH_SECRET = 'dev-secret';
}
if (!env.NEXTAUTH_URL) {
  env.NEXTAUTH_URL = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:3000';
}

const result = spawnSync('npx', ['prisma', 'generate'], {
  stdio: 'inherit',
  shell: true,
  env,
});

process.exit(result.status ?? 0);
