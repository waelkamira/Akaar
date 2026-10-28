# Akaar

Akaar is an Arabic RTL marketplace built with Next.js, Prisma, and PostgreSQL.

## Development

Requirements: Node.js 20.9 or newer.

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and configure the required server-side values.
3. For a new database, review the Prisma schema and migration history before applying it.
4. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).


## Isolated local Prisma/PostgreSQL test database

Docker and Docker Compose are required. These commands use a separate PostgreSQL 16 container, bind only to `127.0.0.1:55432`, and use the canonical `prisma/schema.prisma`. They do not read `.env.local` and never target a production database.

```sh
npm ci
npm run db:test:start
npm run db:test:setup
npm run test:search-db:local
```

- `db:test:start` starts the isolated PostgreSQL container.
- `db:test:setup` applies the current Prisma schema to that local test database and seeds the standard categories.
- `test:search-db:local` runs the PostgreSQL integration tests for search/filter combinations and pagination.
- `db:test:reset` recreates the test database from scratch and **deletes only this Compose project's named test volume**. Do not use it if you need to retain local test data.
- `db:test:stop` stops the container without deleting its volume.

The test database is disposable and uses local-only credentials. Do not expose its port publicly or reuse these credentials in staging/production. This fixture validates the current Prisma schema; it does not prove that an existing legacy production database can be migrated safely.

## Validation commands

- `npm run lint` — ESLint.
- `npx prisma validate` — validate Prisma schema (requires compatible Prisma configuration).
- `npx prisma generate` — generate the Prisma client.
- `npx prisma migrate status` — inspect migration state (requires a reachable database).
- `npm run build` — production build (requires applicable environment variables).
- `npm test` — run the Node.js unit tests in `tests/*.test.mjs` (currently covers validation, cache keys, upload validation, public-product visibility, and dynamic search-filter sanitization). API/database/browser integration coverage remains incomplete.

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
| AK-003 | P1 | Cache correctness | Hashed posts/favorites cache keys could not be invalidated by matching the raw user ID prefix. The favorites GET cache-key function also referenced an undefined `page` variable instead of its `currentPage` argument, causing runtime failures. Separate route-local caches also remained stale after cross-route product mutations. | Fixed pagination argument usage and added deterministic cache-key tests; removed caches from seller-listing and favorites reads so mutations in other route handlers are visible immediately. Product-page/category caches still have short TTLs and need realistic performance testing. | Unit regression tests and CI verified; remaining cache/performance checks open |
| AK-004 | P1 | Pagination and query validation | Pagination behavior and bounds were inconsistent across product, category, posts, favorites, admin-user, and search endpoints. `parseInt` accepted malformed values such as `12abc`, and unsafe page numbers could overflow offsets. Bulk category IDs also accepted malformed numeric prefixes. | Shared pagination parsing rejects malformed and unsafe integers and caps page sizes. Admin users, favorites, search offsets, and bulk category ID parsing now use strict numeric validation. Unit tests cover malformed, decimal, unsafe, and bounded helper inputs. Other route-specific parsing and large-offset query performance still need review. | Helper tests and prior CI verified; bulk category change pending CI; route integration pending |
| AK-005 | P1 | Product visibility | Public product/category reads and the bulk-category endpoint did not consistently exclude inactive items; bulk previews returned mock data instead of the real catalog. Seller-listing queries counted only visible products but fetched all seller products, exposing inactive/deleted items and making pagination totals inconsistent. | Public catalog endpoints use active/deleted predicates where inspected. Bulk previews query Prisma/PostgreSQL. Added `publicProductWhere()` and applied it to seller-listing count and result queries; added predicate regression tests. Stock/seller-status consistency and database-backed API tests remain. | Seller-listing predicate and unit tests verified in CI; DB integration pending |
| AK-006 | P1 | Route handlers | Some dynamic route handlers accessed Next.js route params synchronously. | Updated the inspected post/category dynamic handlers to await params; remaining dynamic routes and runtime requests still need review. | Partially fixed; test pending |
| AK-007 | P1 | Mutation safety and error handling | Several APIs parsed JSON outside validation/error handling, returned inconsistent errors, or leaked raw exception messages and complete product records to server logs. Client-side debug logs also exposed user/product identifiers and image details in the browser console. | Added JSON boundary validation to inspected mutation APIs. Seller listing routes now return generic server errors instead of raw exception messages and no longer log full listing records or caller identifiers. Removed client-side debug logs from favorite controls, seller/user display, and seller-list page. Remaining mutation routes and malformed-input/error-path tests still require review. | Partially mitigated; CI verification pending |
| AK-008 | P1 | Automated testing | The repository initially lacked a repeatable test suite for critical helper behavior. | Added Node test-runner coverage for pagination/input validation, cache keys, upload validation, public-product visibility, and dynamic search-filter sanitization; `npm test` is wired into CI. API/database/browser integration tests and end-to-end purchase flow remain open. | Unit tests and CI verified; integration coverage open |
| AK-009 | P1 | Database/migrations | The README previously stated migration history was absent, but the repository contains `prisma/migrations/20250916162448_init/migration.sql`. The schema, migration, and production database state still need a consistency check. | Correct docs (done in this file), validate Prisma schema, compare migration state against a database, and use reviewed migrations for future changes. | Documentation corrected; DB verification pending |
| AK-010 | P2 | Architecture/maintainability | The homepage and several shared/page components contained large legacy/commented implementations; an obsolete 122 KB homepage backup was tracked in the application tree. | Rebuilt the active homepage around live product API/categories and working cart/favorites; removed legacy blocks from search context, filters, product card, category navigation, cart, product detail, seller listing, profile, and favorites; deleted the obsolete homepage backup. Other components still need incremental extraction and architectural tests. | Legacy blocks removed; CI verification pending for latest cleanup |
| AK-011 | P2 | Global layout | Global navigation and homepage-level header/hero composition overlapped, producing duplicate navigation and promotional content on inner routes. | Consolidated the shared header and moved the hero to the homepage only. Route-by-route visual/accessibility checks and responsive browser testing remain. | Partially fixed; browser verification pending |
| AK-012 | P2 | Search and filters | Category objects used mismatched legacy IDs; two category-navigation components generated malformed or inconsistent URLs and invoked search before React state settled; removing the category chip left the URL category active. Dynamic filter objects could also create oversized query predicates. | All 22 category paths and both category-navigation components now use canonical `/search?categoryId=<id>` URLs, preserve active search terms, and rely on URL/state synchronization. Removing a category also removes `categoryId` from the URL. `sanitizeDetailsFilters()` bounds dynamic filters to 30 primitive values, valid keys, and 200-character values. Stable category-key mapping, full filter-combination tests, relevance, and performance tests remain. | Code changed; CI and browser/search integration verification pending |
| AK-013 | P2 | Configuration/operations | The project uses optional integrations and environment-dependent services. | Added a repeatable CI workflow. Install, Prisma validate/generate, unit tests, ESLint, and production build passed on the latest recorded green run; database-backed and external-provider integration checks still require configured services/credentials. | CI green; integration verification pending |
| AK-014 | P1 | Real checkout, currency, and global commerce | The cart checkout is explicitly a local demo; it does not persist an order or process payment. Product/order prices are integers without a stored ISO currency code, and taxes, regional shipping rules, and payment-provider integration are incomplete. Search UI also previously hard-coded Saudi riyals regardless of product currency. | Removed the misleading Saudi-riyal label from search filters. Added a read-only authenticated order-history API/page, but do not represent checkout as a real purchase. Production launch still requires currency-aware money storage, tax/shipping rules, order transitions, inventory reservation, payment provider, verified webhooks, idempotency, refunds, and integration tests. | UI label fixed; production checkout remains blocked |
| AK-015 | P1 | Prisma migration drift | Static comparison of the committed initial migration with `schema.prisma` found missing tables (`Seller`, `GuestSession`, `Cart`, `CartItem`, `OrderItem`, token tables), missing scalar columns, a `Category.id` type mismatch, and a legacy `ProductImage` shape (`image1`–`image5` instead of `url`/`sortOrder`). `prisma validate` alone cannot detect this drift. The generated drift SQL contains destructive operations: it drops the five legacy `ProductImage.image*` columns, adds `url TEXT NOT NULL` without a data backfill, drops/recreates the `Category` primary key around an ID type change, and adds required fields such as `Category.slug` and `updatedAt` without a demonstrated existing-row backfill. | Retrieved and inspected the CI `prisma-schema-drift` artifact from run `40443286398`. Treat this SQL as a diagnostic diff only, **not** as a deployable migration. Map existing image columns into the new image representation, plan a collision-safe Category ID conversion and slug backfill, fill required timestamps, preserve all foreign keys/data, then test a reviewed migration on both a clean DB and representative existing-data copy. Never apply this generated diff directly to production. | Confirmed high-risk drift; safe migration design pending |
| AK-016 | P1 | Product deep links | Product detail pages previously depended on a product object in browser `localStorage` or the demo catalog, so opening a real product URL directly in a fresh browser could show a false not-found state. | Product detail page now fetches the real product by ID from `/api/showPostById`, handles aborts, and uses matching local cache only as a fallback if the API is unavailable. CI passed in run `40435193574`; browser deep-link testing remains open. | Code and CI verified; browser verification open |
| AK-017 | P1 | Favorites UI state | Favorite controls relied on stale local user data or local-only state, and the favorites page started at page 0 while the API defaults invalid pages to page 1, causing duplicate first-page results. The real-product detail heart only toggled React state without saving to the API. | Favorite button and favorites page use NextAuth session identity; cached IDs are arrays refreshed from the server; login normalizes the `productIds` response; favorites pagination is one-based; product detail loads current favorite state and toggles via `/api/favorite` with optimistic rollback on error. Favorites GET no longer uses a route-local cache. CI passed in run `40435193574`; browser testing remains open. | Code and CI verified; browser verification open |
| AK-018 | P1 | Search input bounds | Scalar search filters and sort keys could accept arbitrary-length or non-string values before being used in Prisma query construction. | Added `sanitizeSearchText()` with a 120-character default bound and a 32-character sort-key bound; applied it to category, city, town, ad type, seller ID, brand, and subcategory inputs. Added unit tests. CI passed in run `40435613573`; realistic-data query performance and browser filter combinations remain open. | Code and CI verified; integration/performance open |
| AK-019 | P1 | Google account linking | Google sign-in previously enabled dangerous email account linking and could attach a Google subject to an existing account without requiring a verified email. | Removed the dangerous linking option; added verified-email and normalized-identity validation; reject a conflicting Google subject; added unit tests. CI passed in run `40435193574`. Provider configuration and live OAuth flow still need deployment/browser verification. | Code and CI verified; live OAuth verification open |

