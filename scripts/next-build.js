const { spawnSync } = require('child_process');

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'file:/tmp/dev.db';
  console.log('[build] DATABASE_URL missing, defaulting to file:/tmp/dev.db');
}
if (!env.NEXTAUTH_SECRET) {
  env.NEXTAUTH_SECRET = 'dev-secret';
  console.log('[build] NEXTAUTH_SECRET missing, defaulting to dev-secret');
}
delete env.__NEXT_PRIVATE_STANDALONE_CONFIG;

const result = spawnSync('next', ['build'], {
  stdio: 'inherit',
  shell: true,
  env
});

process.exit(result.status ?? 0);
