import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeDurableRateLimit } from '../lib/api/durable-rate-limit.mjs';

const request = (headers = {}) => ({
  headers: { get: (name) => headers[name.toLowerCase()] ?? null },
});
const configuredEnv = {
  NODE_ENV: 'production',
  UPSTASH_REDIS_REST_URL: 'https://redis.example.test',
  UPSTASH_REDIS_REST_TOKEN: 'test-token',
  TRUST_PROXY_HEADERS: 'true',
};

test('allows a request below the configured fixed-window limit', async () => {
  const result = await consumeDurableRateLimit({
    request: request({ 'x-real-ip': '192.0.2.1' }),
    scope: 'register',
    limit: 5,
    windowMs: 60_000,
    env: configuredEnv,
    fetchImpl: async (_url, options) => {
      assert.equal(options.method, 'POST');
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      const command = JSON.parse(options.body);
      assert.equal(command[0], 'EVAL');
      assert.equal(command[2], '1');
      assert.equal(command[4], '60000');
      return { ok: true, json: async () => ({ result: [3, 42_000] }) };
    },
  });
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 2);
  assert.equal(result.configured, true);
});

test('blocks requests over the limit and returns a retry delay', async () => {
  const result = await consumeDurableRateLimit({
    request: request({ 'x-real-ip': '198.51.100.4', 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }),
    scope: 'register',
    limit: 5,
    windowMs: 60_000,
    env: configuredEnv,
    fetchImpl: async () => ({ ok: true, json: async () => ({ result: [6, 12_100] }) }),
  });
  assert.equal(result.allowed, false);
  assert.equal(result.retryAfterSeconds, 13);
});

test('fails closed in production when the shared store is not configured', async () => {
  const result = await consumeDurableRateLimit({
    request: request(),
    scope: 'register',
    limit: 5,
    windowMs: 60_000,
    env: { NODE_ENV: 'production' },
  });
  assert.equal(result.allowed, false);
  assert.equal(result.configured, false);
});

test('fails closed in production when the shared store errors', async () => {
  const result = await consumeDurableRateLimit({
    request: request(),
    scope: 'upload',
    limit: 20,
    windowMs: 60_000,
    env: configuredEnv,
    fetchImpl: async () => { throw new Error('offline'); },
  });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'store_unavailable');
});

test('fails open only in non-production when configuration is missing', async () => {
  const result = await consumeDurableRateLimit({
    request: request(),
    scope: 'register',
    limit: 5,
    windowMs: 60_000,
    env: { NODE_ENV: 'development' },
  });
  assert.equal(result.allowed, true);
  assert.equal(result.configured, false);
});

test('rejects invalid policy configuration', async () => {
  await assert.rejects(
    consumeDurableRateLimit({
      request: request(),
      scope: 'bad scope',
      limit: 5,
      windowMs: 60_000,
      env: configuredEnv,
    }),
    /scope is invalid/,
  );
});

test('supports plain Node/NextAuth request headers', async () => {
  const result = await consumeDurableRateLimit({
    request: { headers: { 'x-real-ip': '203.0.113.9' } },
    scope: 'login-ip',
    limit: 20,
    windowMs: 900_000,
    env: configuredEnv,
    fetchImpl: async (_url, options) => {
      const command = JSON.parse(options.body);
      assert.match(command[3], /^akaar:rate:login-ip:/);
      return { ok: true, json: async () => ({ result: [1, 800_000] }) };
    },
  });
  assert.equal(result.allowed, true);
});

test('fails closed in production unless trusted proxy headers are explicitly enabled', async () => {
  const result = await consumeDurableRateLimit({
    request: request({ 'x-real-ip': '192.0.2.1' }),
    scope: 'register',
    limit: 5,
    windowMs: 60_000,
    env: { ...configuredEnv, TRUST_PROXY_HEADERS: 'false' },
    fetchImpl: async () => { throw new Error('must not call store without trusted IP configuration'); },
  });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'untrusted_client_ip');
});

test('fails closed for missing or malformed trusted client IPs', async () => {
  for (const headers of [{}, { 'x-real-ip': 'not-an-ip' }, { 'x-real-ip': '203.0.113.1, 198.51.100.1' }]) {
    const result = await consumeDurableRateLimit({
      request: request(headers),
      scope: 'register',
      limit: 5,
      windowMs: 60_000,
      env: configuredEnv,
      fetchImpl: async () => { throw new Error('must not call store without a valid IP'); },
    });
    assert.equal(result.allowed, false);
    assert.equal(result.reason, 'untrusted_client_ip');
  }
});

test('does not use X-Forwarded-For as a client identity', async () => {
  const result = await consumeDurableRateLimit({
    request: request({ 'x-forwarded-for': '198.51.100.4, 10.0.0.1' }),
    scope: 'register',
    limit: 5,
    windowMs: 60_000,
    env: configuredEnv,
    fetchImpl: async () => { throw new Error('X-Forwarded-For alone must not be trusted'); },
  });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'untrusted_client_ip');
});
