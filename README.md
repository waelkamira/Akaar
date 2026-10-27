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
| AK-000 | P0 | Exposed provider credentials | The public repository history contained hard-coded image-provider credentials (ImageKit, ImgBB, and Imgur). Removing them from the latest source does not revoke them or erase Git history. | Replaced hard-coded credentials with server-only environment variables, removed the multi-key Imgur manager, and added image type/size validation plus authenticated upload routes. **Owner action required:** revoke/rotate every previously committed provider key in each provider dashboard, then set the new values in deployment secrets. | Code references removed; credential rotation required |
| AK-001 | P0 | API authorization | Several user-specific/admin-style endpoints accepted caller-supplied `userId` or `isAdmin` without server-side identity checks. | Added server-session/active-account helpers; secured user management, profile, favorite, product-create, and post-delete paths. **Still open:** audit and secure every remaining private/admin route; test role and ownership boundaries. | Partially mitigated; full audit open |
| AK-002 | P1 | Prisma lifecycle | Runtime handlers had inconsistent Prisma client lifecycles and a duplicate singleton module. | Runtime API handlers now use `lib/db/prisma.js`; removed the unused duplicate `lib/prisma.js`. Clean PostgreSQL migration deployment passes in CI. Full existing-data and transaction/integration tests remain tied to AK-015. | Code standardized; integration verification pending |
| AK-003 | P1 | Cache correctness | Hashed posts/favorites cache keys could not be invalidated by matching the raw user ID prefix. The favorites GET cache-key function also referenced an undefined `page` variable instead of its `currentPage` argument, causing runtime failures. | Mutation paths clear route-local caches. Extracted `favoriteCacheKey()` into a testable helper, fixed pagination argument usage, and added deterministic/page/limit separation tests. | Cache-key regression tests and CI verified; mutation/read integration test pending |
| AK-004 | P1 | Pagination and query validation | Pagination behavior and bounds were inconsistent across product, category, posts, and favorites endpoints. | Added positive page/limit parsing and a 50-item cap in the inspected product/category/posts/favorites routes. Other endpoints and boundary tests remain. | Partially fixed; test pending |
| AK-005 | P1 | Product visibility | Public product/category reads and the bulk-category endpoint did not consistently exclude inactive items; bulk previews returned mock data instead of the real catalog. Seller-listing queries counted only visible products but fetched all seller products, exposing inactive/deleted items and making pagination totals inconsistent. | Public catalog endpoints use active/deleted predicates where inspected. Bulk previews query Prisma/PostgreSQL. Added `publicProductWhere()` and applied it to seller-listing count and result queries; added predicate regression tests. Stock/seller-status consistency and database-backed API tests remain. | Seller-listing predicate and unit tests verified in CI; DB integration pending |
| AK-006 | P1 | Route handlers | Some dynamic route handlers accessed Next.js route params synchronously. | Updated the inspected post/category dynamic handlers to await params; remaining dynamic routes and runtime requests still need review. | Partially fixed; test pending |
| AK-007 | P1 | Mutation safety | Several APIs parsed JSON outside validation/error handling and returned inconsistent errors. | Added boundary JSON validation to the rewritten user-management/profile APIs and favorite mutations, plus product-create validation. Remaining mutation routes still require the same review and malformed-input tests. | Partially fixed; test pending |
| AK-008 | P1 | Automated testing | No repeatable automated test suite was found in the inspected package configuration. | Added Node test-runner coverage for shared API pagination/input-validation helpers and wired `npm test` into CI. Dedicated API/database/browser integration tests and a successful full workflow are still required. | Unit tests added; CI verification pending |
| AK-009 | P1 | Database/migrations | The README previously stated migration history was absent, but the repository contains `prisma/migrations/20250916162448_init/migration.sql`. The schema, migration, and production database state still need a consistency check. | Correct docs (done in this file), validate Prisma schema, compare migration state against a database, and use reviewed migrations for future changes. | Documentation corrected; DB verification pending |
| AK-010 | P2 | Architecture/maintainability | The homepage previously contained a very large legacy/commented implementation and hard-coded demo products. | Rebuilt the homepage around the live product API, real categories, loading/error/empty states, and working cart/favorites actions. Removed the old homepage implementation. Other large pages/components still need incremental extraction. | Partially fixed |
| AK-011 | P2 | Global layout | Global navigation and homepage-level header/hero composition overlapped, producing duplicate navigation and promotional content on inner routes. | Consolidated the shared header and moved the hero to the homepage only. Route-by-route visual/accessibility checks and responsive browser testing remain. | Partially fixed; browser verification pending |
| AK-012 | P2 | Search and filters | Category navigation used a legacy path format that the search context did not parse. Dynamic filter loading currently relies on Arabic display names matching Arabic module filenames, which is fragile for future localization. | Category links now use canonical `/search?categoryId=...` URLs and legacy paths redirect to that format. Search/suggestion visibility checks were corrected. Stable category-key-to-filter-module mapping, full filter-combination coverage, relevance, and performance integration tests remain. | Partially fixed; integration tests pending |
| AK-013 | P2 | Configuration/operations | The project uses optional integrations and environment-dependent services. | Added a repeatable CI workflow. Install, Prisma validate/generate, unit tests, ESLint, and production build passed on the latest recorded green run; database-backed and external-provider integration checks still require configured services/credentials. | CI green; integration verification pending |
| AK-014 | P1 | Real checkout, currency, and global commerce | The cart checkout is explicitly a local demo; it clears browser cart state but does not persist an order or process payment. Product/order prices are integers without a stored ISO currency code, and taxes, regional shipping rules, and payment-provider integration are not complete. | Added a read-only authenticated order-history API/page, but do not represent the checkout as a real purchase. Before launch, define currencies and money representation, shipping/tax rules, order state transitions, inventory reservation, payment provider, webhook verification, idempotency, refunds, and integration tests. | Open — production launch blocker |
| AK-015 | P1 | Prisma migration drift | Static comparison of the committed initial migration with `schema.prisma` found missing tables (`Seller`, `GuestSession`, `Cart`, `CartItem`, `OrderItem`, token tables), missing scalar columns, a `Category.id` type mismatch, and a legacy `ProductImage` shape (`image1`–`image5` instead of `url`/`sortOrder`). `prisma validate` alone cannot detect this drift. | Added a clean PostgreSQL CI service and a schema-diff artifact step. Review the generated diff, write a data-preserving follow-up migration, and require `migrate deploy` plus schema-diff verification before closing this issue. Do not apply a guessed migration to production. | Confirmed; migration remediation pending |

