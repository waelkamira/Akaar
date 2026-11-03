import { spawnSync } from 'node:child_process';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL || '';
const postgresPattern = /postgres(?:ql)?:\/\//i;

function hasDockerEngine() {
  const result = spawnSync('docker', ['info', '--format', '{{.ServerVersion}}'], {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return !result.error && result.status === 0 && Boolean(result.stdout?.trim());
}

console.log('Checking Prisma environment...');

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not configured. Define it in .env before running Prisma or the app.');
  process.exit(1);
}

if (!postgresPattern.test(DATABASE_URL)) {
  console.error('DATABASE_URL is not a PostgreSQL connection string. Prisma schema requires PostgreSQL.');
  process.exit(1);
}

console.log('DATABASE_URL detected.');

if (!hasDockerEngine()) {
  console.warn('Docker engine is unavailable; the local Postgres test database cannot be started.');
  console.warn('A configured PostgreSQL DATABASE_URL can still be used with an independently managed database.');
} else {
  console.log('Docker engine is available for local Prisma test database setup.');
}
