# Shared API rate limiting

Registration, image-upload and public search endpoints use a shared Upstash Redis REST store. The limiter uses a Redis Lua script (`INCR` plus first-hit `EXPIRE`) so each request is counted atomically across application instances and restarts.

## Production configuration

Set these server-side environment variables in the deployment environment:

- `UPSTASH_REDIS_REST_URL`: the HTTPS REST URL of the Upstash Redis database.
- `UPSTASH_REDIS_REST_TOKEN`: a token allowed to execute Redis commands on that database.
- `TRUST_PROXY_HEADERS=true`: only when the hosting proxy removes any client-supplied forwarding headers and overwrites `X-Forwarded-For` with the actual client address.

Do not prefix these variables with `NEXT_PUBLIC_`, commit their values, or paste tokens into logs/issues. Use separate credentials for development and production.

Production fails closed with HTTP 503 if the shared store is missing, unreachable, misconfigured, proxy trust is not explicitly enabled, or a trusted client IP cannot be resolved. This prevents silently running sensitive endpoints without a durable limiter. Local development and tests bypass the limiter when the shared store is not configured. A configured store failure in non-production is logged and bypassed to keep local development usable.

If the platform does not guarantee trustworthy forwarding headers, do not set `TRUST_PROXY_HEADERS=true`; configure a trusted client-IP integration before enabling the production endpoints. When forwarding headers are trusted, the first `X-Forwarded-For` address is validated as an IP literal and hashed before being used in a Redis key.

## Current policies

| Endpoint group | Limit | Window |
| --- | ---: | --- |
| `POST /api/register` | 5 requests | 15 minutes |
| Image-upload endpoints (`/api/uploadImageToIPFS`, `/api/uploadImageToImageKit`, `/api/uploadImageToImgbb`, `/api/uploadImageToImgur`; all requests before authentication) | 20 requests shared across providers | 1 hour |
| `POST /api/search` | 60 requests | 1 minute |
| `GET /api/search/suggestions` | 120 requests | 1 minute |

A blocked request returns HTTP 429 with `Retry-After`. If the limiter cannot safely run in production, the endpoint returns HTTP 503 rather than pretending that rate limiting succeeded.

## Verification

`npm test` includes tests for proxy trust, missing configuration, atomic Redis command usage, 429 responses and fail-closed behavior when the shared store is unavailable. CI mocks the Redis REST response; a deployment smoke test against the configured Upstash database is still required before calling the production configuration verified.