## Ordered remediation plan

1. **Security first:** rotate all previously committed image-provider credentials (AK-000), inventory API routes, establish a shared session/role authorization policy, and close AK-001 before exposing administrative mutations.
2. **Database lifecycle:** standardize Prisma access and remove per-request disconnects (AK-002).
3. **Correctness:** fix cache invalidation, route params, validation, pagination, and consistent product visibility (AK-003 through AK-007).
4. **Database safety:** resolve migration drift with a generated/reviewed data-preserving migration (AK-015), then run clean-database and existing-data migration checks.
5. **Regression safety:** add tests and run the available checks (AK-008 and AK-013).
6. **Data layer:** validate schema/migration compatibility and document database-dependent results (AK-009).
7. **Search system:** unify the search contract and verify UI/API/filter interoperability (AK-012).
8. **Architecture and design:** modularize the homepage/layout, then apply the unified luxury visual system without losing existing functionality (AK-010 and AK-011).
9. **Final regression pass:** test routes, links, buttons, responsive layouts, error/loading/empty states, and all available API/DB flows before proposing merge.

## Verification log

| Date | Scope | Command / method | Result |
|---|---|---|---|
| 2026-10-27 | Initial static repository inspection | GitHub source/tree review | Initial findings recorded above. No build, lint, database, or browser test had yet been claimed as run. |
| 2026-10-27 | First CI run | GitHub Actions run `40425041806` | `npm ci`, `prisma validate`, and `prisma generate` passed. ESLint failed with 8 errors at that commit: a product-route parse error, unescaped quotes in two JSX views, nested component creation in dynamic filters, and the intentional CommonJS seed import. The product route was rebuilt; JSX/component issues were corrected; the seed import received a targeted lint directive. Follow-up CI is pending; these changes are not marked verified until a run passes. |
| 2026-10-27 | First CI pass | GitHub Actions run `40425819726` | `npm ci`, Prisma schema validation, Prisma client generation, Node unit tests, ESLint, and production build passed on commit `eb9e8e8bca08c015a026e0529f6b520be47438cf`. |
| 2026-10-27 | Seller visibility and favorites cache-key regression | GitHub Actions run `40429579234` (commit `aec8260f8ab4ac82311f85aaaf4b4ff143c68b71`) | Node unit tests, ESLint, Prisma validation/generation, clean PostgreSQL migration application, drift SQL generation, and production build passed. Added public-product visibility and favorites cache-key regression tests; database-backed route behavior and existing-data migration safety remain unverified. |
| 2026-10-27 | Public seller-listing visibility regression | Added `tests/public-product-where.test.mjs`; applied the shared visibility predicate to `/api/posts` and `/api/posts/[id]` result/count queries | Code review confirms list and count predicates now match and public reads exclude deleted/inactive products and inactive categories. Automated test and CI rerun are pending; not marked verified yet. |
