# Critical Fixes — Phase 1

This file is a short checkpoint, not the canonical full audit. The complete issue log and ordered remediation plan live in [README.md](README.md).

## Completed and merged

- [x] Added CI execution on pushes to `main`.
- [x] Reconciled Prisma migration defaults and renamed Favorite/Review constraint and index metadata.
- [x] Replaced the raw JSONB index operator-class declaration with Prisma's `JsonbPathOps`.
- [x] Made search sorting deterministic by appending `id ASC` as a tie-breaker, including the fallback sort.
- [x] Added bounded JSON parsing and durable rate limiting for review writes.
- [x] Added PostgreSQL-backed HTTP integration tests for `POST /api/search` and `GET /api/search/suggestions`.
- [x] Added bounded JSON request parsing across the inventoried mutation routes and a global regression scan.

## Still requires environment-specific work

- [ ] Configure and verify production Upstash Redis and trusted-proxy settings for durable rate limiting.
- [ ] Configure ingress request-body limits at the hosting provider.
- [ ] Complete payment/webhook lifecycle tests against the intended provider test account.
- [ ] Complete route-level tests for rating filters, malformed payloads, pagination boundaries and rate-limit responses.
- [ ] Review the broad remote-image host policy without breaking seller-supplied image URLs.
- [ ] Verify the deployment database's actual migration status and backup/restore plan before applying migrations.

Do not mark an item complete based on code presence alone. Record the commit and passing test in [README.md](README.md).
