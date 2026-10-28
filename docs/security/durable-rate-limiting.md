# Durable API rate limiting

Sensitive public and authenticated endpoints use the shared Redis REST rate limiter in `lib/api/durable-rate-limit.mjs`.

## Production setup

1. Create a Redis database with Upstash Redis and enable its REST API.
2. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in the deployment's server-side environment settings. Never prefix these variables with `NEXT_PUBLIC_` or commit their values.
3. Ensure the platform or trusted reverse proxy sets `x-real-ip` or `cf-connecting-ip`. If relying on `x-forwarded-for`, configure the proxy to overwrite or sanitize it; the application uses its first address.
4. Deploy and test the endpoint responses with the configured environment. Do not consider rate limiting operational until this is verified in the target hosting environment.

## Current policies

- Registration: 5 attempts per client IP per 15-minute fixed window.
- Image upload endpoints (Pinata/IPFS, ImageKit, ImgBB, and Imgur): 20 attempts per client IP per 1-hour fixed window, shared across providers.

The counter increment and expiry are executed by one Redis Lua script, avoiding a race between increment and expiry. IP addresses are SHA-256 hashed in Redis keys. Requests above the limit receive HTTP 429 with `Retry-After`. In production, missing Redis configuration, missing client IP, invalid store responses, and store/network failures fail closed with HTTP 503. In non-production environments, the limiter is skipped when it cannot be configured or reached, to keep local development usable.

This limiter is not a substitute for provider-level upload quotas, request-body limits, authentication, or platform-level abuse protection. Validate that your reverse proxy sanitizes client-IP headers; otherwise an attacker may spoof `x-forwarded-for`.