| AK-020 | P1 | Image MIME spoofing | Upload handlers previously trusted the client-provided MIME type and size; a non-image payload could claim an allowed image type. | Added signature checks for JPEG, PNG, WebP, and AVIF and applied them to ImageKit, Pinata/IPFS, ImgBB, and Imgur routes. Tests cover valid signatures and spoofed/truncated payloads. CI passed in run `40436160208`; decoder/re-encoding and malware scanning remain open. | Code and CI verified; deeper content scanning open |
| AK-021 | P1 | Oversized multipart requests and Vercel body limit | Upload handlers parsed multipart bodies before checking file size, and the 5 MiB file cap plus multipart overhead could exceed Vercel Functions' documented 4.5 MB request-body limit. | PR #19 reduced the file cap to 4 MiB and the full request cap to 4.25 MiB. GitHub Actions run `40477078826` passed on exact head `ff6ca67f6e14dc5bd0dd4b0fc819f5d507dbd4a2`, including unit tests, lint, Prisma/clean-migration checks, and production build; PR #19 merged as `686c03890c6a28e240a83eefd44a6a51c63a9ee9`. Requests without `Content-Length` still require hosting/runtime limits and post-parse validation. | Merged; CI passed; upstream body limit still required |

| AK-022 | P1 | Cross-route cache consistency | Seller listing and favorites routes used separate in-memory caches that mutations in other route handlers could not reliably invalidate, leaving stale results visible until expiry. | Removed route-local caching from `/api/posts`, `/api/posts/[id]`, and `/api/favorite` GET handlers. This prioritizes correctness; add a shared cache only with centralized invalidation and realistic query-performance evidence. CI passed in run `40437198991`. | Code and CI verified; performance monitoring open |

| AK-023 | P1 | Registration request body size | The registration endpoint parsed arbitrary JSON request bodies before applying field validation, allowing unnecessarily large bodies to consume memory and CPU. | Added a streaming JSON reader with a 16 KiB cap, HTTP 413 for oversized requests, strict UTF-8 decoding, and focused tests. The complete bounded-body change later expanded to profile, admin, product, search, and favorite APIs and was merged via PR #13 at `a89ea238184db2a3dab215c09850fa99e3cf15ef`, after GitHub Actions run `40475361858` passed on reviewed head `3a82abe1edef1fbfc4d6bfe09da49102d0a62e1d`. Upstream body limits and durable rate limiting remain open. | Merged; CI passed on reviewed head; rate limiting/upstream limits remain open |
| AK-024 | P1 | Product deletion actions and authorization | Two UI deletion controls called legacy paths (`/api/allPosts` and `/api/Cars/allPosts`) that are not present in the current API tree; the active dynamic delete endpoint only authorized the owner, while the UI exposes an administrator delete control. | Updated both controls to call `DELETE /api/posts/{id}` without trusting client-supplied `isAdmin` or a body identity. The admin-only control derives visibility from the authenticated NextAuth session role. Extracted deletion business logic into a testable action and added tests for unauthenticated requests, invalid IDs, owner/admin success, unrelated-user denial, missing products, soft-delete fields, and database failures. GitHub Actions run `40475897417` passed on reviewed head `5096caf0ab145a62097c3c7e775cba7d234d0a26`; PR #14 was merged as `ce7729bbda143a649039ef09623a310de7953496`. Browser interaction and live database-backed permission tests remain open. | Merged; unit tests and CI passed; browser/DB integration open |

| AK-027 | P1 | Unbounded JSON bodies across admin, profile, product, and favorite APIs | Admin user update/delete, authenticated profile updates, product create/update/delete, product-detail lookup, and favorite mutation/check endpoints parsed JSON without a streaming byte cap. | PR #13 adds 16 KiB limits for admin/profile/favorite APIs, 128 KiB for product mutations, 8 KiB for product lookup, and 64 KiB for search. The changes were merged to `main` at `a89ea238184db2a3dab215c09850fa99e3cf15ef` after run `40475361858` passed on reviewed head `3a82abe1edef1fbfc4d6bfe09da49102d0a62e1d`. Route/database integration, browser tests, upstream body limits, and durable rate limiting remain open. | Merged; CI passed on reviewed head; integration/rate-limit checks open |
| AK-028 | P1 | Image uploads exceed platform request limit | The API accepted image files up to 5 MiB plus multipart overhead, but Vercel Functions rejects request bodies over 4.5 MB before the route can validate them. | PR #19 lowered the file maximum to 4 MiB, caps multipart requests at 4.25 MiB, updates the Arabic validation message, and adds a regression assertion against the platform threshold. Run `40477078826` passed on reviewed head `ff6ca67f6e14dc5bd0dd4b0fc819f5d507dbd4a2`; merged to `main` as `686c03890c6a28e240a83eefd44a6a51c63a9ee9`. Larger uploads should use authenticated direct-to-storage uploads. See https://vercel.com/docs/errors/function_payload_too_large. | Merged; CI passed |
| AK-026 | P1 | Unbounded search JSON request body | `POST /api/search` used `request.json()` without a streaming byte limit, so oversized public search payloads could be buffered and parsed before validation. | The shared streaming JSON reader now caps search requests at 64 KiB, returning 413 for oversized bodies and 400 for malformed JSON/UTF-8. This code is included in PR #13, merged at `a89ea238184db2a3dab215c09850fa99e3cf15ef`; CI run `40475361858` passed on the exact reviewed head before merge. Route/database integration, browser tests, and durable rate limiting remain open. | Merged; CI passed on reviewed head; integration/rate-limit checks open |
| AK-025 | P1 | Admin user pagination overflow and expensive out-of-range queries | The admin user listing used the generic positive-integer parser and calculated `skip` directly. Even a technically safe but astronomically large offset can force an expensive database query. | Pagination guards now cover admin users, category listings, favorites, order history, seller listings, public catalog, and deep search offsets. Tests cover boundaries, unsafe, negative, non-finite, and fractional inputs. PR #17 was based on current `main`, passed run `40476700512` on head `b2c5da2bd1295b9b2d62efac8403120d62c2e646`, and merged as `7efd49b7b1bfe9b0a2fc095ae5532232069c65e5`. Route/database and browser verification remain open. | Merged; CI passed on reviewed head; integration tests open |

## Ordered remediation plan

