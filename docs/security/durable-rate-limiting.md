# Durable API rate limiting

Status: implementation proposed in PR; requires deployment configuration before production use.

## Backend

The limiter uses Upstash Redis REST and an atomic Redis Lua fixed-window counter. Because the counter is stored in shared Redis, it is consistent across serverless instances and restarts; it does not rely on process memory.

Configure these server-side environment variables in every production deployment:

- `UPSTASH_REDIS_REST_URL`: the HTTPS REST endpoint for the Redis database.
- `UPSTASH_REDIS_REST_TOKEN`: a write-capable token for that database. Keep it server-only; never use a `NEXT_PUBLIC_` prefix or commit a real token.
- `TRUST_PROXY_HEADERS=true`: set only after verifying that the hosting ingress overwrites `x-real-ip` and does not pass through a client-supplied value. If this cannot be guaranteed, leave it unset and protected routes will fail closed in production.

The helper rejects non-HTTPS endpoints. Do not use a local or in-memory substitute in production.

## Current policies

| Scope | Routes | Limit | Window |
|---|---|---:|---:|
| `register` | `POST /api/register` | 5 | 15 minutes |
| `login-ip` | Credentials sign-in through NextAuth | 20 | 15 minutes per client address |
| `login-account` | Credentials sign-in through NextAuth | 5 | 15 minutes per client address + normalized email |
| `image-upload` | `POST /api/uploadImageToIPFS`, `/api/uploadImageToImageKit`, `/api/uploadImageToImgbb`, `/api/uploadImageToImgur` | 20 | 10 minutes per client address + authenticated user |
| `catalog-search` | `POST /api/search` | 60 | 1 minute per client address |
| `search-suggestions` | `GET /api/search/suggestions` | 120 | 1 minute per client address |

Upload limits combine the client address and authenticated user ID. Registration is limited by client address. Credentials sign-in has both an IP-wide cap and a tighter cap for each normalized email/IP pair. When a trusted client address cannot be determined, protected API routes fail closed with HTTP 503 rather than trusting caller-supplied headers or sharing an `unknown` bucket.

## Proxy and client IP requirements

The helper accepts only a syntactically valid IP address from `x-real-ip`, and only when `TRUST_PROXY_HEADERS=true`. It deliberately does not use `x-forwarded-for`, whose leftmost address may be caller-controlled when a proxy appends to that header. Set the flag only after confirming that the hosting ingress overwrites `x-real-ip`; otherwise keep it disabled. In production, a missing/invalid address or untrusted proxy configuration fails closed with HTTP 503.

## Failure behavior

- When the counter is within the limit, the request proceeds.
- When the limit is exceeded, the route returns HTTP 429 and a `Retry-After` header.
- In production, missing Redis configuration, an invalid endpoint, or a Redis/network failure fails closed. Registration, image-upload, and public search handlers return HTTP 503; credentials sign-in is denied through NextAuth's normal sign-in error flow until the shared limiter and trusted IP configuration are available.
- Outside production, missing configuration or store failure is fail-open to keep local development usable. Tests cover both behaviors.
- The limiter does not log or store raw IP addresses in its keys; the address and identity are SHA-256 hashed.

## Verification before release

1. Set the two Upstash variables in the deployment environment and verify they are available to server-side route handlers.
2. Verify proxy IP header sanitization with the actual hosting provider.
3. Test simultaneous requests from multiple instances, the exact boundary, reset after expiry, 429 `Retry-After`, 503 behavior for registration/uploads when Redis is unavailable, and denied credentials sign-in when the limiter is unavailable.
4. Monitor Redis latency/availability and set a budget appropriate for registration and uploads.
5. Confirm `TRUST_PROXY_HEADERS=true` is safe for the actual hosting ingress and that `x-real-ip` cannot be spoofed by a client.
6. Revisit policy values against expected legitimate traffic and provider upload quotas.

This implementation is not considered production-ready until the shared store and trusted client-IP configuration have been tested in the target deployment.
