import test from 'node:test';
import assert from 'node:assert/strict';
import { enforceRateLimit } from '../lib/api/durable-rate-limit.mjs';

const request = (headers = {}) => new Request('https://example.test/api', { headers });
const configuredEnv = {
  NODE_ENV: 'production',
  UPSTASH_REDIS_REST_URL: 'https://redis.example.test',
  UPSTASH_REDIS_REST_TOKEN: 'test-token',
};

test('skips only in development when the shared store is not configured', async () => {
  assert.deepEqual(
    await enforceRateLimit(request({ 'x-real-ip': '203.0.113.2' }), {
      namespace: 'register', limit: 5, windowSeconds: 900, env: { NODE_ENV: 'development' },
    }),
    { allowed: true, skipped: true, reason: 'rate_limit_not_configured' },
  );
});

test('fails closed in production when the shared store is not configured', async () => {
  const result = await enforceRateLimit(request({ 'x-real-ip': '203.0.113.2' }), {
    namespace: 'register', limit: 5, windowSeconds: 900, env: { NODE_ENV: 'production' },
  });
  assert.equal(result.allowed, false);
  assert.equal(result.status, 503);
});

test('fails closed in production when the client address is unavailable', async () => {
  const result = await enforceRateLimit(request(), {
    namespace: 'register', limit: 5, windowSeconds: 900, env: configuredEnv,
  });
  assert.equal(result.allowed, false);
  assert.equal(result.status, 503);
});

test('allows requests under the configured threshold and sends an atomic Redis script', async () => {
  let sent;
  const result = await enforceRateLimit(request({ 'x-real-ip': '203.0.113.2' }), {
    namespace: 'register', limit: 5, windowSeconds: 900, env: configuredEnv,
    fetchImpl: async (url, options) => {
      sent = { url, options };
      return { ok: true, json: async () => ({ result: [3, 700] }) };
    },
  });
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 2);
  assert.equal(sent.url, 'https://redis.example.test/');
  assert.equal(sent.options.headers.Authorization, 'Bearer test-token');
  const command = JSON.parse(sent.options.body);
  assert.equal(command[0], 'EVAL');
  assert.equal(command[2], '1');
  assert.equal(command[4], '5');
  assert.equal(command[5], '900');
});

test('returns 429 and Retry-After when the limit is exceeded', async () => {
  const result = await enforceRateLimit(request({ 'x-real-ip': '203.0.113.2' }), {
    namespace: 'upload', limit: 20, windowSeconds: 3600, env: configuredEnv,
    fetchImpl: async () => ({ ok: true, json: async () => ({ result: [21, 125] }) }),
  });
  assert.deepEqual(result, { allowed: false, status: 429, retryAfter: 125 });
});

test('fails closed in production when the shared store request fails', async () => {
  const result = await enforceRateLimit(request({ 'x-real-ip': '203.0.113.2' }), {
    namespace: 'register', limit: 5, windowSeconds: 900, env: configuredEnv,
    fetchImpl: async () => { throw new Error('network unavailable'); },
  });
  assert.equal(result.allowed, false);
  assert.equal(result.status, 503);
});

test('rejects invalid limiter policies', async () => {
  await assert.rejects(
    enforceRateLimit(request(), { namespace: '../bad', limit: 5, windowSeconds: 900 }),
    TypeError,
  );
});