1. **Security first:** rotate all previously committed image-provider credentials (AK-000), keep the shared session/role authorization policy enforced, add durable upload/registration rate limiting and upstream request-body limits (AK-001, AK-020, AK-021), and finish the route-by-route audit before exposing administrative mutations.
2. **Database lifecycle:** standardize Prisma access and remove per-request disconnects (AK-002).
3. **Correctness:** fix cache invalidation, route params, validation, pagination, and consistent product visibility (AK-003 through AK-007).
4. **Database safety:** resolve migration drift with a generated/reviewed data-preserving migration (AK-015), then run clean-database and existing-data migration checks.
5. **Regression safety:** add tests and run the available checks (AK-008 and AK-013).
6. **Data layer:** validate schema/migration compatibility and document database-dependent results (AK-009).
7. **Search system:** unify the search contract and verify UI/API/filter interoperability (AK-012).
8. **Architecture and design:** modularize the homepage/layout, then apply the unified luxury visual system without losing existing functionality (AK-010 and AK-011).
9. **Final release regression pass:** test routes, links, buttons, responsive layouts, error/loading/empty states, and all available API/DB flows before production deployment.

## Verification log

| Date | Scope | Command / method | Result |
|---|---|---|---|
| 2026-10-27 | Initial static repository inspection | GitHub source/tree review | Initial findings recorded above. No build, lint, database, or browser test had yet been claimed as run. |
| 2026-10-27 | First CI run | GitHub Actions run `40425041806` | `npm ci`, `prisma validate`, and `prisma generate` passed. ESLint failed with 8 errors at that commit: a product-route parse error, unescaped quotes in two JSX views, nested component creation in dynamic filters, and the intentional CommonJS seed import. The product route was rebuilt; JSX/component issues were corrected; the seed import received a targeted lint directive. Follow-up CI is pending; these changes are not marked verified until a run passes. |
| 2026-10-27 | First CI pass | GitHub Actions run `40425819726` | `npm ci`, Prisma schema validation, Prisma client generation, Node unit tests, ESLint, and production build passed on commit `eb9e8e8bca08c015a026e0529f6b520be47438cf`. |
| 2026-10-27 | Seller visibility and favorites cache-key regression | GitHub Actions run `40429579234` (commit `aec8260f8ab4ac82311f85aaaf4b4ff143c68b71`) | Node unit tests, ESLint, Prisma validation/generation, clean PostgreSQL migration application, drift SQL generation, and production build passed. Added public-product visibility and favorites cache-key regression tests; database-backed route behavior and existing-data migration safety remain unverified. |
| 2026-10-27 | Public seller-listing visibility regression | Added `tests/public-product-where.test.mjs`; applied the shared visibility predicate to `/api/posts` and `/api/posts/[id]` result/count queries | Code review confirms list and count predicates now match and public reads exclude deleted/inactive products and inactive categories. Automated test and CI rerun are pending; not marked verified yet. |
| 2026-10-27 | Strict pagination parsing | Updated `lib/api/validation.mjs`, `app/api/allUsers/route.js`, and `tests/api-validation.test.mjs` | Pagination parser rejects malformed numeric prefixes (`12abc`), decimals, and unsafe integers rather than accepting a partial value; admin user listing now reuses the shared helper. Regression tests and CI are pending. |
| 2026-10-27 | Strict pagination and bounded search filters | GitHub Actions run `40430508488` (commit `53d6596dbe082fdc10f483c3982546dc1879bd81`) | Node unit tests, ESLint, Prisma validation/client generation, clean PostgreSQL migration application, schema drift report generation, and production build passed. This verifies code-level regressions, not production database compatibility or route-level behavior with real data. |
| 2026-10-27 | Currency-label correction | Removed the hard-coded Saudi-riyal label from `components/Search/StaticFilters.jsx` | UI now avoids claiming a currency that the product schema does not store. Currency-aware product prices and checkout remain a release blocker; CI for this latest change is pending. |
| 2026-10-27 | Legacy UI cleanup | Removed the tracked homepage backup (122 KB) and obsolete commented implementations from filter components, product card/detail, category navigation, cart, seller listing, profile, and favorites pages; removed hard-coded SAR filter labels | Active implementations retained; cart still explicitly labels checkout as demo-only. ESLint/build verification is pending for this cleanup batch. |
| 2026-10-27 | Client debug-log cleanup | Removed debug `console.log` calls from the favorite button, user-name/photo component, and seller-list page | Logs containing favorite/product/user details no longer execute in these inspected components. CI verification is pending. |
| 2026-10-27 | Category/search synchronization | Updated all 22 category paths, `CategoriesNavBar.jsx`, `CategoryFilter.jsx`, and `features/search/search-context.jsx` | Both category-navigation components now preserve search terms and rely on URL/state synchronization; category removal clears the URL parameter. CI and browser click-through tests are pending. |
| 2026-10-27 | Search offset bounds | Updated `/api/search` to reject unsafe integers and cap page offsets so `(page - 1) * limit` remains within `Number.MAX_SAFE_INTEGER` | Code-level guard added; CI and real-query performance verification are pending. |
| 2026-10-27 | Strict bulk category IDs | Extracted `parseCategoryIds()` into `lib/api/category-ids.mjs`, reused it in `/api/categories/bulk`, and added `tests/category-ids.test.mjs` | Tests cover malformed prefixes, duplicates, limits, and empty inputs. CI is pending; DB route integration remains open. |
| 2026-10-27 | Product deep-link loading | Updated `app/post/[id]/page.jsx` to load real product data from the server API and treat localStorage only as a fallback | Real product URLs can now load without a prior card click or pre-populated browser storage. CI and direct-link browser testing are pending. |
| 2026-10-27 | Favorite state and pagination | Updated `FavoriteButton.jsx`, login cache normalization, `app/(shop)/favorite/page.jsx`, and `app/post/[id]/page.jsx` | Session-backed favorite state, correct array cache, semantic button markup, one-based pagination, and API-backed product-detail toggles now share the authenticated favorites endpoints. CI and browser interaction tests are pending. |

| 2026-10-27 | Google sign-in hardening | GitHub Actions run `40435193574` (commit `fb79cfc0a324fb27a2098645d701eb5a13d7e49d`) | Prisma validation/generation, clean PostgreSQL migrations, drift artifact generation, unit tests, ESLint, and production build passed. Google identity helper tests passed; live OAuth and deployment credential rotation remain external checks. |
| 2026-10-27 | Scalar search filter bounds | GitHub Actions run `40435613573` (commit `5d596b501df7001c7c6c6b00583d86c7d07766c8`) | Prisma validation/generation, clean PostgreSQL migrations, drift artifact generation, unit tests, ESLint, and production build passed. Scalar filters and sort keys are bounded; realistic-data performance and browser filter combinations remain unverified. |
| 2026-10-27 | Tested refactor merged | PR #4 merged as `35af92b84183a76da807526a070e5939bd86e7fd`; PR #5 merged as `e806f5e91a5c405ab1f214650bc5806ed2f79179` | Both merges were preceded by green CI on their tested heads. Production remains blocked by historical provider-key rotation and a reviewed data-preserving Prisma migration. |

| 2026-10-27 | Image content-signature validation | GitHub Actions run `40436160208` (commit `5fd61f81463101f2efdff2286fb30e41c0d73236`) | Prisma validation/generation, clean PostgreSQL migrations, drift report generation, unit tests, ESLint, and production build passed. Four upload providers now validate file signatures as well as MIME type and size. |
| 2026-10-27 | Early multipart request-size guard | GitHub Actions run `40436431495` (commit `96f8fa90ffafc92c4b9a7133250b08d99a7b8a2f`) | Unit tests, ESLint, Prisma checks, clean PostgreSQL migration application, drift artifact generation, and production build passed. Content-Length is checked before parsing; hosting-level limits remain recommended for requests without a declared length. |
| 2026-10-27 | Upload hardening merged | PR #7 merged as `e0f3b08973cd9262c65a8263ecf7408d197a8f8e`; PR #8 merged as `b14494fcef75e2ff604db397978644b4d6d06a37` | Both merges followed green CI on the tested heads. Production credential rotation, safe migration remediation, durable rate limiting, and live integration testing remain open. |

| 2026-10-27 | Strict upload Content-Length parsing | GitHub Actions run `40436863107` (commit `bf4778d9548a2c1292d0531a59e6ba23da3972bf`) | All checks passed, including tests for empty and whitespace-only headers; malformed declared lengths are rejected instead of being coerced to zero. PR #10 merged as `bb1d281c62d07a9581608a8f3b488d12f687133b`. |
| 2026-10-27 | Cross-route cache consistency | GitHub Actions run `40437198991` (commit `6c32cd08fe7dbc64ffe34b4ced97e46487abb7b9`) | Unit tests, ESLint, Prisma checks, clean PostgreSQL migrations, drift artifact generation, and production build passed. PR #11 merged as `c2e057abb1d1a22b8cd662e4dd806651433696fb`; query performance should be monitored before adding shared caching. |

