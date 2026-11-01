Here is a comprehensive structural plan for building a global, multi-vendor e-commerce platform similar to Amazon or Etsy. The architecture is divided into four main pillars: **Customer Storefront**, **Seller Dashboard**, **Admin Backend**, and **Core Global Features**.

---

### 1. Customer-Facing Pages (The Storefront)
These are the pages visible to buyers browsing and purchasing products.

*   **Homepage:** The main landing page featuring personalized product recommendations, trending items, promotional banners, and main category navigation.
*   **Search & Category Pages:** Advanced search results with dynamic filtering (price, brand, rating, location), sorting options, and breadcrumb navigation.
*   **Product Detail Page (PDP):** The core conversion page. Includes high-res image galleries, detailed descriptions, specifications, "Add to Cart/Buy Now" buttons, seller information, shipping estimates, and customer reviews.
*   **Shopping Cart:** A summary page showing selected items, quantities, price breakdown (subtotal, taxes, shipping), and promo code application.
*   **Checkout Page:** A streamlined, multi-step (or single-page) process for entering shipping details, selecting delivery speed, choosing a payment method, and reviewing the final order. Includes a "Guest Checkout" option.
*   **User Account Dashboard:** A centralized hub for buyers to manage their profile, view order history and tracking, manage saved addresses, store payment methods, and access their Wishlist.
*   **Seller Public Storefront:** A customizable mini-website for each vendor (like an Etsy shop) showcasing their brand story, all their products, and their overall seller rating.
*   **Help & Support Center:** Contains FAQ, order tracking tools, return/refund policies, and a ticketing system to contact customer support.

---

### 2. Seller/Vendor-Facing Pages (The Marketplace Engine)
These pages allow third-party vendors to manage their business on your platform.

*   **Seller Onboarding & Verification:** A step-by-step registration process requiring business details, tax information, and identity verification (KYC) to prevent fraud.
*   **Seller Dashboard:** The main hub showing key metrics: total sales, recent orders, pending payouts, and store performance health.
*   **Product Management (Inventory):** Tools to add, edit, or delete product listings. Includes bulk upload via CSV, inventory stock tracking, and variant management (size, color).
*   **Order Management:** A dedicated view to see incoming orders, update shipping status, print shipping labels, and handle return/cancellation requests.
*   **Financial & Payout Center:** A ledger showing transaction history, platform commission fees deducted, net earnings, and scheduled payout dates to the seller’s bank account.
*   **Seller Analytics:** Data visualization tools showing traffic sources, conversion rates, and best-selling items to help vendors optimize their shops.

---

### 3. Admin-Facing Pages (The Control Center)
These are restricted pages for platform owners and staff to manage the entire ecosystem.

*   **Super Admin Dashboard:** High-level overview of platform health, including total Gross Merchandise Value (GMV), total users, active sellers, and daily revenue.
*   **User & Seller Management:** Tools to view, verify, suspend, or ban buyer and seller accounts. Includes a dispute resolution center for conflicts between buyers and sellers.
*   **Product Moderation:** A queue to review and approve/reject new product listings to ensure they comply with platform policies (e.g., no counterfeit or prohibited items).
*   **Financial Management:** Settings to adjust platform commission rates, approve manual payouts, process platform-wide refunds, and generate tax reports.
*   **CMS (Content Management System):** A tool to manage homepage banners, blog posts, legal pages (Terms of Service, Privacy Policy), and global promotional campaigns.

---

### 4. Core Global Features & Infrastructure
These are the underlying systems and features that make the platform "global" and scalable like Amazon or Etsy.

*   **Multi-Vendor Architecture (Split Payments):** The system must automatically split a single payment: taking the platform’s commission fee and routing the rest to the specific seller’s escrow account.
*   **Internationalization (i18n) & Localization:** 
    *   *Multi-language support:* Auto-detecting user location to serve the correct language.
    *   *Multi-currency support:* Displaying prices in the user’s local currency with real-time exchange rates.
    *   *Regional Rules:* Dynamic calculation of local taxes (VAT/GST) and shipping costs based on the buyer’s and seller’s locations.
*   **Advanced Search & Discovery:** Integration with engines like Elasticsearch or Algolia to provide lightning-fast search, typo tolerance, autocomplete, and AI-driven "Customers who bought this also bought" recommendations.
*   **Secure Messaging System:** An internal chat system allowing buyers and sellers to communicate about custom orders or issues *without* revealing personal email addresses or phone numbers (preventing platform leakage).
*   **Review & Rating System:** A robust, verified-purchase-only review system allowing text, star ratings, and photo/video uploads. Includes separate ratings for the *product* and the *seller*.
*   **Security & Fraud Prevention:** SSL encryption, Two-Factor Authentication (2FA) for sellers/admins, DDoS protection, and AI-driven fraud detection to flag suspicious transactions or fake reviews.
*   **Scalable Cloud Infrastructure:** Use of CDN (Content Delivery Network) for fast global image loading, microservices architecture (e.g., separating the search service from the payment service), and auto-scaling databases to handle traffic spikes (like Black Friday).

---

