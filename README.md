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
| AK-001 | P0 | API authorization | Several user-specific/admin-style endpoints accepted caller-supplied `userId` or `isAdmin` without server-side identity checks. | Added server-session/active-account helpers; secured user management, profile, favorite, product-create, and post-delete paths. **Still open:** audit and secure every remaining private/admin route; test role and ownership boundaries. | Partially mitigated; full audit open |
| AK-002 | P1 | Prisma lifecycle | Multiple route handlers instantiated their own `PrismaClient`; some disconnected it after every request. | Standardized the shared Prisma singleton in the inspected product, registration, auth-options, users, profile, posts, favorites, and category routes. **Still open:** repository-wide API scan, Prisma validation, and DB-backed smoke tests. | Partially fixed; verification pending |
| AK-003 | P1 | Cache correctness | Hashed posts/favorites cache keys could not be invalidated by matching the raw user ID prefix. | Mutation paths now clear the affected route-local cache instead of using the mismatched prefix. Regression test for mutation-then-read still required. | Code fixed; test pending |
| AK-004 | P1 | Pagination and query validation | Pagination behavior and bounds were inconsistent across product, category, posts, and favorites endpoints. | Added positive page/limit parsing and a 50-item cap in the inspected product/category/posts/favorites routes. Other endpoints and boundary tests remain. | Partially fixed; test pending |
| AK-005 | P1 | Product visibility | Public product/category reads did not consistently exclude inactive items. | Added `isActive: true` to the product list and category count/list paths. Search, suggestions, stock, seller status, and cross-endpoint count consistency remain to be audited. | Partially fixed; test pending |
| AK-006 | P1 | Route handlers | Some dynamic route handlers accessed Next.js route params synchronously. | Updated the inspected post/category dynamic handlers to await params; remaining dynamic routes and runtime requests still need review. | Partially fixed; test pending |
| AK-007 | P1 | Mutation safety | Several APIs parsed JSON outside validation/error handling and returned inconsistent errors. | Added boundary JSON validation to the rewritten user-management/profile APIs and favorite mutations, plus product-create validation. Remaining mutation routes still require the same review and malformed-input tests. | Partially fixed; test pending |
| AK-008 | P1 | Automated testing | No repeatable automated test suite was found in the inspected package configuration. | Added a GitHub Actions quality workflow for install, Prisma validate/generate, ESLint, and production build. Dedicated unit/integration tests and successful workflow execution are still required. | Workflow added; run pending |
| AK-009 | P1 | Database/migrations | The README previously stated migration history was absent, but the repository contains `prisma/migrations/20250916162448_init/migration.sql`. The schema, migration, and production database state still need a consistency check. | Correct docs (done in this file), validate Prisma schema, compare migration state against a database, and use reviewed migrations for future changes. | Documentation corrected; DB verification pending |
| AK-010 | P2 | Architecture/maintainability | The homepage file `app/(shop)/page.js` is exceptionally large and includes substantial legacy/commented implementation; a backup copy is committed as `page.js.backup`. | Still requires incremental extraction after functional/API contracts and regression tests are established. | Open |
| AK-011 | P2 | Global layout | Global navigation and homepage-level header/hero composition may overlap. | Still requires route-by-route UI review and responsive verification. | Open |
| AK-012 | P2 | Search and filters | Search, suggestions, category routes, and client search context remain separate implementations with legacy code and potentially inconsistent filter semantics. | Still requires a shared query contract and end-to-end tests across query, category, dynamic fields, location, price, sort, and pagination. | Open |
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
| 2026-10-27 | First remediation pass | Source-level review and GitHub branch updates | Added server-side identity/role helpers; protected selected user/profile/favorite/product/post APIs; standardized Prisma in inspected routes; fixed selected cache invalidation, pagination, and dynamic params; added CI quality workflow. These changes have **not yet been executed in a local build or database test**. |
