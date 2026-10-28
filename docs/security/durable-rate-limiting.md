# Durable API rate limiting

Status: implementation proposed in PR; requires deployment configuration before production use.

## Backend

The limiter uses Upstash Redis REST and an atomic Redis Lua fixed-window counter. Because the counter is stored in shared Redis, it is consistent across serverless instances and restarts; it does not rely on process memory.

Configure these server-side environment variables in every production deployment:

- `UPSTASH_REDIS_REST_URL`: the HTTPS REST endpoint for the Redis database.
- `UPSTASH_REDIS_REST_TOKEN`: a write-capable token for that database. Keep it server-only; never use a `NEXT_PUBLIC_` prefix or commit a real token.

The helper rejects non-HTTPS endpoints. Do not use a local or in-memory substitute in production.

## Current policies

| Scope | Routes | Limit | Window |
|---|---|---:|---:|
| `register` | `POST /api/register` | 5 | 15 minutes |
| `login-ip` | Credentials sign-in through NextAuth | 20 | 15 minutes per client address |
| `login-account` | Credentials sign-in through NextAuth | 5 | 15 minutes per client address + normalized email |
| `image-upload` | `POST /api/uploadImageToIPFS`, `/api/uploadImageToImageKit`, `/api/uploadImageToImgbb`, `/api/uploadImageToImgur` | 20 | 10 minutes per client address + authenticated user |

Upload limits combine the client address and authenticated user ID. Registration is limited by client address. Credentials sign-in has both an IP-wide cap and a tighter cap for each normalized email/IP pair. When the address cannot be determined, requests share an `unknown` bucket rather than bypassing the limit.

## Proxy and client IP requirements

The helper reads `x-real-ip` first and otherwise the first address in `x-forwarded-for`. These headers are trustworthy only when the deployment's ingress/reverse proxy overwrites or sanitizes them. Configure the hosting proxy so clients cannot choose the value used for rate limiting. If this cannot be guaranteed, use a trusted platform-specific client-IP mechanism before deploying.

## Failure behavior

- When the counter is within the limit, the request proceeds.
- When the limit is exceeded, the route returns HTTP 429 and a `Retry-After` header.
- In production, missing Redis configuration, an invalid endpoint, or a Redis/network failure returns HTTP 503 for these sensitive routes. This is intentionally fail-closed; registration and image uploads remain unavailable until the shared limiter is configured and healthy.
- Outside production, missing configuration or store failure is fail-open to keep local development usable. Tests cover both behaviors.
- The limiter does not log or store raw IP addresses in its keys; the address and identity are SHA-256 hashed.

## Verification before release

1. Set the two Upstash variables in the deployment environment and verify they are available to server-side route handlers.
2. Verify proxy IP header sanitization with the actual hosting provider.
3. Test simultaneous requests from multiple instances, the exact boundary, reset after expiry, 429 `Retry-After`, and 503 behavior when Redis is unavailable.
4. Monitor Redis latency/availability and set a budget appropriate for registration and uploads.
5. Revisit policy values against expected legitimate traffic and provider upload quotas.

This implementation is not considered production-ready until the shared store and trusted client-IP configuration have been tested in the target deployment.