### Recommended Tech Stack (For Context)
*   **Frontend:** Next.js or React (for fast, SEO-friendly server-side rendering).
*   **Backend:** Node.js, Python (Django/FastAPI), or Go (for high-concurrency microservices).
*   **Database:** PostgreSQL (for relational data like users/orders) + Redis (for caching) + Elasticsearch (for search).
*   **Payments:** Stripe Connect or PayPal Marketplace (specifically designed for multi-vendor split payments).
*   **Hosting:** AWS, Google Cloud, or Vercel. 

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
| DOC-02 | P2 | `CRITICAL_FIXES_PHASE1.md`, `project-structure.txt`, and `testData.json` are empty tracked files. | Populate only if still needed; otherwise remove them in a separate cleanup change. Do not treat the empty critical-fixes file as a completed plan. |
| DOC-03 | P2 | `DEBUG_README.md` contains only a report heading and no usable findings or reproduction steps. | Move actionable findings into this README or a linked issue log, and remove the empty placeholder once references are checked. |
| CI-01 | P1 | **Fix prepared on this audit branch:** `.github/workflows/quality.yml` now includes a `push` trigger for `main` in addition to pull requests and manual dispatch. | Confirm the updated workflow completes successfully on this PR and on a subsequent push to `main` after merge. |
| TEST-01 | P1 | **Partially addressed on this audit branch:** `tests/search-database.integration.test.mjs` now starts a Next.js dev server against the isolated PostgreSQL test database and exercises `POST /api/search` plus `GET /api/search/suggestions` over HTTP for combined filters, response shape, and hidden-product exclusion. Rate limiting, malformed/oversized route requests, rating filters, and broader pagination/sorting HTTP cases still need coverage. | Extend route-level tests for malformed and oversized bodies, unavailable rating tables, rating filters, pagination boundaries, and rate-limit behavior. |
| SEARCH-01 | P1 | The shared search sort definitions did not include a unique final tie-breaker for products sharing the same price, sales count, or creation timestamp. Offset pagination could therefore reorder equal-key products between requests. | Added `id ASC` as the final key for each supported sort and added `tests/search-query.test.mjs`; verify CI passes. Full route-level coverage remains a separate gap. |
| SEC-01 | P2 | **Partially addressed on this audit branch:** `app/api/reviews/route.ts` uses the shared bounded JSON reader (16 KiB) and the durable `review-write` limiter (10 writes per 10 minutes per client + authenticated user). Code search also found direct `request.json()` parsing in seller product/store, admin settings/approval, messages, and bookings routes. | Verify review rate limiting with configured Upstash/proxy settings; inventory and harden remaining mutation routes using bounded parsing where appropriate. Confirm ingress limits too. |
| IMG-01 | P2 | `next.config.js` permits remote images from any HTTPS hostname through `hostname: '**'`. This is broader than an explicit provider/domain allowlist and can permit unintended remote image sources. | Replace the wildcard with the real image hosts used by the project (including the configured image provider), then test all existing product/profile/store image URLs before deployment. |
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
- [x] Add deterministic `id ASC` tie-breakers to search sorting and unit tests for sort order and core filters (CI verification pending).
- [ ] Inspect the target database before the favorites table rename migration; confirm its timestamp and starting-state assumptions.
- [ ] Apply and verify rating migrations in the intended environment; exercise product and store rating APIs.
- [x] Add bounded body parsing (16 KiB) and durable rate limiting to review writes; CI verification pending.
- [ ] Add route-level search/suggestion tests and run them against PostgreSQL.
- [ ] Exercise Stripe test-mode lifecycle and stock/order consistency, including retries and duplicate events.
- [ ] Complete server-side authorization checks for admin/seller mutations and upload endpoints.

### Phase C — Reliability, performance and UX
- [ ] Replace wildcard image hosts with an explicit allowlist and validate existing media.
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
| Review POST body limit and write rate limit | Implemented on audit branch; latest CI run pending after adding the durable `review-write` policy |
| Stable search sort and route-level coverage | Unit sorting tests passed in CI run [41338563737](https://github.com/waelkamira/Akaar/actions/runs/41338563737). Actual HTTP route tests passed in the later integration step, but the subsequent production build failed because Next dev output remained in `.next`; test cleanup now removes that generated cache before build. Re-run CI to verify. |
| Static inspection of project configuration, active Prisma schema, migration workflow, search route, review route, Stripe webhook and selected tests | Completed for this first pass |
| Unit tests on audit branch | Passed in CI run [41338563737](https://github.com/waelkamira/Akaar/actions/runs/41338563737) on commit `07ea037` |
| ESLint on audit branch | Passed in CI run [41338563737](https://github.com/waelkamira/Akaar/actions/runs/41338563737) on commit `07ea037` |
| Production build on audit branch | Passed in CI run [41338563737](https://github.com/waelkamira/Akaar/actions/runs/41338563737) on commit `07ea037` |
| Clean PostgreSQL migration run against current `main` | Not run on `main` because the fixes are not merged yet. On audit commit `07ea037`, the full migration chain deployed to clean PostgreSQL and the schema-drift check passed in CI run [41338563737](https://github.com/waelkamira/Akaar/actions/runs/41338563737). |
| Search/filter route-level integration tests | Gap identified; not yet added |
| Production deployment/database/payment configuration | Not accessible / not verified |

**Rule for future updates:** move an item to “fixed” only after a code change and the relevant test pass are recorded with the commit SHA. Keep unresolved findings visible; do not mark a feature operational just because a page or schema model exists.
