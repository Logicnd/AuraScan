const { spawnSync } = require('child_process');

const env = { ...process.env };
delete env.__NEXT_PRIVATE_STANDALONE_CONFIG;

const result = spawnSync('next', ['build'], {
  stdio: 'inherit',
  shell: true,
  env
});

process.exit(result.status ?? 0);
