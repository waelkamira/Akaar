# Akaar Marketplace Platform Roadmap

This repository is the foundation for a multi-seller marketplace and e-commerce platform. The project is large enough that it must be executed in a strict dependency order. Building features out of sequence will create rework, broken data relationships, and unstable integrations.

This README is the execution plan for the project. It is intentionally structured as a phased roadmap so that each stage is completed, validated, and only then used by the next stage.

## Project execution principles

1. Build in dependency order, not by feature popularity.
2. Treat Prisma as the source of truth for the operational schema.
3. Never bypass the repository/service/validation layers.
4. Do not expose business logic directly from UI code.
5. Validate each stage with real database operations, not mock success flows.
6. Every stage must pass both isolated tests and end-to-end workflow validation.
7. No phase is complete until it can be used by the next phase without manual fixes.

## Architecture foundation

Before building pages or product flows, the platform must be structured correctly.

### Required system structure
- app/: routes and screens
- components/: reusable UI atoms and layouts
- features/: feature-specific modules and state
- lib/: shared utilities and platform services
- server/: server actions, APIs, and server-side logic
- prisma/: schema, migrations, and database setup
- hooks/: React hooks and custom logic
- types/: shared contracts and DTOs
- tests/: automated test coverage
- config/: environment and platform configuration
- docs/: architecture and decision records

### Required backend architecture
- Single Prisma client instance
- Repository layer for database access
- Service layer for business logic
- Validation layer for input and domain rules
- Authorization layer for permissions and policy enforcement
- Unified error handling
- Transaction support for multi-step workflows
- Idempotency protections for financial, order, and inventory operations

### Critical constraints
- UI components must not directly query Prisma.
- Never treat `schema.prisma` as disposable or replaceable without review.
- The project must use the final merged schema after reviewing global marketplace requirements.
- The old category ID design and legacy database assumptions must be reviewed before migration.
- Do not delete production data or run destructive database commands against real data.
- Use an independent test database before any schema or migration work.

---

## Phase sequence overview

The roadmap below is intentionally sequential. The first phase creates the stable foundation; each later phase depends on earlier ones.

| Phase | Name | Depends on | Why it matters |
|---|---|---|---|
| 0 | Architecture and project restructuring | None | Prevents future rework |
| 1 | Authentication and authorization | 0 | Secures all user and seller flows |
| 2 | Globalization and localization | 1 | Makes commerce usable across markets |
| 3 | Addresses | 1,2 | Needed for shipping and checkout |
| 4 | Sellers and marketplace onboarding | 1,2,3 | Turns the platform into a marketplace |
| 5 | Catalog and products | 4 | Powers discovery and storefront |
| 6 | Search and filtering | 5 | Makes products discoverable |
| 7 | Storefront UX | 5,6 | Delivers the customer buying experience |
| 8 | Cart and guest checkout | 3,5,7 | Starts the buying flow |
| 9 | Orders | 3,5,8 | Creates the transactional core |
| 10 | Payments | 9 | Confirms money movement |
| 11 | Inventory and warehouses | 5,9 | Ensures stock accuracy |
| 12 | Procurement | 11 | Restocks inventory |
| 13 | Accounting and commissions | 9,10,11 | Handles settlement and profit flows |
| 14 | Taxes and customs | 9,13 | Handles compliance |
| 15 | Shipping and tracking | 9,11 | Enables fulfillment |
| 16 | Returns | 9,10,15 | Handles post-purchase flow |
| 17 | Promotions and loyalty | 5,9 | Supports conversion and retention |
| 18 | Reviews and support | 5,9,17 | Improves trust and service |
| 19 | Invoices | 9,10,13 | Keeps transactional history |
| 20 | Notifications, CMS, and settings | 1,9,19 | Supports operations and compliance |
| 21 | Integrations and webhooks | 9,10,20 | Connects external systems |
| 22 | Background jobs | 9,20,21 | Makes platform reliable at scale |
| 23 | Analytics and reports | 9,10,11,13 | Gives operational visibility |
| 24 | Real estate module | Independent | Optional specialized business line |

## Roadmap execution status

Only mark a phase complete after its acceptance criteria and verification pass. Record completed phases using the exact form `<number> done`.

- **0 done** — Added repository boundaries for server-rendered page data; ESLint prevents App Router UI, components, and features from importing Prisma directly. The canonical schema validates and generates Prisma Client; the isolated database migration is up to date; seed reruns preserve fixture counts; production build passes; lint exits 0 (84 existing warnings); unit tests pass (147 passed, 3 skipped). Migration safety documentation and existing error boundaries are in place.
- `1` — in progress (depends on 0); credentials sign-in now records successful and failed login attempts and updates the successful-login timestamp. Verification, recovery, 2FA, revocable sessions, consent, and scoped staff permissions remain incomplete.
- `2` — pending (depends on 1)
- `3` — pending (depends on 1 and 2)
- `4` — pending (depends on 1, 2, and 3)
- `5` — pending (depends on 4)
- `6` — pending (depends on 5)
- `7` — pending (depends on 5 and 6)
- `8` — pending (depends on 3, 5, and 7)
- `9` — pending (depends on 3, 5, and 8)
- `10` — pending (depends on 9)
- `11` — pending (depends on 5 and 9)
- `12` — pending (depends on 11)
- `13` — pending (depends on 9, 10, and 11)
- `14` — pending (depends on 9 and 13)
- `15` — pending (depends on 9 and 11)
- `16` — pending (depends on 9, 10, and 15)
- `17` — pending (depends on 5 and 9)
- `18` — pending (depends on 5, 9, and 17)
- `19` — pending (depends on 9, 10, and 13)
- `20` — pending (depends on 1, 9, and 19)
- `21` — pending (depends on 9, 10, and 20)
- `22` — pending (depends on 9, 20, and 21)
- `23` — pending (depends on 9, 10, 11, and 13)
- `24` — pending; independent optional module

---

## Phase 0: Architecture and project restructuring

### Goal
Normalize the codebase and make the system maintainable before building core product flows.

### Deliverables
- Stable project folder structure
- Service/repository separation
- Error boundaries and consistent error responses
- Prisma schema review and merge plan
- Migration strategy and test database setup
- Clear ownership boundaries between UI and business logic

### Acceptance criteria
- All new features follow the same folder and layer conventions.
- UI code does not access Prisma or domain services directly.
- The schema is reviewed before migration changes are made.
- The project has a clean path to production-safe schema evolution.

### Dependencies
- None

### Enables
- Authentication, catalog, orders, sellers, and every downstream system

---

## Phase 1: Authentication and authorization

### Goal
Create a secure identity and access-control platform for users, admins, sellers, staff, and buyers.

### Prisma models
- User
- UserSession
- OAuthAccount
- Role
- Permission
- RolePermission
- UserRoleAssignment
- TwoFactorAuthentication
- PasswordResetToken
- VerificationToken
- UserConsent
- LoginAttempt

### Functional scope
1. Login
2. Registration
3. Google Sign-In
4. Email verification
5. Password recovery
6. Password change
7. Two-factor authentication
8. User profile
9. Account settings
10. Session and device management
11. Consent and privacy tools
12. Admin user management
13. Role and permission management

### Requirements
- Hash passwords securely.
- Manage and revoke sessions.
- Enforce permission checks on the server.
- Distinguish platform admin, store manager, staff, and buyer roles.
- Log suspicious login activity.
- Prevent unauthorized API access.
- Support RBAC at platform and seller scopes.

### Acceptance criteria
- Users can sign in and register safely.
- Sessions are revocable and bounded.
- Permissions are enforced in server-side code.
- Role-based access works across both platform and seller contexts.

### Dependencies
- Phase 0

### Enables
- Seller onboarding, checkout, account management, addresses, marketplace operations

---

## Phase 2: Globalization and localization

### Goal
Support a global commerce platform with correct local pricing and region-aware behavior.

### Prisma models
- Currency
- ExchangeRate
- Country
- StateProvince
- City

### Functional scope
1. Currency management
2. Exchange rate management
3. Supported countries list
4. State/province data
5. City data
6. Geolocation-aware country selection
7. Currency selector
8. Display-price conversion
9. Language and timezone settings
10. Number and date formatting

### Requirements
- Multi-currency support
- Decimal-based financial storage
- Preserve exchange rate used at the time of order creation
- Support multiple countries/scopes without hardcoding
- Avoid JavaScript floating-point inaccuracy in financial calculations

### Acceptance criteria
- Product prices are displayed in a consistent local currency.
- Exchange-rate history is preserved for each order.
- Country and language selection work correctly across the platform.

### Dependencies
- Phase 1

### Enables
- Addresses, storefront, checkout, taxes, and order totals

---

## Phase 3: Addresses

<<<<<<< HEAD
This structure provides a solid, scalable foundation. It is recommended to build this in **phases** (e.g., Phase 1: Core buying/selling; Phase 2: Advanced analytics and multi-language; Phase 3: AI recommendations) to manage development costs and time-to-market.

---

# Project Audit & Execution Log

> **Audit checkpoint:** 2026-11-01  
> **Repository reviewed:** `waelkamira/Akaar`, branch `main` at the start of this audit  
> **Method:** repository-tree inventory plus static inspection of configuration, Prisma schema/migrations, search/review/payment APIs, CI workflow, and focused tests. This is not a claim that every route has been runtime-tested. Findings below distinguish confirmed repository/documentation issues from risks requiring verification.

## 1. Current State and Audit Limits

- The repository contains approximately **460 tracked files** across storefront/account/auth/seller/admin pages, API routes, libraries, Prisma migrations, scripts, and tests.
- The project is a Next.js application using React, Prisma 6, and PostgreSQL. The active Prisma schema is `prisma/schema.prisma`; the current tree does **not** contain a root-level `schema.prisma`. Use the explicit schema path in all Prisma commands to avoid ambiguity.
- The existing CI workflow includes Prisma validation/generation, applying committed migrations to a clean PostgreSQL service, schema-to-migration drift checking, PostgreSQL search integration tests, unit tests, ESLint, and a production build. This is a strong baseline, but the most recent run visible during this audit was from 2026-10-28; it does not prove that the current `main` head passes.
- No local application process, production database, payment provider, or deployment environment was available in this GitHub-only review. Runtime behavior and production configuration remain unverified until the current head is tested.

