# Akaar

Akaar is an Arabic RTL marketplace built with Next.js, Prisma, and PostgreSQL.

## Development

Requirements: Node.js 20.9 or newer.

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and configure the required server-side values.
3. For a new database, review the Prisma schema and migration history before applying it.
4. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Validation commands

- `npm run lint` — ESLint.
- `npx prisma validate` — validate Prisma schema (requires compatible Prisma configuration).
- `npx prisma generate` — generate the Prisma client.
- `npx prisma migrate status` — inspect migration state (requires a reachable database).
- `npm run build` — production build (requires applicable environment variables).
- `npm test` — not configured yet; automated test coverage is a tracked issue.

Do not apply schema changes to production without a backup and a reviewed migration. Never expose server secrets through `NEXT_PUBLIC_*` variables.

## Commerce/demo behavior

The local demo catalog and browser-persisted cart/favorites are for exploration only. The current demo checkout does not create a persisted order, charge a payment method, or confirm a real purchase. Do not present this flow as production checkout until order persistence, inventory reservation, payment-provider integration, idempotency, and order confirmation have been implemented and tested.

---

# Global audit and remediation ledger

**Audit branch:** `refactor/global-commerce-audit`  
**Base branch:** `main`  
**Status:** In progress. This ledger is updated as issues are confirmed, fixed, and tested. Static inspection is not a substitute for running the app and integration tests.

## Rules for closing an issue

An issue may be marked **Verified fixed** only after the relevant code change is reviewed and the applicable automated or manual test has actually passed. If a test cannot run because the database, credentials, or deployment environment is unavailable, record it as **Code changed — runtime verification blocked**, not as verified. Work proceeds in priority order.

## Confirmed findings from the initial repository inspection

| ID | Priority | Area | Finding / risk | Remediation and verification | Status |
|---|---|---|---|---|---|
| AK-001 | P0 | API authorization | Several user-specific/admin-style endpoints accept a caller-supplied `userId` or `isAdmin` query parameter instead of consistently deriving identity and permissions from the authenticated server session. This can permit user impersonation or unauthorized data changes if the route is reachable as written. | Audit every private route; enforce server-side session and role checks; test unauthenticated, wrong-owner, customer, seller, and admin requests. | Open |
| AK-002 | P1 | Prisma lifecycle | Multiple route handlers instantiate their own `PrismaClient`; some also call `$disconnect()` at the end of every request. This duplicates connection management and can destabilize serverless/concurrent traffic. | Standardize all handlers on the shared Prisma singleton; remove per-request disconnects; validate generation and run DB-backed smoke tests. | Open |
| AK-003 | P1 | Cache correctness | Cache invalidation helpers build keys that do not match the cache-key format used when inserting entries in the favorites/posts APIs. Stale records may survive mutations. | Replace cache keys/invalidation with a consistent strategy; test create/update/delete followed by reads. | Open |
| AK-004 | P1 | Pagination and query validation | Pagination behavior is inconsistent across APIs (zero- vs one-based pages); some routes parse limits without enforcing a safe upper bound or positive integer range. Negative/large values can cause incorrect results or expensive queries. | Standardize page/limit parsing, cap limits, return stable pagination metadata, and test invalid/boundary inputs. | Open |
| AK-005 | P1 | Product visibility | Product/category/post endpoints do not consistently apply the same public visibility rules (`isDeleted`, `isActive`, inventory/stock, and seller status) across count and list queries. | Define a shared visibility policy and apply it consistently to all public reads, counts, suggestions, category pages, and search. | Open |
| AK-006 | P1 | Route handlers | In `app/api/posts/[id]/route.js`, the GET handler awaits `params`, but DELETE reads `params` synchronously. Current Next.js route-handler params are asynchronous; this path requires correction and testing. | Await params in every affected dynamic API handler and test GET/DELETE against a real route request. | Open |
| AK-007 | P1 | Mutation safety | Several API handlers parse request JSON or access identifiers outside their main error-handling/validation path; malformed payloads may produce unstructured failures. | Validate request bodies and query parameters at the boundary; return consistent typed 4xx responses; test malformed JSON and missing/invalid fields. | Open |
| AK-008 | P1 | Automated testing | `package.json` has no test script or visible automated unit/integration test suite. Core flows cannot currently be verified through a repeatable test command. | Add a test strategy and regression tests for auth, search/filter combinations, favorites, product mutations, cart/checkout, APIs, and Prisma behavior. | Open |
| AK-009 | P1 | Database/migrations | The README previously stated migration history was absent, but the repository contains `prisma/migrations/20250916162448_init/migration.sql`. The schema, migration, and production database state still need a consistency check. | Correct docs (done in this file), validate Prisma schema, compare migration state against a database, and use reviewed migrations for future changes. | Documentation corrected; DB verification pending |
| AK-010 | P2 | Architecture/maintainability | The homepage file `app/(shop)/page.js` is exceptionally large and includes substantial legacy/commented implementation; a backup copy is committed as `page.js.backup`. This increases review burden and makes regressions harder to isolate. | Extract reusable, tested sections/components incrementally; remove dead code only after behavior parity is confirmed. | Open |
| AK-011 | P2 | Global layout | `app/layout.js` composes global navigation and the main layout while the homepage also contains its own header/hero elements. Potential duplication and inconsistent spacing require route-by-route verification. | Define one shared shell and explicit page-level composition; inspect desktop/mobile on home and inner routes. | Open |
| AK-012 | P2 | Search and filters | Search, suggestions, category routes, and client search context are separate implementations with duplicated legacy code. Their parameter, sorting, filter, and visibility semantics require end-to-end consistency tests. | Establish one documented query contract shared by UI and API; test query + category + dynamic fields + city + price + sort + pagination combinations. | Open |
| AK-013 | P2 | Configuration/operations | The project uses optional integrations and environment-dependent services; no repeatable CI/test result has yet been established during this audit. | Check required/optional environment variables, add CI validation where feasible, and document blocked external-service checks explicitly. | Open |

## Ordered remediation plan

1. **Security first:** inventory API routes, establish a shared session/role authorization policy, and close AK-001 before exposing administrative mutations.
2. **Database lifecycle:** standardize Prisma access and remove per-request disconnects (AK-002).
3. **Correctness:** fix cache invalidation, route params, validation, pagination, and consistent product visibility (AK-003 through AK-007).
4. **Regression safety:** add tests and run the available checks (AK-008 and AK-013).
5. **Data layer:** validate schema/migration compatibility and document database-dependent results (AK-009).
6. **Search system:** unify the search contract and verify UI/API/filter interoperability (AK-012).
7. **Architecture and design:** modularize the homepage/layout, then apply the unified luxury visual system without losing existing functionality (AK-010 and AK-011).
8. **Final regression pass:** test routes, links, buttons, responsive layouts, error/loading/empty states, and all available API/DB flows before proposing merge.

## Verification log

| Date | Scope | Command / method | Result |
|---|---|---|---|
| 2026-10-27 | Initial static repository inspection | GitHub source/tree review | Initial findings recorded above. No build, lint, database, or browser test has been claimed as run. |
