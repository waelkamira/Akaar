import { spawnSync } from 'node:child_process';

const DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:55432/akaar_test?schema=public';
const COMPOSE_ARGS = ['compose', '-f', 'docker-compose.test.yml'];
const command = process.argv[2] || 'help';
const isWindows = process.platform === 'win32';

function run(program, args, options = {}) {
  const result = spawnSync(program, args, {
    stdio: 'inherit',
    ...options,
    env: { ...process.env, ...(options.env || {}) },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function docker(args) {
  run('docker', [...COMPOSE_ARGS, ...args]);
}

function waitUntilReady() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const result = spawnSync('docker', [...COMPOSE_ARGS, 'exec', '-T', 'postgres', 'pg_isready', '-U', 'postgres', '-d', 'akaar_test'], { encoding: 'utf8' });
    if (result.status === 0) return;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
  }
  throw new Error('PostgreSQL test container did not become ready within 60 seconds.');
}

function npm(args, extraEnv = {}) {
  run(isWindows ? 'npm.cmd' : 'npm', args, { env: { DATABASE_URL, ...extraEnv }, shell: isWindows });
}

switch (command) {
  case 'start':
    docker(['up', '-d', 'postgres']);
    waitUntilReady();
    console.log('Local test PostgreSQL is ready on 127.0.0.1:55432/akaar_test.');
    break;
  case 'setup':
    waitUntilReady();
    npm(['exec', '--', 'prisma', 'db', 'push', '--schema=prisma/schema.prisma']);
    npm(['exec', '--', 'node', 'prisma/seed.js']);
    console.log('Test database schema and category seed are ready.');
    break;
  case 'test':
    waitUntilReady();
    run(process.execPath, ['--test', 'tests/search-database.integration.test.mjs'], {
      env: { DATABASE_URL, SEARCH_DB_INTEGRATION: '1' },
    });
    break;
  case 'reset':
    console.warn('Resetting the isolated local test database and deleting its Docker volume.');
    docker(['down', '-v']);
    docker(['up', '-d', 'postgres']);
    waitUntilReady();
    npm(['exec', '--', 'prisma', 'db', 'push', '--schema=prisma/schema.prisma']);
    npm(['exec', '--', 'node', 'prisma/seed.js']);
    console.log('Local test database has been recreated from prisma/schema.prisma.');
    break;
  case 'stop':
    docker(['down']);
    break;
  case 'help':
  default:
    console.log('Usage: node scripts/prisma-test-db.mjs <start|setup|test|reset|stop>');
    console.log('setup expects the local container to be running; reset deletes only the named local test volume.');
    if (command !== 'help') process.exitCode = 2;
}