## 2. Confirmed Repository / Documentation Issues

| ID | Priority | Finding | Required action |
|---|---|---|---|
| DOC-01 | P1 | This README is primarily a generic proposed architecture and recommended stack, not a truthful record of what is implemented, tested, blocked, or deployable. Some described features (for example split payments, real-time currency/tax handling, AI recommendations, 2FA and full fraud detection) must not be interpreted as implemented merely because they appear here. | Keep the architecture overview as a target, but maintain this audit log and mark features as implemented / partial / not implemented only after checking code and tests. |
| DOC-02 | P2 | **Addressed on phase 3 branch:** `CRITICAL_FIXES_PHASE1.md` and `project-structure.txt` now contain actionable summaries. The empty `testData.json` was removed after repository search found no code references to it. | Verify documentation CI and keep README as the canonical issue log. |
| DOC-03 | P2 | **Addressed on phase 3 branch:** `DEBUG_README.md` now links to the canonical README audit and provides reproducible verification commands and defect-reporting fields. | Keep this file synchronized with README when debugging procedures change. |
| CI-01 | P1 | **Fix prepared on this audit branch:** `.github/workflows/quality.yml` now includes a `push` trigger for `main` in addition to pull requests and manual dispatch. | Confirm the updated workflow completes successfully on this PR and on a subsequent push to `main` after merge. |
| TEST-01 | P1 | **Verified in phase 4 CI:** PostgreSQL-backed HTTP tests cover combined filters, response shape, hidden-product exclusion in suggestions, average-rating filtering, malformed/oversized JSON, page boundaries/`hasMore`, and the 503 fallback when the product review table is unavailable. Direct HTTP testing of rate-limit responses remains open. | Add a dedicated route-level rate-limit test if the shared limiter can be isolated without weakening production configuration. |
| SEARCH-01 | P1 | The shared search sort definitions previously lacked a unique final tie-breaker for equal price/sales/time values. | Added `id ASC` to every supported sort and fallback; unit and route-level pagination tests cover deterministic ordering. CI passed on phase 4 commit `07b2982`. |
| SEC-01 | P2 | **Phase 2 implementation verified by CI:** the inventoried mutation endpoints use the shared bounded JSON reader with route-appropriate 16/32/64 KiB limits. `tests/mutation-body-limits.test.mjs` scans all API route handlers for direct `request.json()` calls. | Configure ingress body-size limits and verify production Upstash/proxy settings for review writes. |
| IMG-01 | P2 | `next.config.js` permits remote images from any HTTPS hostname through `hostname: '**'`. This is broad, but product/store image URLs are currently validated as arbitrary HTTP(S) URLs, so a blind allowlist change may break existing seller content. | Before changing this, decide whether the product supports arbitrary external image URLs. Then either constrain image URLs/uploads to approved providers or bypass server-side optimization for external hosts; test existing product/profile/store media and SSRF protections. Keep this open until that compatibility decision and tests are complete. |
| DB-01 | P1 | The store/product rating APIs intentionally return HTTP 503 when the corresponding review table is absent. The repository includes migrations for product/store ratings, but code presence does not prove that the deployment database has applied them. | Verify migration status on the intended target database before enabling ratings; apply migrations through the controlled deployment process, then test both product and store rating GET/POST flows. Never claim ratings work based on schema validation alone. |
| DB-02 | P1 | The migration `20261102000000_map_favorites_table` deliberately aborts if both `public.favorites` and `public."Favorite"` exist, or if neither exists. This is a safe guard against silently choosing the wrong data, but makes the starting state important. Its timestamp is also later than the audit date. | Confirm the timestamp is intentional and inspect the actual target schema for both table names before deployment. Resolve any duplicate-table/data situation explicitly; do not bypass the guard or apply the migration blindly to a production database. |
| DB-03 | P1 | **Initially confirmed by CI on commit `a1345b2`, then reconciled:** the drift check found mismatched `Order.status` and `marketplace_settings.updatedAt` defaults plus legacy constraint/index names after the `Favorite` / `Review` table renames. The JSONB GIN index also appeared as a drop/recreate pair. | Added `20261103000000_reconcile_prisma_migration_drift`, normalized the JSONB operator class to `JsonbPathOps`, and verified that clean migration deployment plus the drift check pass on audit commit `07ea037`. |

## 3. High-Priority Technical Review Items

These are risk areas requiring targeted tests; they are **not all confirmed runtime defects**.

1. **Prisma and migrations**
   - Treat `prisma/schema.prisma` as canonical and always pass `--schema=prisma/schema.prisma`.
   - Validate the full migration chain against an empty PostgreSQL database and compare the resulting schema with the Prisma datamodel.
   - Check the rating, payment, seller, messaging, favorites and property tables/constraints against every raw SQL query. Raw SQL table and column names must match the committed migrations exactly.
   - Before any production migration, take a restorable backup and inspect the migration diff. Never use `db push --accept-data-loss` against production.

2. **Search and filters**
   - Test combinations, not only individual filters: query + category + price range + city + dynamic attributes + rating + sort + pagination.
   - Verify that deleted, inactive, unapproved, and ineligible-seller products never appear in results or suggestions.
   - Test high page numbers, zero/negative/invalid limits, long queries, empty queries, duplicate titles, and stable ordering when multiple rows share a sort value.
   - Verify the PostgreSQL `pg_trgm` extension and indexes on a clean database, and use query plans with representative data before asserting production-scale performance.

3. **Reviews and ratings**
   - Verify one review per user/target, ownership restrictions, rating bounds, duplicate submissions, unavailable-table behavior, and concurrent submissions.
   - Decide and implement the intended verified-purchase rule. The current README's proposed “verified-purchase-only” policy is not proof that the API enforces it.
   - Add explicit rate limiting and body-size validation for review writes.

4. **Payments and order integrity**
   - The Stripe webhook contains signature validation and checks sandbox mode, currency, amount, payment state and order state. Still test duplicate/out-of-order events, expired sessions, mismatched metadata, transaction rollback, stock restoration, and provider retries against a test database and Stripe test mode.
   - Confirm the configured webhook subscribes only to event types the handler intends to process; unrelated events lacking checkout-session metadata may be rejected.
   - Clearly label the current Stripe flow as sandbox/test-only until a separate production payment review and deployment configuration are completed. Do not claim seller split payouts unless they are implemented and tested.

5. **Security and access control**
   - Audit every admin and seller API for server-side role/ownership checks; hiding a button or page is not authorization.
   - Verify upload type/size limits, URL validation, rate limiting configuration, proxy-header trust, secrets handling, authentication redirects, and cache behavior for private responses.
   - Review broad remote-image host configuration and ensure private/user-specific API responses are not publicly cached.

6. **Build, UX and accessibility**
   - Run the current production build and lint on the exact commit intended for release.
   - Test all primary navigation, search, filters, product details, favorites, cart, checkout, profile, seller onboarding/dashboard, admin controls, messages, notifications and legal/help routes.
   - Check responsive layouts, Arabic RTL behavior, loading/empty/error states, keyboard navigation, focus visibility, image fallbacks and accessible names.
   - Check service-worker/PWA behavior after deployment so cached old assets do not keep a user on a mismatched frontend/API version.

## 4. Ordered Remediation Plan

### Phase A — Establish a trustworthy baseline
- [ ] Run CI against the latest `main` head and record the exact commit SHA and results.
- [x] Add automatic CI on pushes to `main` (workflow change is in this audit PR; verify the run before merge).
- [ ] Validate `prisma/schema.prisma`; generate Prisma Client; deploy the full migration chain into a clean disposable PostgreSQL database.
- [ ] Verify migration status and schema drift without touching production data.
- [ ] Replace empty/stub audit artifacts with real documentation or remove them after checking references.

### Phase B — Close high-risk data and API gaps
- [x] Replace direct `request.json()` parsing in the inventoried mutation routes with bounded body parsing and add a global regression test (CI passed on commit `be8751c`).
- [x] Add deterministic `id ASC` tie-breakers to search sorting and unit tests for sort order and core filters (CI verification pending).
- [ ] Inspect the target database before the favorites table rename migration; confirm its timestamp and starting-state assumptions.
- [ ] Apply and verify rating migrations in the intended environment; exercise product and store rating APIs.
- [x] Add bounded body parsing (16 KiB) and durable rate limiting to review writes; CI verification pending.
- [x] Add route-level search/suggestion tests and run them against PostgreSQL (passed in prior CI run).
- [x] Extend route-level tests for rating filters, malformed/oversized JSON and pagination boundaries (CI passed on commit `07b2982`).
- [x] Add a route-level 503 test when the product review table is unavailable; validate this added case in the current PR CI before merge.
- [ ] Exercise Stripe test-mode lifecycle and stock/order consistency, including retries and duplicate events.
- [ ] Complete server-side authorization checks for admin/seller mutations and upload endpoints.

### Phase C — Reliability, performance and UX
- [ ] Resolve the external-image policy: approved-host allowlist versus arbitrary seller URLs with a safe non-proxy image path. Validate existing media and SSRF protections before changing `next.config.js`.
- [ ] Measure search query plans with realistic row counts; adjust indexes only based on measured plans.
- [ ] Verify all routes, controls and user journeys on desktop/mobile and in Arabic RTL.
- [ ] Review PWA cache invalidation and production error reporting.

### Phase D — Deployment readiness
- [ ] Confirm production environment variables and provider settings without committing secrets.
- [ ] Confirm database backup/restore procedure, migration rollback/recovery plan, HTTPS, domain, monitoring and error alerts.
- [ ] Run clean install, unit tests, database integration tests, lint, production build and a smoke test on the release candidate.
- [ ] Record the deployment commit, migration outcome, smoke-test results and any remaining blockers here.

