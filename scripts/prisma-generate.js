const { spawnSync } = require('child_process');

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'file:./dev.db';
  console.log('[prisma] DATABASE_URL missing, defaulting to file:./dev.db');
}

const result = spawnSync('npx', ['prisma', 'generate'], {
  stdio: 'inherit',
  shell: true,
  env,
});

process.exit(result.status ?? 0);
