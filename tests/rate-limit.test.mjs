import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit, getRateLimitIdentity, rateLimitResponse } from '../lib/api/rate-limit.mjs';

const originalEnv = {
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  trust: process.env.TRUST_PROXY_HEADERS,
  nodeEnv: process.env.NODE_ENV,
  fetch: globalThis.fetch,
};

function restoreEnv() {
  for (const [key, value] of [
    ['UPSTASH_REDIS_REST_URL', originalEnv.url],
    ['UPSTASH_REDIS_REST_TOKEN', originalEnv.token],
    ['TRUST_PROXY_HEADERS', originalEnv.trust],
    ['NODE_ENV', originalEnv.nodeEnv],
  ]) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  globalThis.fetch = originalEnv.fetch;
}

test('uses only a validated forwarded client IP when proxy headers are explicitly trusted', () => {
  process.env.TRUST_PROXY_HEADERS = 'true';
  const request = new Request('https://example.test', {
    headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' },
  });
  assert.equal(getRateLimitIdentity(request), '203.0.113.9');
  assert.equal(getRateLimitIdentity(new Request('https://example.test', {
    headers: { 'x-forwarded-for': 'not-an-ip' },
  })), 'unknown-client');
  process.env.TRUST_PROXY_HEADERS = 'false';
  assert.equal(getRateLimitIdentity(request), 'untrusted-proxy');
  restoreEnv();
});

test('fails closed in production when the shared store is not configured', async () => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.NODE_ENV = 'production';
  const result = await checkRateLimit(new Request('https://example.test'), {
    scope: 'registration', limit: 5, windowSeconds: 900,
  });
  assert.deepEqual(result, {
    allowed: false, configured: false, status: 503, retryAfterSeconds: null,
  });
  const response = await rateLimitResponse(new Request('https://example.test'), {
    scope: 'registration', limit: 5, windowSeconds: 900,
  });
  assert.equal(response.status, 503);
  restoreEnv();
});

test('allows local development without external Redis configuration', async () => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.NODE_ENV = 'test';
  const result = await checkRateLimit(new Request('https://example.test'), {
    scope: 'registration', limit: 5, windowSeconds: 900,
  });
  assert.equal(result.allowed, true);
  assert.equal(result.configured, false);
  restoreEnv();
});

test('uses atomic Redis INCR and returns 429 with Retry-After when over limit', async () => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.test';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  process.env.TRUST_PROXY_HEADERS = 'true';
  process.env.NODE_ENV = 'test';
  let command;
  globalThis.fetch = async (_url, options) => {
    command = JSON.parse(options.body);
    return new Response(JSON.stringify({ result: [6, 127] }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  };
  const request = new Request('https://example.test', {
    headers: { 'x-forwarded-for': '203.0.113.9' },
  });
  const result = await checkRateLimit(request, { scope: 'registration', limit: 5, windowSeconds: 900 });
  assert.equal(result.allowed, false);
  assert.equal(result.status, 429);
  assert.equal(result.retryAfterSeconds, 127);
  assert.equal(command[0], 'EVAL');
  assert.equal(command[2], '1');
  const response = await rateLimitResponse(request, { scope: 'registration', limit: 5, windowSeconds: 900 });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '127');
  restoreEnv();
});

test('fails closed in production when the configured shared store is unavailable', async () => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.test';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  process.env.NODE_ENV = 'production';
  globalThis.fetch = async () => { throw new Error('network unavailable'); };
  const result = await checkRateLimit(new Request('https://example.test'), {
    scope: 'image-upload', limit: 20, windowSeconds: 3600,
  });
  assert.equal(result.allowed, false);
  assert.equal(result.status, 503);
  restoreEnv();
});
