import { createHash } from 'node:crypto';

const RATE_LIMIT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[2]))
end
local ttl = redis.call('TTL', KEYS[1])
return { count, ttl }
`;

function getClientAddress(request) {
  const direct = request?.headers?.get?.('x-real-ip') ||
    request?.headers?.get?.('cf-connecting-ip');
  if (typeof direct === 'string' && direct.trim()) return direct.trim();

  // Only trust X-Forwarded-For when the deployment's reverse proxy overwrites
  // or sanitizes this header before the request reaches the application.
  const forwarded = request?.headers?.get?.('x-forwarded-for');
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return null;
}

function makeKey(namespace, identity) {
  const digest = createHash('sha256').update(identity).digest('hex');
  return `akaar:rate-limit:${namespace}:${digest}`;
}

export async function enforceRateLimit(
  request,
  { namespace, limit, windowSeconds, env = process.env, fetchImpl = fetch } = {},
) {
  if (!/^[a-z0-9-]{1,64}$/.test(namespace || '') ||
      !Number.isSafeInteger(limit) || limit < 1 ||
      !Number.isSafeInteger(windowSeconds) || windowSeconds < 1) {
    throw new TypeError('Invalid rate-limit policy');
  }

  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  const production = env.NODE_ENV === 'production';

  if (!url || !token) {
    return production
      ? { allowed: false, status: 503, reason: 'rate_limit_not_configured' }
      : { allowed: true, skipped: true, reason: 'rate_limit_not_configured' };
  }

  const address = getClientAddress(request);
  if (!address) {
    return production
      ? { allowed: false, status: 503, reason: 'client_address_unavailable' }
      : { allowed: true, skipped: true, reason: 'client_address_unavailable' };
  }

  try {
    const response = await fetchImpl(`${url.replace(/\/+$/, '')}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        'EVAL',
        RATE_LIMIT_SCRIPT,
        '1',
        makeKey(namespace, address),
        String(limit),
        String(windowSeconds),
      ]),
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });

    if (!response.ok) throw new Error(`Rate-limit store returned ${response.status}`);
    const payload = await response.json();
    const result = payload?.result;
    if (!Array.isArray(result) || !Number.isSafeInteger(result[0]) ||
        !Number.isSafeInteger(result[1])) {
      throw new Error('Rate-limit store returned an invalid result');
    }

    if (result[0] <= limit) return { allowed: true, remaining: limit - result[0] };
    return { allowed: false, status: 429, retryAfter: Math.max(1, result[1]) };
  } catch {
    // Fail closed in production: bypassing the limiter on a store/network error
    // would turn a dependency outage into an unthrottled sensitive endpoint.
    return production
      ? { allowed: false, status: 503, reason: 'rate_limit_store_unavailable' }
      : { allowed: true, skipped: true, reason: 'rate_limit_store_unavailable' };
  }
}
