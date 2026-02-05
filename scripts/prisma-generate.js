const { spawnSync } = require('child_process');

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'file:/tmp/dev.db';
  console.log('[prisma] DATABASE_URL missing, defaulting to file:/tmp/dev.db');
}
if (!env.NEXTAUTH_SECRET) {
  env.NEXTAUTH_SECRET = 'dev-secret';
}

const result = spawnSync('npx', ['prisma', 'generate'], {
  stdio: 'inherit',
  shell: true,
  env,
});

process.exit(result.status ?? 0);