| 2026-10-27 | Registration request-body bound | PR #13 (`security/bounded-registration-body`) adds `readJsonBody()` with a 16 KiB limit and focused tests for valid JSON, malformed JSON, invalid UTF-8, oversized bodies, missing bodies, and invalid limits | All five focused Node tests passed locally under Node.js 22.16.0. Full repository CI has not been confirmed. Vercel preview deployment reported its daily deployment quota was exceeded; this is separate from GitHub CI. |
| 2026-10-27 | Product deletion route and authorization | PR #14 (`fix/secure-product-delete-actions`) replaces two stale deletion URLs, uses the session role for admin-control visibility, and enforces owner-or-admin authorization server-side | All four focused Node tests passed locally under Node.js 22.16.0. Full repository CI and browser click-through tests have not been confirmed; Vercel preview deployment is blocked by the daily deployment quota. |

| 2026-10-27 | Admin user pagination overflow | PR #16 (`fix/admin-user-pagination-overflow`) reuses the shared safe pagination helper in `/api/allUsers` | Existing unit coverage checks extremely large page values and safe offsets. Full repository CI and database-backed route tests have not been confirmed; do not mark as fully verified until those checks pass. |


## Continuation handoff — 2026-10-27

This section is the operational checkpoint for continuing the audit. It records the actual branch/PR state and must be refreshed from GitHub before further changes. A PR being open or mergeable does **not** mean its code is tested or safe to merge.

### Current Git state

- Base branch observed during this audit: `main`, commit `3773ba0ea6bf4bb535c004b5463ef8441b1d316b`.
- The changes below are separate, **unmerged pull requests** at the time of this checkpoint. Do not assume their changes are present on `main`.
- PR #13 — [Bound registration JSON request bodies](https://github.com/waelkamira/Akaar/pull/13), branch `security/bounded-registration-body`, head `81c137c9145dff11537bf2942c35ba96baf056f5`.
- PR #14 — [Fix product deletion endpoints and enforce owner/admin access](https://github.com/waelkamira/Akaar/pull/14), branch `fix/secure-product-delete-actions`, head `4546aa922987ec1420a23e93f51ec6dbadcbbdfc`.
- PR #15 — [Record registration and product deletion audit findings](https://github.com/waelkamira/Akaar/pull/15), branch `docs/audit-ledger-registration-delete`. This documentation PR records AK-023 through AK-025 and this handoff.
- PR #16 — [Clamp admin user pagination offsets](https://github.com/waelkamira/Akaar/pull/16), branch `fix/admin-user-pagination-overflow`, head `2632cbd0e6e27f909a6a358bc00a9a03175c59c2`.

**Status caveat:** At the last observed check, these PRs were open and reported mergeable, but Vercel preview checks failed because the account exceeded its daily deployment limit (`api-deployments-free-per-day`, more than 100 deployments). This is a deployment-quota blocker, not evidence that the code itself failed tests. Conversely, it is not a substitute for a passing code CI run. Full GitHub Actions CI was not confirmed for PRs #13, #14, or #16 at this checkpoint. Re-fetch each PR and its latest checks before acting; head SHAs and states may have changed.

### Work completed or proposed (not all merged)

1. **Registration request-size protection — PR #13 / AK-023**
   - Added `lib/api/read-json-body.mjs`, a streaming JSON reader with a 16 KiB default cap, explicit oversized-body handling (413), malformed JSON/invalid UTF-8 handling, and body validation.
   - Updated `app/api/register/route.js` to use the bounded reader before registration validation.
   - Added `tests/read-json-body.test.mjs` covering valid JSON, malformed JSON, invalid UTF-8, oversized/missing body, and invalid limits.
   - Five focused tests were reported as passing locally under Node.js 22.16.0. Re-run them from the actual PR checkout and run the complete project CI before merge. Durable registration rate limiting and hosting-level request limits remain necessary.

2. **Product deletion route and authorization — PR #14 / AK-024**
   - Changed two stale UI deletion URLs (`/api/allPosts` and `/api/Cars/allPosts`) to `DELETE /api/posts/{id}`.
   - Removed client-provided `isAdmin` and body identity as authorization inputs; the endpoint is intended to authorize the authenticated owner or an ADMIN role server-side and soft-delete the active product.
   - Added `lib/api/product-delete-access.mjs` and `tests/product-delete-access.test.mjs` for owner/admin/unauthorized/missing-identity cases.
   - Four focused tests were reported as passing locally under Node.js 22.16.0. Before merge, explicitly verify the actual return shape of `getAuthenticatedUser()`, the session role field and its casing in the UI, whether the `SmallItem` component has the expected `session` value, the existence/types of `isDeleted` and `deletedAt` in Prisma, and the current Next.js dynamic-route params convention. Run the full suite and browser click-through tests. Do not rely on UI visibility for authorization.

3. **Audit ledger — PR #15**
   - Records AK-023 (registration body limit), AK-024 (delete endpoints/authorization), and AK-025 (admin-user pagination overflow), including what is known and what remains unverified.
   - This PR is documentation-only; confirm the final README structure and ensure its statements match the latest code/CI evidence before merging.

4. **Admin-user pagination safety — PR #16 / AK-025**
   - Replaces manual page/limit parsing in `app/api/allUsers/route.js` with the shared `getPagination()` helper and uses its safe `skip` value.
   - Computes `hasMore` from the actual offset and returned row count.
   - Existing `tests/api-validation.test.mjs` is reported to cover very large page values and safe offsets. Verify the helper's behavior and route variable names, then run the full test/lint/build workflow and database-backed route tests.

### Immediate next steps (in order)

- [x] Re-fetch PRs #13–#19 and confirm live states, heads, changed files, and CI. PR #13 (bounded JSON bodies), PR #14 (secure product deletion), PR #15 (audit ledger), PR #17 (pagination guards), and PR #19 (Vercel upload-size alignment) are merged. Old PR #16 was closed as superseded.
- [x] Review bounded JSON parsing on all eight affected route files; correct a missing import discovered during manual source review and rerun CI before merge.
- [x] Run full quality CI on PR #13 reviewed head `3a82abe1edef1fbfc4d6bfe09da49102d0a62e1d` (run `40475361858` passed) and merge as `a89ea238184db2a3dab215c09850fa99e3cf15ef`.
- [x] Extract product deletion logic into a testable action, add seven focused tests for authorization/soft-delete/error behavior, run full quality CI on PR #14 head `5096caf0ab145a62097c3c7e775cba7d234d0a26` (run `40475897417` passed), and merge as `ce7729bbda143a649039ef09623a310de7953496`.
- [x] Reapply pagination guards on current main after the earlier branch became dirty; PR #17 passed full CI run `40476700512` and merged as `7efd49b7b1bfe9b0a2fc095ae5532232069c65e5`.
- [x] Align upload size with Vercel's documented request-body limit; PR #19 passed full CI run `40477078826` and merged as `686c03890c6a28e240a83eefd44a6a51c63a9ee9`.
- [x] Merge documentation ledger PR #18 after its latest README diff and CI passed in run `40477333557`; the updated ledger is now on `main`.
- [x] Complete PR #20's test-only decimal-MB refinement: run `40477648240` passed on reviewed head `e95c33fec5280c67a365c8ae8045895ebb2aea29`, and PR #20 merged as `417b79e11d5d30ebbd8132a88c9c873351e2ac7e`.
- [ ] Run route/database integration tests for pagination boundaries and request-size responses; run browser tests for owner/admin/unrelated-user deletion behavior, soft-deleted product visibility, and UI refresh.
- [ ] Design a data-preserving Prisma migration from the generated drift report. The new read-only inventory script `prisma/schema-inventory-readonly.sql` reports missing canonical tables/columns and legacy image slots without changing data; run it against a restored copy and retain its results. Map legacy product images, safely convert Category IDs and backfill slugs/timestamps, preserve foreign keys, and test against a clean DB plus representative existing data. Do not apply the diagnostic diff directly.
- [ ] Rotate all previously committed provider credentials in provider dashboards and deployment secrets; configure/test upstream body limits and durable rate limiting.
- [ ] Keep the release blocked until credential rotation, migration safety, API-wide security, browser/E2E, and real checkout blockers are addressed. Run final checks on the exact resulting `main` commit after remaining changes merge.

### Remaining high-priority risks and release blockers

