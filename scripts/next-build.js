const { spawnSync } = require('child_process');

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'file:./prisma/dev.db';
  console.log('[build] DATABASE_URL missing, defaulting to file:./prisma/dev.db');
}
if (!env.NEXTAUTH_SECRET) {
  env.NEXTAUTH_SECRET = 'dev-secret';
  console.log('[build] NEXTAUTH_SECRET missing, defaulting to dev-secret');
}
if (!env.NEXTAUTH_URL) {
  env.NEXTAUTH_URL = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:3000';
}
delete env.__NEXT_PRIVATE_STANDALONE_CONFIG;

const result = spawnSync('next', ['build'], {
  stdio: 'inherit',
  shell: true,
  env
});

process.exit(result.status ?? 0);
