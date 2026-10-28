import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('local environment files are ignored while .env.example remains shareable', () => {
  const paths = ['.env', '.env.local', '.env.production', '.env.test', '.env.example'];
  const result = spawnSync('git', ['check-ignore', '--no-index', '--stdin'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    input: `${paths.join('\n')}\n`,
  });

  assert.equal(result.error, undefined, result.error?.message);
  assert.ok(result.status === 0 || result.status === 1, result.stderr);
  const ignored = new Set(result.stdout.split(/\r?\n/).filter(Boolean));

  for (const path of ['.env', '.env.local', '.env.production', '.env.test']) {
    assert.ok(ignored.has(path), `${path} should be ignored by Git`);
  }
  assert.ok(!ignored.has('.env.example'), '.env.example must remain trackable');
});