- **P0 — historical provider credentials (AK-000):** revoke/rotate ImageKit, ImgBB, and Imgur credentials that appeared in Git history. Removing them from current source does not invalidate them or erase history. This requires the repository owner to rotate them in provider dashboards and replace deployment secrets. Do not paste secrets into source or logs.
- **P1 — Prisma schema/migration drift (AK-015):** the generated diagnostic diff drops legacy `ProductImage.image1`–`image5` columns, adds `url TEXT NOT NULL` without a backfill, drops/recreates the `Category` primary key around an ID type change, and adds required fields such as `Category.slug`/`updatedAt` without a demonstrated existing-row backfill. Design a data-preserving migration, test it on clean and representative existing databases, and take a verified backup before any production migration. **Do not apply the generated diagnostic SQL directly to production.**
- **P1 — complete API security audit (AK-001, AK-007):** audit every private/admin/mutation route for server-side authentication, role/ownership checks, strict input/body limits, rate limiting, safe errors, and appropriate logging. The fixes above cover only specific paths, not the entire API.
- **P1 — upload and registration abuse controls (AK-020, AK-021, AK-023):** signature and declared-size checks exist in inspected upload paths; hosting-level body limits and durable rate limiting still need configuration/testing, including requests without `Content-Length`.
- **P1 — search and filters (AK-004, AK-012, AK-018):** test category, text, seller, location, dynamic details, sort, pagination, URL state, clear-filter behavior, empty results, and malformed values in combinations. Measure query plans/latency on representative data.
- **P1 — real commerce is not production-ready (AK-014):** current checkout is demo-only. Implement currency-aware money storage, taxes/shipping, persisted order lifecycle, inventory reservation, payment provider, verified webhooks, idempotency, refunds, and end-to-end tests before claiming purchases work.
- **P1 — database/API integration:** unit tests and clean-database migration tests do not establish compatibility with the existing production database or prove route permissions and transactions under real data.
- **P2 — UI and accessibility:** test every important button/link, direct product links, search/filter controls, cart/favorites/profile/seller/admin pages, responsive breakpoints, keyboard/focus behavior, loading/error/empty states, and RTL layout in a real browser.
- **P2 — design/architecture:** continue extracting oversized components and applying a consistent premium marketplace design only after preserving the behavior and tests of the existing flows.
- **Operations:** Vercel daily deployment quota was exhausted at the last check. Recheck after the quota window resets or use the repository's independent GitHub Actions checks. A blocked preview must be recorded as blocked, not passed or failed code CI.

### Release decision

**Do not declare Akaar production-ready yet.** The currently recorded work is a partial remediation, several changes remain in unmerged PRs, full CI for the latest PR heads is unconfirmed, and the credential-rotation, migration-safety, API-wide security, browser, and real-checkout blockers remain open. Mark an item “Verified fixed” only after reviewing the relevant diff and recording a passing test result against the exact commit.

| 2026-10-27 | Admin pagination query-cost hardening | PR #16 updated after review: `/api/allUsers` counts matching users first and skips the `findMany` query when the requested offset is outside the result set; added `isPaginationOffsetOutOfRange()` and unit tests | This closes a performance gap not covered by merely keeping the offset within JavaScript's safe-integer range. Latest updated PR head needs fresh CI and database-backed route verification; Vercel preview quota remains a separate issue. |