## 5. Commands for a Local Verification Pass

Run from the repository root using Node.js 22 and the project's lockfile. Use a **disposable test database**, not production.

```bash
npm ci
npx prisma validate --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/schema.prisma
npm test
npm run lint
npm run build
```

For the isolated local PostgreSQL test container (requires Docker):

```bash
npm run db:test:start
npm run db:test:setup
npm run test:search-db:local
npm run db:test:stop
```

For a clean-database migration check, create a fresh disposable PostgreSQL database and run:

```bash
npx prisma migrate deploy --schema=prisma/schema.prisma
npx prisma migrate status --schema=prisma/schema.prisma
```

Do not run the destructive test reset against any database containing user or production data.

## 6. Verification Log

| Check | Status at this audit |
|---|---|
| Repository tree inventory | Completed; 460 tracked files reported by GitHub tree API |
| CI trigger fix | Passed on audit commit `07ea037`; CI run [41338563737](https://github.com/waelkamira/Akaar/actions/runs/41338563737) succeeded |
| Review POST body limit and write rate limit | Passed on audit commit `d752672`; CI run [41339160083](https://github.com/waelkamira/Akaar/actions/runs/41339160083) succeeded |
| Mutation route body-size policy | Passed on phase 2 commit `be8751c`; global `app/api` scan and full CI passed in [run 41340005544](https://github.com/waelkamira/Akaar/actions/runs/41340005544) |
| Stable search sort and route-level coverage | Unit and HTTP tests for rating filters, malformed/oversized bodies, pagination and `hasMore` passed in CI run [41341035106](https://github.com/waelkamira/Akaar/actions/runs/41341035106). |
| Empty documentation placeholders | Populated `CRITICAL_FIXES_PHASE1.md`, `project-structure.txt`, and `DEBUG_README.md`; removed unreferenced empty `testData.json` on phase 3 branch; CI pending |
| Static inspection of project configuration, active Prisma schema, migration workflow, search route, review route, Stripe webhook and selected tests | Completed for this first pass |
| Unit tests on audit branch | Passed in CI run [41338563737](https://github.com/waelkamira/Akaar/actions/runs/41338563737) on commit `07ea037` |
| ESLint on audit branch | Passed in CI run [41338563737](https://github.com/waelkamira/Akaar/actions/runs/41338563737) on commit `07ea037` |
| Production build on audit branch | Passed in CI run [41339160083](https://github.com/waelkamira/Akaar/actions/runs/41339160083) on commit `d752672` |
| Clean PostgreSQL migration run against current `main` | Not run on `main` because the fixes are not merged yet. On audit commit `d752672`, the full migration chain deployed to clean PostgreSQL and the schema-drift check passed in CI run [41339160083](https://github.com/waelkamira/Akaar/actions/runs/41339160083). |
| Search/filter route-level integration tests | Rating/body-size/pagination tests passed in [run 41341035106](https://github.com/waelkamira/Akaar/actions/runs/41341035106); missing-review-table fallback test added on phase 4 branch and awaits final CI |
| Production deployment/database/payment configuration | Not accessible / not verified |

**Rule for future updates:** move an item to “fixed” only after a code change and the relevant test pass are recorded with the commit SHA. Keep unresolved findings visible; do not mark a feature operational just because a page or schema model exists.


## 6. Database-Driven Frontend Foundation — 2026-11-02

**Branch:** `feat/database-driven-ui-foundation`

Implemented in this branch:
- Replaced the fully commented storefront home page with an active responsive marketplace landing page. Product cards load through the existing `POST /api/search` endpoint and include loading, empty, retry/error states, search navigation and product links.
- Added `features/database-ui/model-registry.js` to map the Prisma domain groups to models, relationships, intended routes and shared UI elements.
- Added `/platform-map`, a browsable Arabic map of the frontend domains, model relationships, planned routes and reusable UI inventory.
- Added reusable `EntityStatusBadge`, `EntityEmptyState` and `EntitySectionHeading` components for consistent status, empty and section states.
- Used the existing operational schema and existing route inventory as the basis; this work does not change Prisma models or run database migrations.

Scope note:
- The registry is an implementation map, not a claim that every listed route is complete. Existing pages should be extended in place rather than duplicated.
- Runtime build and database-backed rendering have **not yet been run** from this GitHub-only session. The home page depends on the existing search API and its configured rate-limit service; an API configuration error is displayed rather than hidden.
- Next implementation chunk: connect the shared primitives to existing catalog/product/category pages, then finish the account/cart/order and seller/admin/property gaps using the actual Prisma relations.


### Follow-on implementation chunk — pages wired to Prisma relations

- Added `/seller/products`: authenticated product inventory from `Product.userId → User`, including approval/active status, category, price, stock, last update, and links to the existing product detail route.
- Added `/seller/orders`: authenticated vendor orders scoped to the current `Seller.id`, with order status, tracking number and related products through `VendorOrder → Order → OrderItem → Product`. It shows a setup state if the account has no Seller record.
- Added `/orders`: authenticated customer orders from `User → Order → OrderItem → Product`, with related payment status.
- Added `/admin/catalog`: admin-only read view of products, owner, optional seller profile, approval status and activation state. It deliberately has no fake moderation buttons; mutations must be connected to authorized APIs before being offered.
- Added `/properties` and `/properties/[id]`: published/available property listings and detail pages using `Property → Store` and `Property → User`, including typed attributes when present.
- These pages use the existing operational Prisma schema and do not change the schema or database. A local Next.js build has not been run from this GitHub session; compile/runtime validation remains pending.


- Added `/stores/[slug]`: public seller storefront that exposes only active sellers and active, approved, non-deleted products.
- Added `/seller/analytics`: database-backed counts for products, recorded sales counts, vendor orders, pending vendor orders and low-stock products. The page explicitly avoids presenting these counts as financial revenue.
- Added `/notifications`: authenticated notifications list and unread count from `User → Notification`.
- Added `/messages`: authenticated conversation inbox from `StoreConversation → StoreMessage`, scoped to the current user as customer or seller. The page clearly marks that sending/opening individual conversations still needs its authorized write/read workflow.
- Corrected seller order item scoping to use `VendorOrder.items` so one seller does not see another seller's items from the same parent order.


### Additional frontend coverage — 2026-11-02

- Added `/categories`: active category tree with parent/child links and counts of active, approved products, based on `Category.parentId` and `Category.products`.
- Added `/wishlist`: authenticated favorites from `User → Favorite → Product`, filtered to visible products.
- Added `/my-bookings`: authenticated booking history from `User → BookingRequest → Property`, including quoted price, fee and current property status.
- Added admin read views at `/admin/users`, `/admin/sellers`, and `/admin/orders`, scoped through the existing `getControlPanelAdmin` authorization helper. They expose relationships and counts but do not pretend to approve, suspend, refund, or mutate records.
- No database migration or Prisma schema change was made. Build/CI remains unverified in this GitHub-only execution environment; the next pass should use CI/build feedback and continue implementing the remaining functional write workflows (wishlist mutations, booking form, review submission, messaging, checkout/order lifecycle) rather than add more read-only pages.


- Added `/profile`: account overview using User relations/counts, orders, visible favorites, unread notifications, and optional Seller profile.
- Added `/my-reviews`: product and store review history through `Review → Product` and `StoreReview → Seller`.
- Added `/property-wishlist`: saved property list from `PropertyWishlist → Property → Store`, showing only published and available properties.

---

## تنفيذ مبني على مخطط Prisma — تحديث 2026-11-02

### ما أُنجز في هذه الدفعة
- ربط صفحة تفاصيل العقار `/properties/[id]` بواجهة `POST /api/bookings` الموجودة؛ زر الحجز يرسل `propertyId` ومفتاح idempotency فريد، يعرض أخطاء الخادم، ويوجه المستخدم إلى `/my-bookings` عند نجاح الطلب.
- توضيح أن الحجز الحالي يسجل طلبًا تجريبيًا فقط ولا يجري تحصيلًا ماليًا.
- إضافة زر إزالة فعلي إلى `/wishlist` مرتبط بـ `DELETE /api/favorite`، مع تمرير معرف المفضلة ومعرف المستخدم المسجل، وتحديث الصفحة بعد نجاح الحذف.
- أُبقيت صلاحيات التحقق من المستخدم ومعالجة الملكية داخل واجهات API الحالية؛ لم تُضف تغييرات إلى مخطط Prisma أو قاعدة البيانات في هذه الدفعة.

### التحقق والقيود
- راجعت مخطط `prisma/schema.prisma` وتأكدت من وجود `Favorite` بمفتاح فريد `[userId, productId]` وحقول `id` و`isDeleted`، ومن وجود واجهة `/api/bookings` التي تسجل طلبات الحجز بمعاملة قاعدة بيانات.
- لم يُشغّل بناء Next.js أو الاختبارات من خلال اتصال GitHub في هذه الدفعة؛ يلزم تشغيل `npm run build` و`npm test` في بيئة المشروع قبل اعتبار التغييرات متحققة بالكامل.
- لا تزال دورة الشراء/الدفع منفصلة عن حجز العقارات؛ الحجز لا يعني شراء منتج ولا تحصيل رسوم.

### استكمال ربط الرسائل والتقييمات — 2026-11-02
- أُضيف المسار `GET/POST /api/messages/[conversationId]`: يتحقق من عضوية المستخدم في المحادثة قبل قراءة الرسائل أو إرسال رد، ويحدّث حالة قراءة الرسائل الواردة.
- أُضيف مكوّن `ConversationThread` وربط بصندوق `/messages` لعرض الرسائل وإرسال الردود من العميل أو البائع.
- أُضيف نموذج `StoreReviewForm` في صفحة المتجر العامة، مرتبط بـ `POST /api/reviews`؛ لا يظهر لصاحب المتجر، ويستخدم تحقق الصلاحيات ومحدد المعدل الموجودين في API.
- اعتمد التنفيذ على علاقات `StoreConversation`, `StoreMessage`, `Seller`, `StoreReview` وحقولها الموجودة في `prisma/schema.prisma` دون تغيير المخطط أو تشغيل ترحيلات.

**التحقق:** تم حفظ الملفات والتعديلات على فرع PR. لم يُنفذ تشغيل محلي لـ TypeScript/Next build أو اختبارات التكامل، لذا يلزم التحقق منها قبل الدمج. كما أن تحميل الرسائل يتم عند فتح المحادثة؛ التحديث اللحظي/الإشعارات الفورية غير مضافين.

### تنفيذ السلة والشراء من مخطط Prisma — 2026-11-02
- إنشاء `GET/POST/PATCH/DELETE /api/cart` باستخدام `Cart` و`CartItem` وعلاقة المستخدم؛ يدعم جلب السلة، إضافة المنتجات، تعديل الكمية، وحذف المنتج.
- التحقق على الخادم من حالة المنتج والموافقة عليه وتوفر المتجر والمخزون، وعدم الاعتماد على السعر أو الكمية المرسلين من المتصفح.
- إنشاء صفحة `/cart` ومكوّن `CartClient` لعرض عناصر السلة وتحديثها وإزالة المنتجات وإدخال بيانات التوصيل.
- ربط زر إضافة المنتج في `/post/[id]` بواجهة السلة الدائمة للمستخدم المسجل. المنتجات التجريبية فقط تبقى في السلة المحلية ولا تُرسل كمنتجات حقيقية.
- ربط تأكيد الشراء بواجهة `POST /api/orders` الموجودة؛ وهي تنشئ `Order` و`OrderItem` و`VendorOrder` و`Payment` ضمن معاملة، وتخصم المخزون بعد إعادة التحقق منه. يُزال محتوى السلة بعد نجاح طلب الدفع عند الاستلام أو بعد عودة الدفع الإلكتروني إلى مسار النجاح.

**حدود الدفعة:** واجهة السلة تتطلب تسجيل الدخول حاليًا؛ لم يُفعّل مسار سلة الضيف رغم وجود `GuestSession` في المخطط. الدفع الإلكتروني يظل مشروطًا بإعدادات Stripe التجريبية الموجودة. لم يُشغّل بناء Next.js أو اختبارات التكامل محليًا؛ يجب مراجعة نتيجة CI والتحقق من التطبيق قبل الدمج.

### تشخيص فشل CI — 2026-11-02
- فشل workflow السابق في خطوة تكامل البحث مع PostgreSQL؛ فشل تشغيل خادم Next.js التجريبي قبل جاهزية API، بينما نجحت خطوات Prisma والتحقق من المخطط والترحيلات.
- كانت اختبارات التكامل تستخدم `stdio: 'ignore'` لخادم Next.js، ما أخفى سبب خروجه. عُدّلت الاختبارات لالتقاط stdout/stderr وإظهار آخر سجل عند الفشل.
- لم يتضح بعد السبب الجذري لخروج خادم Next.js؛ يلزم تشغيل CI مجددًا وقراءة السجل التشخيصي قبل اعتبار المشكلة محلولة.


## 2026-11-02 — CI diagnosis and guest-cart integration

### Confirmed CI failure and correction
- CI run `41500299344` passed Prisma validation, client generation, clean PostgreSQL migration deployment, canonical schema generation, and schema/migration drift checks.
- The PostgreSQL search integration test failed before its HTTP assertions because Next.js detected two route folders for the same dynamic URL: `app/api/messages/[conversationId]` and `app/api/messages/[id]`.
- The `[conversationId]` handler was a duplicate legacy implementation; the active inbox and conversation components call the `[id]` endpoint and expect its response contract. Removed the conflicting duplicate handler. A fresh CI run is required to verify this correction.

### Guest cart implementation status
- Added server-managed guest cart sessions using the existing Prisma `GuestSession`, `Cart`, and `CartItem` models; the session token is stored in an HttpOnly cookie.
- Cart GET/POST/PATCH/DELETE endpoints now resolve the cart from the authenticated user or guest cookie. Client-supplied user/session identifiers are not trusted.
- Product detail pages now submit real product additions to `POST /api/cart` for both guests and signed-in users. Demo products remain local-only.
- The cart page loads its items from the API for both account states. Checkout remains restricted to authenticated users; guests are prompted to sign in, with their cart retained for merging.
- The cart API merges a valid guest cart into the user's cart when the authenticated cart is first resolved. Product eligibility and available stock are rechecked during the merge.
- The stock-limit error response now also preserves the guest cookie when a guest cart was initialized by that request.

### Remaining verification
- Re-run CI and inspect the full output; do not mark search integration, unit tests, lint, or production build as passing until their steps complete.
- Add focused automated tests for guest cart creation, persistence across requests, item update/removal, stock limits, login merge, duplicate product merge, and invalid/expired cookie handling.
- Verify the real product-detail add-to-cart flow and cart rendering in a browser session, both signed out and signed in.
- Verify checkout remains inaccessible to guests and that login does not lose the guest cart.
- No production database was modified by this work. No destructive migration, `db push`, or reset was run.


### Follow-up CI result — 2026-11-02
- After removing the duplicate dynamic message route, CI no longer reports the earlier Next.js route-conflict startup error.
- The next run still failed in the integration-test setup because the Next.js dev server did not return HTTP 200 from the search suggestions endpoint within 90 seconds. The test output did not include the server's captured stdout/stderr on timeout, so the actual cause remained hidden.
- Increased the startup wait to 180 seconds and changed the timeout diagnostic to include the last HTTP status/body and captured Next.js server output. This is a diagnostic change only; it does not claim the search integration test is fixed.
- Prisma schema validation, client generation, clean PostgreSQL migration deployment and drift checks continued to pass in this run. Unit tests, ESLint and production build were skipped because the integration step failed.


### Route-collision correction — 2026-11-02
- CI run `41502761998` confirmed that the extended startup diagnostics were working: the search API returned HTTP 500 because six URLs were defined twice across route groups and top-level route folders.
- Removed the superseded route-group page files for `/messages`, `/notifications`, `/profile`, `/cart`, `/orders`, and `/properties/[id]`. The canonical top-level pages remain, including the guest-capable cart and property booking action.
- The duplicate route error is addressed in source, but the latest branch head still requires a fresh CI run. Do not infer that integration tests, lint, or production build pass until that run completes.
- The former route-group profile editor was removed to unblock the canonical profile overview; restore its edit/password controls under a distinct route such as `/profile/settings` before considering account-management UX complete.
- Vercel deployment comments reported the account's free-tier daily deployment limit; this is separate from the GitHub Actions validation failure and does not establish an application build result.


### Production build type-check correction — 2026-11-02
- CI run `41508150597` passed Prisma validation/client generation, clean PostgreSQL migration deployment, schema drift checks, PostgreSQL search/filter integration tests, unit tests, and ESLint.
- Production compilation completed, then TypeScript found incorrect inferred component prop contracts: optional empty-state actions were inferred as required, and the shared section heading's optional eyebrow was inferred as required. Updated the JavaScript component defaults so those props are optional at the TypeScript boundary.
- Fixed the public store page's missing `user` binding by resolving the authenticated user in the page component before passing the review eligibility flag.
- These changes target all TypeScript errors reported by that build. A fresh CI run is still required to confirm the production build passes; no claim of a successful build is made yet.
- Existing ESLint step reports 90 warnings and zero errors. These warnings are technical-debt items, not a failed lint step.


### إعدادات الحساب — 2026-11-02
- استعادة صفحة إعدادات الحساب على المسار المستقل `/profile/settings` لتجنب تعارض المسارات السابق.
- ربط الصفحة بواجهة `GET/PUT /api/user` الموجودة؛ تسمح بتعديل اسم العرض ورابط صورة الحساب، وتعرض البريد الإلكتروني للقراءة فقط.
- إضافة رابط واضح من صفحة `/profile` إلى الإعدادات.
- لم تتم إضافة تغيير كلمة المرور؛ لم أتمكن من التحقق من وجود مسار خلفي فعلي `/api/user/password` على فرع العمل، ولا يجوز إظهار نموذج يعتمد على endpoint غير موجود.
- التحقق الأمني المعتمد: الخادم يستخرج هوية المستخدم من الجلسة، ويتجاهل أي هوية يرسلها العميل، ويتحقق من الاسم والصورة قبل التحديث. لم تُضف صلاحيات تعديل حقول الدور أو الحالة.
- التحقق البرمجي لهذه الدفعة: بانتظار CI الجديد على commit الإعدادات؛ لا تعتبر الصفحة مجتازة build حتى تظهر نتيجة ناجحة.


### المفضلة وإعدادات الحساب — متابعة 2026-11-02
- إصلاح رابط المنتج في قائمة المفضلة من `/posts/[id]` إلى المسار الفعلي `/post/[id]`.
- إزالة اعتماد زر حذف المفضلة على `userId` المرسل من المتصفح؛ أصبح DELETE يستخرج المستخدم من الجلسة ويقيد الحذف بمعرفه، ويرجع 404 عند عدم وجود سجل يخصه.
- إضافة نموذج تغيير كلمة المرور بعد التحقق من وجود `PUT /api/user/password`: يتحقق الخادم من كلمة المرور الحالية عبر bcrypt ويخزن الجديدة باستخدام bcrypt، والنموذج يطابق التأكيد ويتحقق من حدود الطول.
- لم يتم بعد إجراء اختبارات متصفح أو اختبارات تكامل مخصصة لهذه المسارات؛ فحوصات CI الحالية هي التحقق المطلوب قبل اعتبار الدفعة مستقرة.


### دورة الطلبات — تحسينات واجهات المتابعة — 2026-11-02
- راجعت صفحات طلبات العميل والإدارة والبائع مقابل المسارات الفعلية في المشروع.
- صححت روابط عناصر الطلبات في صفحات الإدارة والبائع من المسار القديم `/posts/[id]` إلى المسار المعتمد `/post/[id]`. صفحة العميل كانت تستخدم المسار الصحيح بالفعل.
- تأكدت من وجود مسار تحديث طلب البائع `PATCH /api/seller/orders`، وهو يقيد التحديث بالبائع المفعّل وملكية `VendorOrder`، ويتحقق من انتقال الحالة بالتسلسل، ويحفظ رقم التتبع وتواريخ الشحن والتسليم، ثم يحدّث حالة الطلب الرئيسي عند اكتمال الشحن.
- لوحة البائع الحالية تستدعي هذا المسار لتحديث الحالات؛ لم أضف endpoint إداري لتغيير حالة الطلب لأن مساراً موثوقاً لذلك لم يظهر في المراجعة، ولن أضيف تحكماً شكلياً أو تجاوزاً لقواعد دورة الطلب.
- مسار Stripe webhook الموجود يتحقق من التوقيع ووضع الاختبار ومطابقة المبلغ/العملة/مرجع الجلسة، ويحدّث الدفع والطلب داخل transaction، ويعيد المخزون عند انتهاء جلسة الدفع غير المدفوعة.
- لم تُجر اختبارات متصفح أو Stripe sandbox فعلية في هذه الدفعة؛ تبقى ضمن مرحلة الاختبار الشامل بعد استكمال البناء.


### إدارة البائع والمنتجات — متابعة 2026-11-02
- راجعت دورة تقديم البائع، رفع وثيقة الهوية الخاصة، اعتماد المتجر من لوحة الإدارة، إنشاء المنتجات، تعديلها، حذفها، وتحديث المخزون.
- تأكدت من أن تقديم البائع يتطلب جلسة مستخدم، وأن وثيقة الهوية عند رفعها تُتحقق من خصوصيتها وارتباطها بمعرّف صاحب الطلب، مع rate limit لرفع الوثائق.
- تأكدت من أن إنشاء المنتج يتطلب بائعًا مفعّلًا، وفئة نشطة، ويتحقق من السعر والمخزون والصور، ويضع المنتج في حالة مراجعة عند تفعيل إعداد موافقة المنتجات.
- أصلحت صفحة `/seller/products` لتعرض المنتجات المرتبطة بمعرّف البائع أو بحساب المستخدم (للتوافق مع السجلات الأقدم)، بدل الاعتماد على `userId` وحده.
- أصلحت رابط تفاصيل المنتج في الصفحة من `/posts/[id]` إلى المسار الفعلي `/post/[id]`.
- راجعت واجهة إدارة المتاجر الموجودة في `/admin/control-panel/stores` ومساراتها؛ وهي تدعم مراجعة الطلب، التوثيق، الاعتماد، الرفض، التجميد وإعادة التفعيل مع صلاحية المدير.
- لم أضف واجهة إدارة مكررة تحت `/admin/sellers`؛ الصفحة الحالية هناك للعرض، بينما مسار الإدارة التشغيلي موجود بالفعل في لوحة التحكم.
- لم يتم تشغيل اختبارات متصفح أو اختبارات تكامل جديدة لهذه التغييرات بعد؛ ننتظر CI على أحدث commit قبل اعتمادها.


## 2026-11-02 — مراجعة الرسائل والإشعارات

### ما تمت مراجعته وإصلاحه
- راجعت مسارات الرسائل الحالية: `GET/POST /api/messages` و`GET/POST/PATCH /api/messages/[id]`، وصفحة المحادثات ومكوّن `ConversationThread`، وجداول `StoreConversation` و`StoreMessage` وعلاقة `Notification` في `prisma/schema.prisma`.
- تأكدت أن قراءة المحادثة وإرسال الرد وتحديث حالة القراءة تتحقق من أن المستخدم الحالي أحد طرفي المحادثة؛ كما أن إنشاء الرسائل يستخرج هوية المرسل من الجلسة ويحدد المستلم من علاقة المحادثة.
- أصلحت استجابة تفاصيل المحادثة لتعيد `currentUserId` و`readAt` لكل رسالة؛ كان المكوّن يعتمد على `currentUserId` لكنه لم يكن يصل إليه من API، كما كان نوع الرسالة يطلب `readAt` دون أن تعيده الاستجابة.
- ربطت فتح المحادثة في `ConversationThread` بطلب PATCH الموجود لتعليم الرسائل الواردة كمقروءة، بعد نجاح تحميل الرسائل.

### فجوات متبقية
- كانت صفحة `/notifications` تفتقر إلى إجراءات المستخدم عند تسجيل هذه الملاحظة؛ تمت إضافة API وواجهة تعليم المقروء والحذف في قسم «تنفيذ إدارة إشعارات الحساب» أدناه.
- لا يوجد تحديث لحظي أو polling للمحادثات؛ تحميل الرسائل يتم عند فتح المحادثة أو تحديثها.
- لم تُنفذ اختبارات متصفح أو اختبارات تكامل خاصة بالرسائل والإشعارات في هذه الدفعة.

### التحقق
- فحصت CI run `41514422106` على commit السابق `7dd8e71f8ee364dca60011b122d58a05698327c5`؛ كان لا يزال قيد التنفيذ عند الفحص، وظهر job واحد باسم `validate` بحالة `in_progress`.
- التعديلات الحالية محفوظة على الفرع، ويلزم تشغيل/انتظار CI على أحدث commit والتحقق من build والاختبارات قبل اعتبارها مكتملة.
- لم يتم تعديل مخطط Prisma أو تشغيل migrations أو تغيير قاعدة بيانات فعلية.


### تنفيذ إدارة إشعارات الحساب — 2026-11-02
- إضافة `GET/PATCH/DELETE /api/notifications` اعتمادًا على نموذج `Notification` في `prisma/schema.prisma`.
- جميع عمليات القراءة والتحديث والحذف مقيدة بهوية المستخدم المستخرجة من الجلسة؛ لا يقبل الخادم `userId` من العميل، ولا يمكن لمستخدم التأثير على إشعارات حساب آخر.
- دعم تعليم إشعار منفرد أو جميع إشعارات المستخدم كمقروءة، وحذف إشعار منفرد أو جميع إشعاراته.
- ربط صفحة `/notifications` بمكوّن تفاعلي يعرض العدد غير المقروء ويتيح الإجراءات مع حالات انتظار وأخطاء واضحة وتحديث الواجهة بعد نجاح الاستجابة.
- لا يتطلب هذا التنفيذ أي تعديل على Prisma schema أو migration.
- هذه دفعة بناء وليست اعتمادًا نهائيًا: لم تُشغّل اختبارات أو lint أو build وفق ترتيب العمل المتفق عليه؛ ستتم مراجعة واختبار جميع الوحدات بعد اكتمال البناء.


### بناء دورة طلبات الإرجاع — 2026-11-02
- إضافة `GET/POST /api/returns` وربطها بنموذج `Return` وعلاقة `Order` في مخطط Prisma المعتمد.
- يقتصر عرض وإنشاء طلبات الإرجاع على الطلبات التي يملكها المستخدم الحالي؛ هوية المستخدم تُستخرج من الجلسة ولا تُقبل من العميل.
- يسمح الإصدار الأول بطلب إرجاع على مستوى الطلب بعد تسجيل حالة التسليم، خلال 30 يومًا من تاريخ تحديث الطلب عند التسليم، مع سبب إلزامي من 10 إلى 2000 حرف.
- يمنع تكرار طلب الإرجاع عندما يوجد طلب سابق في حالة `REQUESTED` أو `UNDER_REVIEW` أو `APPROVED`، وينشئ إشعارًا للمستخدم عند استلام الطلب.
- إضافة صفحة `/returns` وسجل طلبات الإرجاع وربطها بصفحة `/orders`.
- حدود المخطط الحالي: نموذج `Return` مرتبط بالطلب ولا يتضمن عناصر إرجاع منفصلة أو حالات typed enum أو سجل تدقيق؛ لذلك لم يتم اختلاق إدارة على مستوى المنتج أو اعتماد استرداد مالي تلقائي. تمت إضافة مراجعة الإدارة لاحقًا كما هو موثق في قسم استكمال مراجعة الإرجاع؛ ويظل تنفيذ رد الأموال الفعلي خاضعًا لتدفق الدفع المعتمد.
- لم تُشغّل الاختبارات أو lint أو build في هذه المرحلة؛ تم تأجيل التحقق الشامل إلى ما بعد اكتمال وحدات البناء.


### استكمال مراجعة الإرجاع من لوحة الإدارة — 2026-11-02
- إضافة `GET/PATCH /api/admin/returns` مع التحقق من صلاحية مدير لوحة التحكم.
- إضافة صفحة `/admin/returns` وربطها بالتنقل الإداري؛ تعرض الطلبات والعميل والسبب والقيمة والحالة.
- يدعم مسار المراجعة الانتقالات المحددة: `REQUESTED → UNDER_REVIEW` ثم `APPROVED` أو `REJECTED`، مع تحديث مشروط بالحالة الحالية لمنع الكتابة فوق قرار متزامن.
- ينشئ الخادم إشعارًا للعميل عند كل قرار إداري ناجح.
- لم يتم تنفيذ رد مالي آلي أو تغيير حالة الدفع عند الموافقة؛ الموافقة الإدارية على الإرجاع ليست إثباتًا بأن مزود الدفع أعاد الأموال. يتطلب ذلك تدفق استرداد مستقلًا ومتكاملًا مع مزود الدفع.
- لم يتم تعديل مخطط Prisma أو إنشاء migration في هذه الدفعة، ولم تُشغّل الاختبارات أو lint أو build؛ سيجري التحقق الشامل بعد اكتمال البناء.


### بناء إدارة وسائل الشحن — 2026-11-02
- إضافة `GET/POST /api/admin/shipping-methods` و`PATCH/DELETE /api/admin/shipping-methods/[id]` باستخدام نموذج `ShippingMethod` الموجود في `prisma/schema.prisma`.
- إضافة صفحة `/admin/shipping-methods` لإضافة الوسائل وتعديل الاسم والتكلفة وحذفها، مع إظهار عدد الطلبات المرتبطة بكل وسيلة.
- حماية جميع عمليات الإدارة بصلاحية مدير لوحة التحكم والتحقق من المدخلات وحدود الاسم والتكلفة.
- إضافة رابط وسائل الشحن إلى تنقل الإدارة.
- قيد مهم في المخطط: `ShippingMethod.cost` من النوع `Float` دون حقل عملة أو منطقة تغطية أو مدة توصيل أو حالة تفعيل. لذلك أُنجزت إدارة السجلات فقط، ولم تُربط التكلفة بحساب checkout أو Stripe حتى لا تُخلط العملات أو تُفرض تكلفة غير محددة على العميل.
- لم يتغير مخطط Prisma ولم تُنشأ migration أو تُنفذ تغييرات على قاعدة البيانات.
- لم تُشغّل الاختبارات أو lint أو build؛ ما زلنا في مرحلة البناء، وسيأتي التحقق بعد اكتمال الوحدات.



### بناء إدارة الخصومات المرتبطة بالمنتجات — 2026-11-02
- إضافة `GET/POST /api/admin/discounts` و`PATCH/DELETE /api/admin/discounts/[id]` وفق نموذج `Discount` في مخطط Prisma.
- إضافة صفحة `/admin/discounts` لإدارة المنتج المرتبط ورمز الخصم ونسبة التخفيض وتاريخ البداية والنهاية، مع عرض عدد الطلبات المرتبطة وحالة الصلاحية الزمنية.
- التحقق من صيغة الرمز وتفرده، ونطاق النسبة من 1 إلى 100، وصحة الفترة الزمنية، ووجود المنتج وعدم حذفه.
- حماية واجهات الإدارة بصلاحية مدير لوحة التحكم، وإضافة رابط الخصومات إلى التنقل الإداري.
- قيد المخطط: الخصم مرتبط بمنتج واحد فقط، ولا توجد حقول لحد الاستخدام أو العملة أو شرائح العملاء أو أنواع الخصومات العامة. عند إنشاء إدارة الخصومات لم يكن رمز الخصم متصلًا بعد بـ checkout؛ تمت إضافة التحقق والحساب الخادمي وربط `discountId` لاحقًا في قسم «ربط رمز الخصم بمسار إتمام الشراء».
- لا تغيير في Prisma schema أو migrations أو قاعدة البيانات.
- لم تُشغّل اختبارات أو lint أو build؛ سيأتي الفحص الشامل بعد إكمال البناء.



### بناء إدارة ترجمات المنتجات — 2026-11-02
- إضافة `GET/POST /api/admin/product-translations` و`PATCH/DELETE /api/admin/product-translations/[id]` وفق نموذج `ProductTranslation` في Prisma.
- إضافة صفحة `/admin/product-translations` لإدارة المنتج واللغة والعنوان والوصف المترجم، وربطها بتنقل لوحة الإدارة.
- التحقق من رمز اللغة بصيغة language tag مبسطة، ومن طول العنوان والوصف ووجود المنتج وعدم حذفه.
- احترام القيد الفريد `[productId, language]` وإرجاع تعارض واضح عند محاولة تكرار ترجمة اللغة للمنتج نفسه.
- قيد التكامل: هذه الدفعة تبني إدارة بيانات الترجمة؛ لم يُربط اختيار اللغة بعد بعرض صفحات المنتج أو نتائج البحث أو SEO أو واجهة المتجر. يلزم تنفيذ طبقة locale وتحديد اللغة الاحتياطية وربط الاستعلامات قبل اعتبار المتجر متعدد اللغات فعليًا.
- لم يتغير مخطط Prisma ولم تُنشأ migration أو تُنفذ تغييرات على قاعدة البيانات.
- لم تُشغّل الاختبارات أو lint أو build؛ ستتم مراجعة كل المسارات والربط بعد إكمال وحدات البناء.



### ربط رمز الخصم بمسار إتمام الشراء — 2026-11-02
- ربط حقل رمز الخصم في سلة التسوق بـ `POST /api/orders`.
- يتحقق الخادم من الرمز وتاريخ الصلاحية وأن المنتج المرتبط بالخصم موجود ضمن عناصر السلة؛ لا يعتمد على أي سعر أو نسبة يرسلها المتصفح.
- يطبق التخفيض على سعر الوحدة للمنتج المرتبط فقط، ويعيد حساب إجمالي الطلب وبنود الطلب على الخادم، ويحفظ `discountId` في سجل الطلب.
- يمنع استخدام الرمز مع Stripe حاليًا لأن نموذج السعر بالدولار ومسار Stripe لا يحتويان بعد على تمثيل موحد لتطبيق الخصم؛ لا يتم خصم قيمة من إجمالي محلي ثم إرسال مبلغ مختلف إلى بوابة الدفع.
- يظل الرمز الواحد في الطلب مرتبطًا بمنتج واحد وفق بنية `Discount` الحالية؛ لا يدعم هذا التنفيذ تجميع عدة أكواد أو خصومات على مستوى الطلب كله.
- لم تُشغّل الاختبارات أو lint أو build بعد، ولم تُجر أي تغييرات على قاعدة البيانات أو مخطط Prisma.



### بناء دليل البلدان والمدن وإدارة الموردين — 2026-11-02
- إضافة واجهات إدارة البلدان `/api/admin/countries` والمدينة `/api/admin/cities` مع الإنشاء والتعديل والحذف، وصفحة `/admin/locations`.
- التحقق من رمز البلد بصيغة ISO alpha-2، ومن تفرد اسم البلد ورمزه، ومن تفرد اسم المدينة داخل البلد.
- حماية حذف البلد إذا كان مرتبطًا بمدن أو موردين، وحماية حذف المدينة إذا كان مرتبطًا بموردين؛ لا نسمح بعمليات حذف متسلسلة قد تمحو بيانات تابعة.
- إضافة إدارة الموردين `/api/admin/suppliers` وصفحة `/admin/suppliers` مع ربط كل مورد ببلد، وربط اختياري بمدينة تابعة للبلد نفسه، والتحقق من البريد الإلكتروني والحقول.
- إضافة روابط البلدان والمدن والموردين إلى تنقل الإدارة.
- تعتمد الوحدات على نماذج `Country` و`City` و`Supplier` الحالية دون تغيير Prisma أو قاعدة البيانات.
- ما زالت هذه بيانات إدارة داخلية؛ لم يتم بعد ربط اختيار البلد والمدينة بواجهة checkout أو البحث الجغرافي أو قواعد الشحن، كما أن نموذج المورد الحالي لا يتضمن حالة اعتماد أو مستندات أو منتجات توريد.
- لم تُشغّل الاختبارات أو lint أو build حتى الآن، وفق ترتيب البناء ثم الفحص الشامل.

### ربط الخصومات بإنشاء الطلب
- أضيف حقل رمز الخصم إلى checkout، ويتحقق الخادم من صلاحيته وارتباطه بمنتج موجود في السلة.
- يعاد حساب أسعار بنود الطلب والإجمالي على الخادم، ويُحفظ مرجع الخصم في `Order.discountId`.
- التطبيق الحالي لرموز الخصم يقتصر على الدفع عند الاستلام؛ تكامل Stripe ينتظر توحيد تسعير الخصومات بالدولار، ولا يُسمح بتمرير خصم محلي مع مبلغ غير مخفّض إلى مزود الدفع.



### تفعيل ترجمات المنتجات في البحث — 2026-11-02
- ربط نموذج `ProductTranslation` بمسار البحث العام `POST /api/search` بدل بقاء الترجمات محصورة في لوحة الإدارة.
- يقبل البحث حقل `language` بصيغة language tag محددة؛ ويبحث في العنوان الأصلي وعناوين الترجمة للغة المطلوبة، مع إبقاء نتائج اللغة الأصلية متاحة كخيار احتياطي.
- يعيد المسار عنوان ووصف الترجمة عند توفرها للغة المطلوبة، وإلا يعيد بيانات المنتج الأصلية. لا يعتمد على لغة يرسلها المستخدم لتغيير صلاحيات أو بيانات خاصة.
- لم يتم بعد ربط محدد لغة موحد في واجهة المتجر أو صفحات المنتج وبيانات SEO؛ هذه الدفعة تفعّل طبقة البحث فقط، وتحتاج بقية واجهة locale قبل اعتبار التعدد اللغوي مكتملاً.
- لم يتم تعديل Prisma schema أو تشغيل migrations أو الاختبارات أو build؛ التحقق الشامل مؤجل إلى نهاية مرحلة البناء.

- أُكمل ربط واجهة البحث بتمرير اللغة من معامل الرابط `?lang=...` إلى API؛ لا يُفترض اختيار لغة تلقائيًا ولا تتغير اللغة الأساسية عند غياب المعامل أو عدم صلاحيته.

- أُضيف دعم اللغة نفسها إلى API تفاصيل المنتج `POST /api/showPostById` وصفحة المنتج؛ عند فتح رابط المنتج مع `?lang=...` تُعرض الترجمة المتاحة، وإلا يبقى العنوان والوصف الأصليان. صفحات المنتجات التجريبية المحلية لا تزال تستخدم بياناتها الثابتة.
=======
### Goal
Support shipping, billing, and regional address data for a global customer base.

### Prisma models
- UserAddress

### Functional scope
- Address book
- Add/edit/delete address
- Default address selection
- Shipping and billing management
- International address handling
- Phone, postal code, and geolocation support

### Acceptance criteria
- Customers can manage addresses reliably.
- Orders can select valid shipping and billing data.
- Address data is consistent across checkout and order history.

### Dependencies
- Phase 1
- Phase 2

### Enables
- Seller onboarding, cart flows, checkout, order creation

---

## Phase 4: Sellers and marketplace onboarding

### Goal
Create the seller ecosystem and administrative marketplace controls.

### Prisma models
- Seller
- SellerVerification
- SellerDocument
- SellerTaxRegistration
- Store
- StoreTranslation
- SellerStaff

### Functional scope
1. Seller homepage
2. Sales analytics
3. Store management
4. Product management
5. Order management
6. Store reviews and customer chats
7. Staff management and permissions
8. KYC and document uploads
9. Tax registrations
10. Earnings, commissions, payouts, and payment methods
11. Financial reports
12. Admin review and approval

### Administrative capabilities
- Review onboarding requests
- Approve or reject sellers
- Suspend stores when needed
- Review verification documents and tax registration
- Manage seller staff access and permissions
- Monitor seller performance

### Acceptance criteria
- Sellers can register, verify, and manage stores.
- Admins can review and approve sellers.
- Store ownership and seller permissions are enforced.

### Dependencies
- Phase 1
- Phase 2
- Phase 3

### Enables
- Catalog management, product listing, seller dashboards, commission logic

---

## Phase 5: Catalog and products

### Goal
Build the product foundation and support multi-variant merchandising.

### Prisma models
- Category
- CategoryTranslation
- Brand
- BrandTranslation
- Product
- ProductCategory
- ProductTranslation
- ProductMedia
- AttributeDefinition
- AttributeTranslation
- ProductAttribute
- ProductAttributeValue
- ProductVariant
- VariantAttribute
- ProductIdentifier
- ProductPrice

### Functional scope
- Category tree management
- Product listing and all-products pages
- Featured, best-selling, new, and discounted products
- Product details and gallery
- Brand and category associations
- Dynamic attributes per category
- SKU, barcode, inventory, and price per variant
- Related and suggested products

### Variant requirements
Each variant must have its own SKU, price, inventory, and attributes.
Examples:
- storage size
- color
- clothing size
- weight or dimension

### Dynamic attribute requirements
- Category-specific attributes should not be hardcoded for every category.
- Example: phones use RAM/storage; clothing uses size/material.
- Link filters to `AttributeDefinition` and `ProductAttributeValue`.

### Acceptance criteria
- Products can be created and managed reliably.
- Variants are tracked and priced independently.
- Dynamic filters work for multiple category types.

### Dependencies
- Phase 4

### Enables
- Search, storefront, cart, checkout, and inventory

---

## Phase 6: Search and filtering

### Goal
Make it easy for users to discover the correct products and sellers.

### Prisma models
- Product
- ProductVariant
- Category
- Brand
- ProductPrice
- ProductAttribute
- SearchSynonym

### Functional scope
- Search bar and suggestions
- History and auto-complete
- Search by name, brand, category, and SKU
- Synonym support and typo tolerance
- Multi-language term handling
- Results page with counting and pagination
- Filters for price, category, brand, rating, discounts, availability, seller, origin, and attributes
- Sorting options: relevance, newest, price, rating, best-selling

### Requirements
- Filters must work together.
- Filter state must be shareable via URL.
- Pagination must preserve state.
- Search and filter logic must work across localized content.

### Acceptance criteria
- Search results are relevant and stable.
- Filter combinations work without state loss.
- Customers can navigate result pages without losing selected criteria.

### Dependencies
- Phase 5

### Enables
- Storefront UX, product discovery, and conversion flows

---

## Phase 7: Storefront UX and homepage

### Goal
Deliver the customer-facing storefront and marketing experience.

### Functional scope
- Announcement bar
- Premium header and navigation
- Logo and brand area
- Country/currency selector
- Search bar
- Account, wishlist, and cart entry points
- Category menu and hero sections
- Featured banners and offers
- Product card layouts and quality imagery
- New arrivals and best sellers
- Daily deals and limited-time campaigns
- Brands and featured stores
- Newsletter and footer sections
- Dedicated pages for all products, categories, brands, stores, offers, and search

### Requirements
- Luxury e-commerce aesthetic
- Mobile-first and desktop-friendly layout
- Arabic/English plus RTL/LTR support
- Unified design system
- Skeleton loading and smooth transitions
- Rebuild the visual structure without losing existing functionality

### Acceptance criteria
- The storefront is polished, responsive, and working across languages.
- Users can navigate the product ecosystem without friction.
- The homepage is connected to real product data, not dummy data.

### Dependencies
- Phase 5
- Phase 6

### Enables
- Cart, checkout, and conversion flows

---

## Phase 8: Cart and guest checkout

### Goal
Allow customers to collect products before purchase and complete a guest checkout where needed.

### Prisma models
- GuestSession
- Cart
- CartItem

### Functional scope
- Cart page and cart drawer
- Add to cart
- Update quantity
- Remove item
- Total calculation
- Guest checkout
- Checkout continuation after login
- Cart merge for authenticated users

### Requirements
- Inventory validation
- Price validation at purchase time
- Prevent duplicate identical cart entries
- Prevent unavailable quantities
- Preserve cart state across devices for authenticated users
- Support multi-vendor carts
- Correct currency handling

### Acceptance criteria
- Customers can add, modify, and proceed with a valid cart.
- Inventory and price safeguards prevent invalid purchases.
- Guest carts merge correctly after login.

### Dependencies
- Phase 3
- Phase 5
- Phase 7

### Enables
- Orders and checkout completion

---

## Phase 9: Checkout and orders

### Goal
Turn a cart into a valid commercial transaction.

### Prisma models
- Order
- OrderAddress
- VendorOrder
- OrderItem
- OrderStatusHistory

### Functional scope
- Checkout page
- Address selection
- Shipping method selection
- Order review
- Confirmation and success page
- Order history and details
- Order tracking
- Cancellation logic when allowed

### Important rules
- Customer checkout from 3 sellers must create one customer order and vendor-specific suborders.
- Product snapshotting is required for price, name, seller, image, and attributes so later modifications do not break historical invoices or records.

### Order statuses
- New
- Accepted
- Processing
- Shipped
- Completed
- Cancelled

### Acceptance criteria
- Orders are created with correct addresses, totals, and seller-level breakdowns.
- Order history and status transitions work reliably.
- Historical order details remain stable even if product information changes.

### Dependencies
- Phase 3
- Phase 5
- Phase 8

### Enables
- Payment, inventory reservation, shipping, commission logic, invoicing

---

## Phase 10: Payments

### Goal
Handle payment processing safely and reliably.

### Prisma models
- PaymentProvider
- Payment
- PaymentAttempt
- Refund
- PaymentReconciliation
- Dispute
- DisputeEvidence

### Functional scope
- Payment methods
- Provider setup
- Payment page
- Payment history
- Failed and pending attempts
- Refund requests and management
- Payment disputes and evidence
- Reconciliation

### Requirements
- Provider-independent adapter pattern
- Support success/failure/pending states
- Verify status using provider webhooks
- Prevent duplicate payments
- Support full/partial refunds
- Log every financial change
- Never mark an order as paid just because a user returned to a success page

### Acceptance criteria
- Payment cannot be falsely marked as successful.
- Refunds and disputes are traceable.
- Provider events are verified, not assumed.

### Dependencies
- Phase 9

### Enables
- Inventory deduction, accounting, payouts, tax finalization, and reconciliation

---

## Phase 11: Inventory and warehouses

### Goal
Ensure product availability and safe stock movement.

### Prisma models
- Warehouse
- Inventory
- InventoryMovement
- InventoryReservation
- StockTransfer
- StockTransferItem

### Functional scope
- Warehouse management
- View inventory by product and variant
- Inventory movement logging
- Reservation and release
- Low-stock alerts
- Stock transfer between warehouses
- Receiving inventory
- Reports

### Requirements
- Increase/decrease stock correctly
- Reserve stock on order
- Release reserved stock on expiration or cancellation
- Deduct on successful sale per policy
- Maintain an audit trail
- Prevent double-selling during concurrent orders

### Acceptance criteria
- Inventory is accurate at all times.
- Orders reserve stock correctly.
- Concurrent sales do not over-deduct inventory.

### Dependencies
- Phase 5
- Phase 9

### Enables
- Procurement, shipping, order completion, and financial reporting

---

## Phase 12: Procurement

### Goal
Replenish inventory via suppliers while keeping auditability.

### Prisma models
- Supplier
- SupplierProduct
- PurchaseOrder
- PurchaseOrderItem
- GoodsReceipt
- GoodsReceiptItem

### Functional scope
- Supplier management
- Purchase order creation
- Goods receipt logging
- Receiving workflows
- Procurement reports

### Requirements
- Received goods must be linked to inventory after verification.
- Every procurement movement must maintain an audit trail.

### Acceptance criteria
- Purchases replenish stock in a controlled and traceable way.
- Procurement actions are linked to warehouse inventory outcomes.

### Dependencies
- Phase 11

### Enables
- Accurate replenishment and operational performance reporting

---

## Phase 13: Accounting and commissions

### Goal
Build the financial backbone for the marketplace.

### Prisma models
- LedgerAccount
- JournalEntry
- JournalLine
- SellerLedgerEntry
- CommissionRule
- CommissionTransaction
- PayoutMethod
- Payout

### Functional scope
- General financial dashboard
- Chart of accounts
- Journal entries and journal lines
- Commission rules and calculations
- Seller payouts and payout requests
- Transaction logs
- Financial reporting

### Requirements
- Total sales, commissions, net profit, balances, and payout states must be calculated from real data.
- Use double-entry accounting.
- Never edit posted entries directly; use reversing entries for corrections.

### Acceptance criteria
- Financial records are consistent.
- Seller commissions are calculated correctly.
- Payouts are linked to real ledger entries and payment history.

### Dependencies
- Phase 9
- Phase 10
- Phase 11

### Enables
- Taxes, payouts, and financial visibility

---

## Phase 14: Taxes and customs

### Goal
Calculate taxes and customs obligations correctly for regional and seller-specific commerce.

### Prisma models
- TaxRegion
- TaxRate
- TaxLine
- CustomsDeclaration
- CustomsDeclarationItem

### Functional scope
- Tax region and tax rate configuration
- Country-specific rules
- Order-level tax calculation
- Tax invoice management
- Customs declaration tracking

### Requirements
- Use taxes based on country, region, product type, and active policy at the time of order creation.
- Do not use a single flat global tax rate.

### Acceptance criteria
- Tax totals are consistent with the order context.
- Customs-related flows are documented and traceable.

### Dependencies
- Phase 9
- Phase 13

### Enables
- Finalized order financial accuracy and compliance

---

## Phase 15: Shipping and tracking

### Goal
Fulfill customer orders across one or many shipments and sellers.

### Prisma models
- ShippingCarrier
- ShippingService
- ShippingZone
- ShippingRate
- Shipment
- Package
- PackageItem
- ShipmentItem
- ShipmentTrackingEvent

### Functional scope
- Carrier and shipping service setup
- Zone and rate calculation
- Create shipment and packages
- Add tracking numbers
- Shipment status updates
- Delivery tracking

### Requirements
- Support split shipments within one order.
- Support orders that include multiple sellers and products.

### Acceptance criteria
- Orders can be shipped in a valid, trackable way.
- Tracking updates are tied to shipments, not guesswork.

### Dependencies
- Phase 9
- Phase 11

### Enables
- Delivery completion, return workflows, and commission finalization

---

## Phase 16: Returns

### Goal
Handle returns and refund workflows correctly and safely.

### Prisma models
- ReturnRequest
- ReturnItem

### Functional scope
- Return request creation
- Reason selection
- Evidence upload
- Return status tracking
- Seller review and admin review
- Return receipt confirmation
- Refund linking

### Requirements
- Validate returned quantity against purchased and previously returned quantities.

### Acceptance criteria
- Returns do not exceed actual orders or prior returns.
- Refunds are linked to valid return data.

### Dependencies
- Phase 9
- Phase 10
- Phase 15

### Enables
- Customer trust, support handling, and financial correction flows

---

## Phase 17: Promotions, coupons, and loyalty

### Goal
Create acquisition and retention mechanics while keeping validation server-side.

### Prisma models
- Promotion
- Coupon
- CouponRedemption
- PromotionProduct
- PromotionCategory
- PromotionSeller
- LoyaltyProgram
- LoyaltyTransaction
- GiftCard
- GiftCardTransaction

### Functional scope
- Offer pages and offer details
- Coupon input
- Gift card flow
- Loyalty programs and points history
- Product/category/seller promotions
- Usage limits

### Requirements
- Validate coupons and discounts on the server.
- Do not trust browser-side discount logic.

### Acceptance criteria
- Discounts do not bypass validation.
- Promotions are correctly attached to products, categories, or sellers.

### Dependencies
- Phase 5
- Phase 9

### Enables
- Conversion optimization and retention programs

---

## Phase 18: Reviews and support

### Goal
Build trust, service, and recommendation systems without mixing support with commerce chat.

### Prisma models
- Review
- ReviewMedia
- StoreReview
- Favorite
- Recommendation
- ProductQuestion
- ProductAnswer
- SupportTicket
- SupportMessage
- StoreConversation
- StoreMessage

### Functional scope
- Wishlist
- Product and store reviews
- Review media
- Q&A
- Product recommendations
- Help center
- User support tickets
- Support messaging
- Customer-seller chat

### Requirements
- Link reviews to actual purchases.
- Prevent duplicate reviews of the same product per schema rules.
- Keep customer-seller conversations separate from platform support tickets.

### Acceptance criteria
- Reviews are valid and connected to genuine purchase history.
- Support and chat flows remain separated and manageable.

### Dependencies
- Phase 5
- Phase 9
- Phase 17

### Enables
- Customer trust, retention, and support operations

---

## Phase 19: Invoices

### Goal
Provide reliable historical financial documents.

### Prisma models
- Invoice
- InvoiceItem
- CreditNote

### Functional scope
- My invoices
- Invoice detail pages
- PDF download
- Order invoices
- Credit notes
- Admin invoice management

### Requirements
- Preserve invoice history exactly.
- Do not mutate historical invoice records when products or sellers change later.

### Acceptance criteria
- Historical invoices remain stable and audit-ready.
- Credit notes and invoice records match real order data.

### Dependencies
- Phase 9
- Phase 10
- Phase 13

### Enables
- Finance operations and customer transparency

---

## Phase 20: Notifications, CMS, and settings

### Goal
Provide operational communication, content management, and platform config.

### Prisma models
- Notification
- AuditLog
- SitePage
- SitePageTranslation
- MarketplaceSetting
- FeatureFlag

### Functional scope
- Notification center
- Order, payment, shipping, and seller notifications
- About us, privacy, terms, and return policy pages
- CMS content management
- Platform settings and feature flags
- Admin audit logs

### Requirements
- Content must be manageable from the admin dashboard.
- Content must support translation.

### Acceptance criteria
- Customers receive relevant notifications.
- Admin settings are configurable and auditable.

### Dependencies
- Phase 1
- Phase 9
- Phase 19

### Enables
- Platform consistency and operational coverage

---

## Phase 21: Integrations and webhooks

### Goal
Connect external systems without exposing secrets or breaking operations.

### Prisma models
- Webhook
- WebhookDelivery
- Integration

### Functional scope
- Integration management
- Keys and credentials setup
- Webhook configuration
- Event selection
- Delivery logs
- Retry logic
- Signature verification
- Secret protection

### Requirements
- Never store integration secrets in plaintext.
- Never send secrets to the frontend.
- Verify webhook signatures before processing.

### Acceptance criteria
- Third-party integrations work securely and consistently.
- Failed external deliveries are traceable and retryable.

### Dependencies
- Phase 9
- Phase 10
- Phase 20

### Enables
- Reliable ecosystem integrations and scalable automation

---

## Phase 22: Background jobs

### Goal
Scale operations with reliable asynchronous processing.

### Prisma models
- OutboxEvent
- BackgroundJob

### Functional scope
- Background email sending
- Webhook processing
- Order status changes
- Inventory reservation expiration
- Notification dispatch
- Integration sync tasks
- Retry failed jobs

### Requirements
- Use transactional outbox patterns.
- Ensure events tied to a database transaction are not lost.
- Prevent duplicate event execution.

### Acceptance criteria
- Background jobs complete reliably.
- Event-driven tasks survive transaction boundaries.

### Dependencies
- Phase 9
- Phase 20
- Phase 21

### Enables
- Reliable platform operations at scale

---

## Phase 23: Analytics and reports

### Goal
Provide a trustworthy operational and financial view of the business.

### Prisma models
- Report
- DailySiteVisit
- SearchSynonym
- NewsletterSubscriber

### Functional scope
- Sales and order analytics
- AOV, revenue, seller performance, and category performance
- Search metrics
- Site visits
- Newsletter activity and subscriber management
- Reporting export

### Requirements
- Reports must use real data.
- No hardcoded or dummy values in production.

### Acceptance criteria
- Business reports accurately reflect real platform operations.
- Leaders can track growth and operational health from the system itself.

### Dependencies
- Phase 9
- Phase 10
- Phase 11
- Phase 13

### Enables
- Operational decision-making and performance tuning

---

## Phase 24: Real estate module

### Goal
If real estate remains in scope, treat it as a separate module rather than a core e-commerce flow.

### Prisma models
- Property
- PropertyMedia
- PropertyTranslation
- PropertyWishlist
- BookingRequest

### Functional scope
- Listings
- Details
- Images
- Categories
- Price and location search
- Wishlist
- Booking requests
- Seller property management
- Admin property management

### Requirements
- Keep it isolated from the commerce loop.
- Avoid entangling it with orders, inventory, cart, or marketplace flows unless business logic explicitly requires it.

### Acceptance criteria
- Real estate functionality can run independently without destabilizing the commerce platform.

### Dependencies
- Independent module

---

## Critical conflict resolution and migration discipline

The README calls out a critical conflict that must be resolved before execution:

- The global schema uses `UUID` for `Category.id`.
- The legacy project used numeric category IDs and other schema assumptions.
- These differences must be reviewed before migration.

### Mandatory rules
1. Treat `prisma/schema.prisma` as the final operational schema only after reviewing the merged global schema.
2. Do not use an alternate root schema file as the live source of truth.
3. Do not replace old category IDs or other legacy identifiers without database and UI dependency review.
4. Do not run destructive commands against the real database.
5. Use a dedicated test database before schema or migration work.
6. Prepare sequential, reviewable migrations.
7. Confirm every relation and foreign key matches the application code.

---

## Definition of done

A phase is not complete because pages exist. A phase is complete only when all of the following are true:

- All pages function without errors.
- All buttons trigger real working actions.
- All forms validate and persist data properly.
- All APIs work as intended.
- All operations use the actual database.
- Permissions are enforced on the server.
- No dummy data exists in production.
- No duplicate components or logic are left behind.
- Terminal output and browser console are clean.
- Automated tests pass.
- The UI works on mobile and desktop.
- Arabic/English and RTL/LTR are supported correctly.
- Performance is acceptable for expected scale.

---

## End-to-end workflow validation

Every phase must be checked in context, not only in isolation. The required workflow below is the minimum benchmark for production readiness:

Add Product → Create Variant → Set Price → Add Inventory → Show in Search → Add to Cart → Create Order → Payment → Reserve & Deduct Inventory → Create Shipment → Deliver Order → Calculate Seller Commission

This full flow must work with real data, correct permissions, real validations, and real database state.

---

## Recommended execution pattern

To keep the project reliable, execute in this order:

1. Architecture and schema review
2. Prisma and database foundation
3. Users and permissions
4. Currencies, countries, and addresses
5. Sellers and stores
6. Categories, products, and variants
7. Search and filtering
8. Homepage and storefront UX
9. Cart and guest checkout
10. Orders
11. Payments
12. Inventory and warehouses
13. Suppliers and procurement
14. Accounting and commissions
15. Taxes and customs
16. Shipping and tracking
17. Returns
18. Promotions and loyalty
19. Reviews and support
20. Invoices
21. Settings, notifications, and CMS
22. Integrations and webhooks
23. Background jobs
24. Reports and analytics
25. Real estate (only if explicitly required)

This plan keeps the system coherent, maintainable, and production-safe.
>>>>>>> wael-work-in-progress
