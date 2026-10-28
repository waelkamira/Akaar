import { createHash } from 'node:crypto';
import { isIP } from 'node:net';

const DEFAULT_WINDOW_SECONDS = 900;

function configuredRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !parsed.hostname) return null;
    return { url: parsed.toString().replace(/\/$/, ''), token };
  } catch {
    return null;
  }
}

export function getRateLimitIdentity(request) {
  if (process.env.TRUST_PROXY_HEADERS !== 'true') return 'untrusted-proxy';

  const forwarded = request?.headers?.get?.('x-forwarded-for');
  if (typeof forwarded !== 'string' || forwarded.length > 512) return 'unknown-client';
  const candidate = forwarded.split(',')[0]?.trim();
  if (!candidate || !isIP(candidate)) return 'unknown-client';
  return candidate;
}

function keyFor(scope, identity) {
  const digest = createHash('sha256').update(identity).digest('hex');
  return `akaar:rate-limit:v1:${scope}:${digest}`;
}

export async function checkRateLimit(request, { scope, limit, windowSeconds = DEFAULT_WINDOW_SECONDS }) {
  if (!/^[a-z0-9:_-]{1,64}$/.test(scope || '')) {
    throw new TypeError('A valid rate-limit scope is required.');
  }
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 10000) {
    throw new TypeError('Rate-limit limit must be a positive safe integer.');
  }
  if (!Number.isSafeInteger(windowSeconds) || windowSeconds < 1 || windowSeconds > 86400) {
    throw new TypeError('Rate-limit window must be between 1 and 86400 seconds.');
  }

  const redis = configuredRedis();
  if (!redis) {
    // Local/test development remains usable. Production deliberately fails closed.
    return process.env.NODE_ENV === 'production'
      ? { allowed: false, configured: false, status: 503, retryAfterSeconds: null }
      : { allowed: true, configured: false, status: null, retryAfterSeconds: null };
  }

  const identity = getRateLimitIdentity(request);
  const key = keyFor(scope, identity);
  const script = [
    'local count = redis.call("INCR", KEYS[1])',
    'if count == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end',
    'local ttl = redis.call("TTL", KEYS[1])',
    'return {count, ttl}',
  ].join('\n');

  let response;
  try {
    response = await fetch(redis.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redis.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['EVAL', script, '1', key, String(windowSeconds)]),
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error(`Rate-limit store returned HTTP ${response.status}`);
    const payload = await response.json();
    const result = payload?.result;
    if (!Array.isArray(result) || !Number.isSafeInteger(result[0]) || !Number.isFinite(result[1])) {
      throw new Error('Rate-limit store returned an invalid response.');
    }

    const count = result[0];
    const ttl = Math.max(1, Math.min(windowSeconds, Math.trunc(result[1])));
    return {
      allowed: count <= limit,
      configured: true,
      status: count <= limit ? null : 429,
      retryAfterSeconds: count <= limit ? null : ttl,
      remaining: Math.max(0, limit - count),
    };
  } catch (error) {
    // Never silently disable a configured production limiter on store/network errors.
    console.error('Shared rate-limit check failed:', error instanceof Error ? error.message : 'unknown error');
    return process.env.NODE_ENV === 'production'
      ? { allowed: false, configured: true, status: 503, retryAfterSeconds: null }
      : { allowed: true, configured: true, status: null, retryAfterSeconds: null, degraded: true };
  }
}

export async function rateLimitResponse(request, options) {
  const result = await checkRateLimit(request, options);
  if (result.allowed) return null;

  const status = result.status || 503;
  const message = status === 429
    ? 'تم تجاوز عدد الطلبات المسموح. يرجى المحاولة لاحقًا.'
    : 'خدمة الحماية من الطلبات المتكررة غير متاحة حاليًا. يرجى المحاولة لاحقًا.';
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (result.retryAfterSeconds) headers['Retry-After'] = String(result.retryAfterSeconds);
  return new Response(JSON.stringify({ error: message }), { status, headers });
}
