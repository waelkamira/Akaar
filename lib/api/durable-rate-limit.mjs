import { createHash } from 'node:crypto';
import { isIP } from 'node:net';

const LUA_FIXED_WINDOW = [
  "local count = redis.call('INCR', KEYS[1])",
  "if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end",
  "local ttl = redis.call('PTTL', KEYS[1])",
  "return {count, ttl}",
].join('\n');

function readHeader(request, name) {
  const headers = request?.headers;
  const value = typeof headers?.get === 'function'
    ? headers.get(name)
    : headers?.[name] ?? headers?.[name.toLowerCase()];
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
}

function getClientAddress(request, env) {
  // Never trust caller-supplied forwarding headers unless the deployment owner
  // explicitly confirms that the ingress proxy overwrites/sanitizes them.
  if (env.TRUST_PROXY_HEADERS !== 'true') return null;

  // x-real-ip must be set by the trusted ingress. Avoid parsing X-Forwarded-For:
  // its leftmost value is commonly caller-controlled when proxies append to it.
  const realIp = readHeader(request, 'x-real-ip').trim();
  if (!realIp || realIp.length > 45 || isIP(realIp) === 0) return null;
  return realIp;
}

export async function consumeDurableRateLimit({
  request,
  scope,
  limit,
  windowMs,
  identity = '',
  env = process.env,
  fetchImpl = fetch,
}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(windowMs) || windowMs < 1) {
    throw new TypeError('Rate limit and window must be positive safe integers.');
  }
  if (typeof scope !== 'string' || !/^[a-z0-9:_-]{1,80}$/i.test(scope)) {
    throw new TypeError('Rate-limit scope is invalid.');
  }

  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  const production = env.NODE_ENV === 'production';
  if (!url || !token) {
    return {
      allowed: !production,
      configured: false,
      retryAfterSeconds: null,
      reason: 'missing_configuration',
    };
  }

  let endpoint;
  try {
    endpoint = new URL(url);
  } catch {
    return { allowed: !production, configured: false, retryAfterSeconds: null, reason: 'invalid_configuration' };
  }
  if (endpoint.protocol !== 'https:') {
    return { allowed: !production, configured: false, retryAfterSeconds: null, reason: 'invalid_configuration' };
  }

  const clientAddress = getClientAddress(request, env);
  if (!clientAddress) {
    return {
      allowed: !production,
      configured: true,
      retryAfterSeconds: null,
      reason: 'untrusted_client_ip',
    };
  }

  const identityHash = createHash('sha256')
    .update([scope, clientAddress, String(identity)].join(':'))
    .digest('hex')
    .slice(0, 40);
  const key = `akaar:rate:${scope}:${identityHash}`;

  try {
    const response = await fetchImpl(endpoint.toString().replace(/\/$/, ''), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['EVAL', LUA_FIXED_WINDOW, '1', key, String(windowMs)]),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Rate-limit store returned HTTP ${response.status}`);
    const payload = await response.json();
    if (payload?.error || !Array.isArray(payload?.result) || payload.result.length < 2) {
      throw new Error('Rate-limit store returned an invalid response');
    }

    const count = Number(payload.result[0]);
    const ttlMs = Number(payload.result[1]);
    if (!Number.isSafeInteger(count) || !Number.isFinite(ttlMs) || ttlMs < 0) {
      throw new Error('Rate-limit store returned invalid counter values');
    }

    return {
      allowed: count <= limit,
      configured: true,
      retryAfterSeconds: count > limit ? Math.max(1, Math.ceil(ttlMs / 1000)) : null,
      remaining: Math.max(0, limit - count),
    };
  } catch {
    // In production, sensitive operations fail closed if the shared limiter is unavailable.
    return {
      allowed: !production,
      configured: true,
      retryAfterSeconds: null,
      reason: 'store_unavailable',
    };
  }
}
