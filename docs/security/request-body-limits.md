# API JSON request-body limits

Status: implemented for JSON request bodies handled by Next.js API route handlers.

## Policy

Mutation endpoints must use the shared `readJsonBody(request, maxBytes)` helper rather than calling `request.json()` directly. The helper reads the stream incrementally, stops once the configured byte limit is exceeded, rejects malformed JSON and invalid UTF-8, and returns HTTP 413 for oversized requests.

| Limit | Routes / payload class |
|---:|---|
| 16 KiB | Review submissions, seller inventory updates, seller order status updates, admin marketplace settings and approval actions, admin user create/update actions, seller applications, messages, booking requests |
| 32 KiB | Seller store profile updates and admin store create/update actions |
| 64 KiB | Property create/update payloads and admin bulk-message recipient lists |

These are byte limits, not character limits. Endpoints that accept uploads must continue using their dedicated multipart/upload-size validators rather than this JSON helper.

## Regression protection

- `tests/read-json-body.test.mjs` covers valid JSON, malformed JSON, invalid UTF-8, absent bodies, invalid limits and oversized payloads.
- `tests/mutation-body-limits.test.mjs` checks configured limits for the known mutation routes and scans every `app/api/**/route.{js,ts}` file to reject direct `request.json()` usage.

## Deployment requirements

Configure request-size limits at the hosting ingress as a second layer of protection. Keep endpoint-specific validation (Zod schemas, field length checks, ownership checks and authorization) even when the body size is bounded; a size limit does not validate business logic.