| 2026-10-27 | Registration and deletion PR CI verification | GitHub Actions runs `40440058972` (PR #13 head `81c137c9145dff11537bf2942c35ba96baf056f5`) and `40440064231` (PR #14 head `4546aa922987ec1420a23e93f51ec6dbadcbbdfc`) | Both `Quality checks` jobs passed dependency installation, Prisma validation/client generation, clean PostgreSQL migrations, drift report generation, unit tests, ESLint, and production build. This does not prove browser UX, live deployment, or production DB migration safety. Vercel preview failures remain due deployment quota. |

| 2026-10-27 | Cross-route pagination offset hardening | PR #16 expanded to cover admin users, order history, public product pages, seller listings, and favorites. Each affected route counts matching rows before issuing a paginated `findMany` and returns an empty result for offsets outside the result set. | Unit helper coverage already exists. Fresh CI for updated head `d0eb9f6d58414d4225d7644bb16dc083e39fe1a3` is pending (run `40443109677` at the time of this update); route-level database tests remain open. Do not mark verified until that run completes. |

| 2026-10-27 | Pagination follow-up revision | PR #16 head advanced to `71df7469efa7362089efd3c5099185995438e9d1`; public product catalog only performs the added count check for offsets above 1,000 to avoid adding a COUNT query to ordinary requests. | Fresh Quality checks run `40443191540` is pending. Do not merge until it passes and the updated diff is reviewed. |

| 2026-10-27 | Additional deep-pagination guards | PR #16 now also guards dynamic seller listings and category listings when the offset is outside the result set, and count-checks unusually deep search offsets (>1,000) before the paginated query. Ordinary catalog/search requests keep their normal fast path. | Latest PR #16 head `66b6953f77a1b43e4297edb728092a4d2cafdbd3`; Quality checks run `40443286398` is pending. Route/database integration verification is still required. |

| 2026-10-27 | Search and category pagination follow-up | PR #16 head `66b6953f77a1b43e4297edb728092a4d2cafdbd3` also guards out-of-range offsets in category pages and dynamic seller pages, and checks unusually deep search offsets before issuing the page query. | Quality checks run `40443286398` is now in progress; the validation job has started but the substantive test/build steps have not completed at this check. The previous successful run applies only to an earlier head. Await fresh CI and route-level database verification. |

| 2026-10-27 | Cross-route pagination CI passed | GitHub Actions run `40443286398` completed successfully on PR #16 head `66b6953f77a1b43e4297edb728092a4d2cafdbd3`. | Prisma validation/client generation, clean PostgreSQL migrations, schema drift report, unit tests, ESLint, and production build all passed. This is CI verification only; route-level DB integration, browser/E2E, and production migration safety remain open. |

| 2026-10-27 | Vercel upload body-size compatibility fix merged | Reduced maximum image size to 4 MiB and request size to 4.25 MiB to remain below Vercel Functions' 4.5 MB request-body limit. | PR #19 merged as `686c03890c6a28e240a83eefd44a6a51c63a9ee9` after run `40477078826` passed on reviewed head `ff6ca67f6e14dc5bd0dd4b0fc819f5d507dbd4a2`. Requests without `Content-Length` and larger direct-to-storage uploads remain operational follow-ups. |

| 2026-10-27 | Pagination guards reapplied on current main and merged | PR #16 became dirty after the base advanced through the bounded-JSON and product-deletion merges. Its pagination changes were reapplied onto current `main` in PR #17, including edge-case unit assertions. | Run `40476700512` passed on head `b2c5da2bd1295b9b2d62efac8403120d62c2e646`; PR #17 merged as `7efd49b7b1bfe9b0a2fc095ae5532232069c65e5`. Route/database/browser integration remains open. Old PR #16 closed as superseded. |

| 2026-10-27 | Product deletion authorization refactor and tests merged | Extracted the DELETE action into `lib/api/delete-product-action.mjs`, tested owner/admin access, unauthorized/missing/invalid cases, soft-delete fields, and generic DB errors. | PR #14 merged as `ce7729bbda143a649039ef09623a310de7953496` after run `40475897417` passed on reviewed head `5096caf0ab145a62097c3c7e775cba7d234d0a26`. Browser and real-database integration remain open. |

| 2026-10-27 | Bounded JSON API hardening merged after source review and CI | Added body caps across registration, admin user updates/deletes, profile updates, product create/update/delete, product detail lookup, search, and favorites. Manual source review found and fixed a missing import before merge. | PR #13 merged to `main` as `a89ea238184db2a3dab215c09850fa99e3cf15ef`. Run `40475361858` passed on reviewed head `3a82abe1edef1fbfc4d6bfe09da49102d0a62e1d`: Prisma validation/client generation, clean PostgreSQL migrations, schema-drift report, unit tests, ESLint, and production build. Route/database integration, browser tests, upstream body limits, and durable rate limiting remain open. |

| 2026-10-27 | Search request-body bound CI passed | PR #13 head `4308cf5828d9b7b1092a6966458ae1f304de71a4` applies the shared streaming JSON reader to `POST /api/search` with a 64 KiB cap; PR title updated to reflect registration and search. | GitHub Actions run `40474142483` passed on this exact head, including tests, lint, Prisma validation/generation, clean migration checks, schema-drift artifact generation, and production build. Route/database integration, browser tests, and durable rate limiting remain open. |

| 2026-10-27 | Correction to earlier pending CI entries | The pending/in-progress notes above are historical snapshots. Run `40443286398` subsequently completed successfully on the same PR #16 head `66b6953f77a1b43e4297edb728092a4d2cafdbd3`. | Use the successful run record above as the current CI state. Remaining verification is route-level DB integration, browser/E2E, and production migration safety. |


### 2026-10-27 — Search/filter PostgreSQL integration coverage (PR #22 merged)
- Extracted the search query/filter builder into a shared module so route behavior and tests use the same predicates and sort definitions.
- Added an isolated PostgreSQL integration database in CI, created from the current Prisma schema (separate from the clean-migration/drift check database).
- Added seeded integration coverage for combined text + price + city + brand + subcategory filters, exclusion of inactive/deleted products, sort order, pagination, and result counts.
- This test validates the shared Prisma query predicates against PostgreSQL, not a live production database or a browser-driven end-to-end request. The historical migration/schema drift remains a separate release blocker; the isolated test database intentionally uses `prisma db push` and is never the production database.

- **Important schema discovery:** the repository also contains a legacy root-level `schema.prisma` that differs from `prisma/schema.prisma`. CI and package installation now explicitly generate/validate against `prisma/schema.prisma`, the schema used by migrations and the search code. The root-level legacy schema still needs a separately reviewed retirement or reconciliation; it must not silently drive Prisma Client generation.
- PR #22 merged after the PostgreSQL search/filter integration tests and required CI checks passed. PR #26 subsequently merged the documented local Docker/PostgreSQL test database workflow after Quality checks run `40484294756` passed on its exact head. This does not verify an existing production database migration or browser-driven API flows.
- The read-only schema inventory added in the current audit branch has not yet been run against a restored legacy database; no migration SQL should be inferred from its expected-table list alone.

---

## Execution plan and live checkpoint — 2026-10-28 (refreshed)

This is the active execution plan. Older handoff notes above are historical snapshots; always re-check GitHub before relying on a PR state or a test result. The owner confirmed there is no production database, so Prisma design is greenfield. This does not make the checkout, secrets, or deployment ready for production.

### Execution rules

1. Work sequentially in small, focused changes; do not duplicate fixes already covered by an open PR.
2. Check the live PR state, current head SHA, dependencies, and latest Quality CI before merging.
3. Include focused regression tests with every behavior change.
4. A green check on an earlier commit is not proof for a newer head. Record the exact SHA and run.
5. Distinguish code changed, CI verified, DB/API integration verified, browser verified, and external owner action required.
6. After merges, verify the merged commit and update this ledger.
7. Do not claim production readiness while any P0/P1 release blocker remains.

### Work completed in this continuation

- [x] Reviewed the current README, package scripts, and Quality CI workflow.
- [x] Added an initial execution-plan PR (#47), then refreshed the plan after the security merge to avoid stale state.
- [x] Re-checked PR #46's recorded latest code head `caea60e733da7b68d331fb23c5aa6c267d302c08`; Quality CI run [40675206391](https://github.com/waelkamira/Akaar/actions/runs/40675206391) completed successfully.
- [x] Merged PR #46 (durable rate limiting and NextAuth redirect/token hardening) as merge commit `6a23b15f0a2e42463730d2f736ffdbbbbe814bd4`. **This does not mean runtime rate limiting is verified**: Upstash credentials and trusted ingress configuration still need a live smoke test.

### Current PR inventory — checked 2026-10-28

| PR | Scope | Next action |
|---|---|---|
| [#47 — execution plan (superseded)](https://github.com/waelkamira/Akaar/pull/47) | Initial README plan based before PR #46 merged | Close as superseded by this refreshed README PR after it is opened. |
| [#43 — product mutation identifiers](https://github.com/waelkamira/Akaar/pull/43) | Validate product IDs on update/delete | Re-fetch exact head and Quality CI; merge only if current head is green and no conflict. |
| [#42 — seller/product route identifiers](https://github.com/waelkamira/Akaar/pull/42) | Validate seller/product IDs on listing/detail routes | Re-fetch exact head and Quality CI; avoid duplicating its changes on main. |
| [#40 — admin user identifiers](https://github.com/waelkamira/Akaar/pull/40) | Validate IDs on admin user update/delete | Historical CI passed on head `0794204862a18905186c33fceac154d83547fdfc`, run [40606369548](https://github.com/waelkamira/Akaar/actions/runs/40606369548); re-check current head/state. |
| [#39 — category route identifiers](https://github.com/waelkamira/Akaar/pull/39) | Strict positive integer category IDs | Re-fetch exact head and CI; merge only if current head is green. |
| [#38 — favorite identifiers](https://github.com/waelkamira/Akaar/pull/38) | Bound favorite read/write identifiers | Re-fetch exact head and CI; merge only if current head is green. |
| [#37 — product image/external URL validation](https://github.com/waelkamira/Akaar/pull/37) | Validate image arrays and external links | Historical CI passed on head `5eb29286a84750fc65f2a702c2db9569396144cc`, run [40604823663](https://github.com/waelkamira/Akaar/actions/runs/40604823663); re-check current head/state. |
| [#36 — profile image URL validation](https://github.com/waelkamira/Akaar/pull/36) | Validate profile-image fields in user APIs | Re-fetch exact head and CI; merge only if current head is green. |
| [#34 — environment file ignore rules](https://github.com/waelkamira/Akaar/pull/34) | Prevent accidental commits of local environment files | Historical CI passed on head `8a062a16f2d9f7f373f71d4fe19971baccfd90f9`, run [40602587075](https://github.com/waelkamira/Akaar/actions/runs/40602587075); re-check current state. |
| [#33 — Prisma/schema reconciliation](https://github.com/waelkamira/Akaar/pull/33) | Canonical Prisma schema, clean migrations, normalized order line items | Historical CI passed on head `5cbeee5c7fee114b13c89bca165a07856488cc17`, run [40610959277](https://github.com/waelkamira/Akaar/actions/runs/40610959277); re-check current state and main after merge. |
| [#31 — previous README ledger](https://github.com/waelkamira/Akaar/pull/31) | Earlier remediation documentation | Check current state; avoid duplicating this refreshed ledger. |
| [#29 — architecture/greenfield policy](https://github.com/waelkamira/Akaar/pull/29) | Target architecture and database policy | Historical CI passed on head `0c92bcd0a61f2ec959d8dee0c801e5fb66b2964a`, run [40606548642](https://github.com/waelkamira/Akaar/actions/runs/40606548642); re-check current state. |

GitHub search can return incomplete status metadata. The table is a checkpoint, not permission to merge: inspect the live PR head/checks first.

### Ordered remaining plan

| Order | Priority | Task | Acceptance criteria | Status |
|---:|---|---|---|---|
| 1 | P1 | Refresh all open security PRs and merge safe, tested changes in dependency order | Current head SHA known; exact-head Quality CI green; no unresolved conflict/dependency; post-merge state recorded | In progress |
| 2 | P1 | Complete API-wide authorization/input audit | Every private/admin/mutation route enforces server identity and role/ownership; bounded IDs and bodies; safe errors/logging; regression tests | Partial; existing PRs cover selected routes only |
| 3 | P1 | Validate durable rate limiter in deployment | Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as server secrets; set `TRUST_PROXY_HEADERS=true` only if ingress overwrites `x-real-ip`; verify 429/`Retry-After` and fail-closed behavior | Code + CI verified; live smoke test pending |
| 4 | P1 | Verify Prisma greenfield schema and migrations on main | Canonical `prisma/schema.prisma`; clean PostgreSQL migration and drift gates pass; order/money schema documented; never deploy generated diagnostic drift SQL blindly | PR #33 recorded green; current merge state/main verification pending |
| 5 | P1 | Search/filter/pagination integration and browser QA | PostgreSQL tests for combined filters, visibility, sort, page/count; browser checks for URL sync, clearing filters, empty/error states, and direct product links | Partial automated coverage; browser tests pending |
| 6 | P1 | Real checkout/order lifecycle | Currency-aware money, persisted order transitions, inventory reservation, payment provider, verified webhooks, idempotency/refunds and end-to-end tests | Not implemented; checkout remains demo-only |
| 7 | P1 | Rotate historical provider credentials and verify hosting controls | Revoke/rotate ImageKit, ImgBB, and Imgur keys found in history; update deployment secrets; verify upload/request limits | Owner/deployment action required |
| 8 | P2 | Responsive/accessibility QA and design cleanup | Verify important actions, keyboard/focus, RTL, mobile/desktop, loading/error/empty states, and product deep links | Pending |
| 9 | P1 | Final release gate | Full checks on exact final main; review unresolved risks; no production-ready claim while P0/P1 blockers remain | Blocked |

### External release blockers

- **Historical provider keys:** repository cleanup does not revoke ImageKit, ImgBB, or Imgur keys previously committed. The owner must rotate them in provider dashboards and update deployment secrets.
- **Rate-limiter deployment:** the merged code requires server-side Upstash configuration and a trusted ingress policy. CI mocks Redis; it cannot replace a live hosting smoke test.
- **Database:** clean-database CI is not proof of compatibility with any populated database. No production database is currently assumed.
- **Checkout:** the current checkout is demo-only and does not represent a real purchase. Do not launch as production commerce until payment, inventory, orders, and failure recovery are complete.


---

## خطة التنفيذ النشطة — 2026-10-28

> هذه الخطة هي نقطة المتابعة الحالية. الحالات القديمة في سجل التدقيق أدناه تحفظ التاريخ ولا تعني أن التحقق ما زال حديثاً. الفرع المرجعي هو `main`، وآخر commit تمت مراجعته أثناء هذا التحديث هو `6a23b15f0a2e42463730d2f736ffdbbbbe814bd4`.

### قواعد التنفيذ والتحقق

1. تنفيذ مهمة واحدة في كل مرة، مع فحص الفرع وPR وSHA الحالي قبل تعديل أي كود.
2. لا تكرار إصلاح موجود في PR مفتوح؛ مراجعة التغييرات التابعة لنفس الملف قبل الدمج أو إعادة التطبيق.
3. لا تعتبر الاختبارات ناجحة إلا على SHA نفسه الذي نراجع أو ندمج.
4. حالات الإنجاز منفصلة: **تعديل كود**، **CI ناجح**، **اختبار تكامل قاعدة بيانات/API**، **اختبار متصفح**، **إجراء خارجي مطلوب**.
5. لا تستخدم `prisma db push --accept-data-loss` ولا تطبق SQL مولداً من تقرير drift على أي قاعدة مشتركة أو إنتاجية.
6. لا نعلن جاهزية الإنتاج حتى تنتهي جميع موانع P0/P1، بما فيها الإعدادات الخارجية والدفع الحقيقي.

### ما تم تأكيده في تحديث 2026-10-28

- [x] قراءة README الحالي و`package.json` وملفات فحص مخطط Prisma.
- [x] تأكيد أن قاعدة البيانات ما زالت greenfield وفق سياق العمل؛ لا توجد قاعدة إنتاج حالية يجري ترحيلها. لذلك يتم تقييم اتساق المخطط والترحيلات على قاعدة جديدة، ويجب إبقاء أي فحص لقاعدة مستقبلية عملية مستقلة.
- [x] PR #46 دمج محدد معدل الطلبات الدائم وتحسين إعادة توجيه المصادقة/إزالة access token غير المستخدم، بدمج `6a23b15f0a2e42463730d2f736ffdbbbbe814bd4`.
- [x] CI للجودة على SHA التوثيق `f1ca9140afcff400f675d135d00c4d8f5733d505` نجح في run [40676690906](https://github.com/waelkamira/Akaar/actions/runs/40676690906).
- [ ] إعداد Upstash وموثوقية عنوان العميل في منصة الاستضافة وفحص live rate-limit لم يثبت بعد. فشل Vercel الحالي بسبب حد النشر اليومي ليس فشلاً في اختبار الكود ولا نجاحاً في اختبار النشر.

### الخطوات المرتبة

| الترتيب | الأولوية | العمل | معيار الإغلاق | الحالة |
|---:|---|---|---|---|
| 1 | P1 | متابعة PRs الأمان المفتوحة #43 و#42 و#40 و#39 و#38 و#37 و#36، وفحص الرأس وCI والتعارضات لكل PR قبل دمجها بالتتابع | كل PR يراجع على SHA الحالي، مع CI أخضر وتعليقات/اختبارات واضحة؛ لا تكرار للتغييرات التابعة | قيد التنفيذ |
| 2 | P1 | إصلاح/تدقيق بقية معرّفات API وتدفقات التفويض | كل مسار خاص/إداري/تعديل يتحقق من هوية المستخدم والدور/الملكية، ومعرفات محددة الطول والصيغة، واختبارات رفض | جزئي؛ PRs تغطي مسارات منتقاة |
| 3 | P1 | تدقيق قواعد الأسرار والبيئة | دمج قاعدة تجاهل ملفات البيئة بعد التحقق من عدم تعريض أسرار، مراجعة المستودع وتاريخه، وتدوير المفاتيح التاريخية خارج Git | PR #34 مفتوح؛ التدوير إجراء مالك |
| 4 | P1 | توحيد Prisma ومصدر المخطط | مراجعة PR #33 على أحدث SHA؛ التأكد أن `prisma/schema.prisma` هو المصدر الوحيد الذي تستخدمه scripts وCI؛ اجتياز migration/drift gate من قاعدة فارغة؛ حسم مصير `schema.prisma` الجذري | PR #33 مفتوح، CI سابق لا يكفي وحده |
| 5 | P1 | اختبارات البحث والتصفح والمفضلة والحذف | تكامل PostgreSQL للمرشحات والترقيم والظهور؛ متصفح لاختبار الروابط المباشرة ومسح الفلاتر والحالات الفارغة والأخطاء والملكية | اختبارات آلية جزئية؛ المتصفح معلق |
| 6 | P1 | تشغيل محدد معدل الطلبات في البيئة الفعلية | إعداد `UPSTASH_REDIS_REST_URL` و`UPSTASH_REDIS_REST_TOKEN` كأسرار خادمية، وضبط `TRUST_PROXY_HEADERS=true` فقط بعد تأكيد أن ingress يكتب `x-real-ip` من جديد؛ اختبار 429 و`Retry-After` وحالات تعطل المخزن | الكود وCI موجودان؛ اختبار الاستضافة معلق |
| 7 | P1 | بناء دورة التجارة الحقيقية | عملة مخزنة مع كل مبلغ، طلبات دائمة وحالات انتقال، حجز مخزون، مزود دفع، تحقق webhooks، idempotency، استرداد واختبارات E2E | غير مكتمل؛ checkout تجريبي فقط |
| 8 | P2 | مراجعة واجهة RTL وإمكانية الوصول | اختبار الجوال/سطح المكتب، لوحة المفاتيح والتركيز، جميع الأزرار المهمة، وحالات التحميل والخطأ/الفراغ | معلق |
| 9 | P1 | قرار الإطلاق | جميع بوابات الجودة على SHA نهائي، لا مخاطر P0/P1 مفتوحة، والمهام الخارجية موثقة ومؤكدة | محجوب |

### فهرس PRs المرصودة عند تحديث الخطة

| PR | النطاق | الإجراء التالي |
|---|---|---|
| [#48 — تحديث الخطة](https://github.com/waelkamira/Akaar/pull/48) | هذا التحديث التوثيقي | فحص CI ودمجه ثم إغلاق/تمييز أي خطة توثيق سابقة متقادمة |
| [#43](https://github.com/waelkamira/Akaar/pull/43) | معرّفات تعديل/حذف المنتج | فحص أحدث SHA وCI |
| [#42](https://github.com/waelkamira/Akaar/pull/42) | معرّفات مسارات البائع والمنتج | فحص أحدث SHA وCI |
| [#40](https://github.com/waelkamira/Akaar/pull/40) | معرّفات المستخدم الإداري | فحص أحدث SHA وCI |
| [#39](https://github.com/waelkamira/Akaar/pull/39) | معرّفات الفئات | فحص أحدث SHA وCI |
| [#38](https://github.com/waelkamira/Akaar/pull/38) | مدخلات معرّف المفضلة | فحص أحدث SHA وCI |
| [#37](https://github.com/waelkamira/Akaar/pull/37) | روابط صور المنتج والروابط الخارجية | فحص أحدث SHA وCI |
| [#36](https://github.com/waelkamira/Akaar/pull/36) | روابط صور الملف الشخصي | فحص أحدث SHA وCI |
| [#34](https://github.com/waelkamira/Akaar/pull/34) | تجاهل ملفات البيئة المحلية | فحص أحدث SHA وCI، والتأكد من عدم حذف `.env.example` |
| [#33](https://github.com/waelkamira/Akaar/pull/33) | توحيد Prisma والترحيلات | فحص أحدث SHA وCI على قاعدة جديدة |
| [#29](https://github.com/waelkamira/Akaar/pull/29) | معمارية السوق المستهدفة | اعتبارها وثيقة تصميم حتى اعتمادها وتنفيذها |
| [#28](https://github.com/waelkamira/Akaar/pull/28) | منع عدم تطابق اسم الفئة القادم من العميل | فحص أحدث SHA وCI |

قد تتغير حالات PR والرؤوس؛ هذا الفهرس لقطة تدقيق لا إذن تلقائي بالدمج.

### موانع الإطلاق التي لا بد من إغلاقها

- **P0 — مفاتيح مزودي الصور القديمة:** تدوير ImageKit وImgBB وImgur التي ظهرت سابقاً في تاريخ Git وتحديث أسرار النشر. إزالة المفاتيح من الملفات الحالية لا يبطلها.
- **P1 — الأمان:** اكتمال مراجعة كل مسارات API، مع حماية التفويض والملكية ومحددات المعدل ومدخلات المعرفات والروابط.
- **P1 — قاعدة البيانات:** اختبار مخطط Prisma والترحيلات من قاعدة فارغة. لا توجد قاعدة إنتاجية حالية حسب سياق المشروع؛ عند إنشاء قاعدة فعلية يجب فحصها وتوثيقها قبل أي ترحيل.
- **P1 — التجارة:** checkout الحالي تجريبي؛ يجب عدم ادعاء بيع حقيقي قبل اكتمال الطلبات والدفع والمخزون وفشل المعاملات واسترداد الأموال.
- **P1 — الاستضافة:** فشل فحوصات Vercel المسجلة على commit `6a23b15f0a2e42463730d2f736ffdbbbbe814bd4` بسبب حد النشر اليومي. افصل مشكلة الحصة عن CI، وأعد اختبار النشر بعد عودة الحصة أو عبر مسار معتمد آخر.

### سجل هذا التحديث

| التاريخ | العمل | نتيجة التحقق |
|---|---|---|
| 2026-10-28 | إنشاء خطة تنفيذ مرتبة وتحديث لقطة الحالة بناءً على main وPRs المفتوحة | تعديل توثيقي؛ CI لفرع PR #48 نجح في [run 40676690906](https://github.com/waelkamira/Akaar/actions/runs/40676690906)، SHA `f1ca9140afcff400f675d135d00c4d8f5733d505`. الدمج النهائي ما زال منفصلاً عن نجاح CI. |


---

## نقطة متابعة التنفيذ بعد عمليات الدمج — 2026-10-28

هذا القسم أحدث من جدول PRs الوارد في خطة التنفيذ أعلاه، ويعكس ما تحقق بعد تحديثها. يرجى اعتماد هذه النقطة عند المتابعة، لأن جدول PR الأصلي يمثل لقطة سابقة.

### دمج مؤكّد مع CI ناجح على الرأس المحدد

| PR | التغيير | CI على SHA المراجع | commit الدمج |
|---|---|---|---|
| [#34](https://github.com/waelkamira/Akaar/pull/34) | تجاهل ملفات البيئة المحلية مع إبقاء `.env.example` | [40602587075](https://github.com/waelkamira/Akaar/actions/runs/40602587075) على `8a062a16f2d9f7f373f71d4fe19971baccfd90f9` | `eb3c87576d967f5d5611fed4a1750d6ac4446bd3` |
| [#39](https://github.com/waelkamira/Akaar/pull/39) | التحقق الصارم من معرّفات مسارات الفئات | [40605632854](https://github.com/waelkamira/Akaar/actions/runs/40605632854) على `fa05d87235bec394324486a81bfd5f288ed8a559` | `8b4ee5163bc3aad6a36529a14c459f8e3dbc513d` |
| [#40](https://github.com/waelkamira/Akaar/pull/40) | التحقق من معرّفات المستخدمين الإداريين | [40606369548](https://github.com/waelkamira/Akaar/actions/runs/40606369548) على `0794204862a18905186c33fceac154d83547fdfc` | `9fd2500e14aaae636f5e6194fcd82be826d7ddca` |
| [#42](https://github.com/waelkamira/Akaar/pull/42) | التحقق من معرّفات مسارات البائع والمنتج | [40607308242](https://github.com/waelkamira/Akaar/actions/runs/40607308242) على `d4c95d4a3e87cbaa2e587085f0f320252e0d3501` | `d8b7e2cf6c0e15814e5477ea7c07e9f0f5aa2e93` |
| [#43](https://github.com/waelkamira/Akaar/pull/43) | التحقق من معرّفات تعديل/حذف المنتج | [40608579261](https://github.com/waelkamira/Akaar/actions/runs/40608579261) على `5badd4b9123a2f14a06d62912a684a2b56fe281c` | `96375e43cf611b8972b5c8fd2e26f8365100f898` |
| [#37](https://github.com/waelkamira/Akaar/pull/37) | التحقق من روابط صور المنتج والروابط الخارجية | [40604823663](https://github.com/waelkamira/Akaar/actions/runs/40604823663) على `5eb29286a84750fc65f2a702c2db9569396144cc` | `9df7aff3926de61cf59fdeba7414c82479ca1e7a` |
| [#33](https://github.com/waelkamira/Akaar/pull/33) | توحيد Prisma على المخطط المعتمد، بوابة drift، وترحيلات قاعدة جديدة، وتطبيع عناصر الطلب | [40610959277](https://github.com/waelkamira/Akaar/actions/runs/40610959277) على `5cbeee5c7fee114b13c89bca165a07856488cc17` | `72de7426ad305a2bdaa9c5355bfaa2d74fc97d3a` |
| [#38](https://github.com/waelkamira/Akaar/pull/38) | التحقق من معرّفات عمليات المفضلة | [40605467832](https://github.com/waelkamira/Akaar/actions/runs/40605467832) على `ed39e7bb74efd9cc203b7d35eb4a4cefe2d749f3` | `b2ba5a81ec37e8bc4ba698c041cf04051725b124` |
| [#48](https://github.com/waelkamira/Akaar/pull/48) | خطة تنفيذ مرتبة ونقطة متابعة | [40677018931](https://github.com/waelkamira/Akaar/actions/runs/40677018931) على `1322fdfd0173c28dfe2450167863f6e097d7ca68` | `cd602b7fbbe6ddd94cb3b3a9346ee5699fd5cb6a` |

**حدود التحقق:** النتائج أعلاه تثبت CI على رؤوس PR المحددة، وليست اختبارات متصفح أو إعداداً حياً على Vercel/Upstash. دمج تغييرات متعددة في المسار نفسه يتطلب مراجعة التكامل على `main` أيضاً.

### المتابعة الحالية ذات الأولوية

| الترتيب | المهمة | الحالة الحالية والإجراء التالي |
|---:|---|---|
| 1 | صور الملف الشخصي في API | PR #36 ما زال مفتوحاً ويبلّغ GitHub عن تعارض دمج بعد تغييرات المستخدمين الإداريين. يلزم إعادة دمجه على `main` الحالي وتشغيل CI على الرأس الجديد؛ لا تتجاوز التعارضات. |
| 2 | سلامة الفئات | PR #28 يمنع عدم تطابق `categoryId` و`categoryName` ويصلح بيانات fallback، لكنه ما زال مفتوحاً ومتعارضاً؛ أعد تطبيقه على أحدث `main` ثم شغّل CI على الرأس الجديد. |
| 3 | فحص نهائي لـ Prisma وطلبات البحث | تحقّق من CI على commit `72de7426ad305a2bdaa9c5355bfaa2d74fc97d3a`، وأن بوابة drift تنجح عند تشغيل Quality workflow على `main`. لا توجد قاعدة إنتاجية وفق قرار المشروع؛ قاعدة فارغة واختبارات PostgreSQL المعزولة هي معيار الكود الحالي. |
| 4 | مراجعة المعمارية | PR #29 وثيقة تصميم معمارية وليست ميزة منفذة؛ راجعها بعد حسم الإصلاحات الأمنية ووافق على أجزاء التنفيذ تدريجياً. |
| 5 | تشغيل rate limit | الكود مدمج، لكن يجب إضافة أسرار Upstash إلى بيئة النشر وفحص trusted ingress ثم تنفيذ اختبار حي يتأكد من 429 و`Retry-After` وفشل الحماية المغلق عند فقدان الهوية الموثوقة. |
| 6 | المفاتيح السرية التاريخية | يتعين على مالك الحساب إبطال/تدوير مفاتيح ImageKit وImgBB وImgur التي ظهرت في تاريخ Git ثم تحديث أسرار النشر. قواعد `.gitignore` لا تلغي المفاتيح القديمة. |
| 7 | اختبارات واجهة المتصفح | لم يثبت بعد اختبار الرحلات الأساسية في متصفح حقيقي: البحث والفلاتر، صفحة المنتج عبر رابط مباشر، المفضلة، صلاحيات الحذف، RTL، والجوال. |
| 8 | دورة الدفع والطلب | ما زالت غير مكتملة؛ لا تطلق المتجر بوصفه تجارة حقيقية قبل الدفع الموثوق والـ webhooks والطلبات والمخزون والاسترداد واختبارات E2E. |

### ملاحظة حول النشر

على commit `cd602b7fbbe6ddd94cb3b3a9346ee5699fd5cb6a` أبلغت حالات Vercel عن `Deployment rate limited — retry in 24 hours`. هذا قيد حصة نشر خارجي، وليس فشلاً في Quality CI. يبقى النشر والتحقق الحي غير مثبتين حتى نجاح نشر جديد واختباره.

