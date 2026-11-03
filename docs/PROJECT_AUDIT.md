# Project Audit

**Status:** README Phase 0 done; README Phase 1 is next. Schema-to-migration drift comparison remains outstanding.  
**Date:** 2026-11-02  
**Repository:** Akaar  
**Canonical database contract:** `prisma/schema.prisma`

## Executive summary

Akaar is a Next.js App Router application with customer, seller, admin, catalog, property, messaging, and CMS surfaces. It has a substantial normalized PostgreSQL/Prisma domain model, but most existing commerce handlers still use an older, denormalized product, user, order, and payment shape. The current checkout and catalog implementations therefore are not integrated with the canonical schema. Do not treat the existence of these routes as evidence that those workflows work against the active schema.

The immediate risk is contract drift, not a lack of domain models: the canonical schema already describes normalized products/variants/prices/inventory, multi-vendor orders, payments, fulfillment, accounting, and supporting domains. Application code must be mapped and migrated to that contract rather than extending it to match legacy queries.

At the time of the initial audit baseline, no application code, schema, migration, or database was changed. The `.env` contents were not inspected; Next.js reported loading `.env` during the build. Repository documentation was inconsistent about whether a legacy database was configured and whether any production database existed; the target database had to be clarified before database operations. The later execution below records the authorized database work.

## Latest execution update

- The user confirmed that the configured PostgreSQL target is a dedicated, disposable test database and authorized its initialization and recreation.
- The active initial migration was applied to that empty database; `prisma migrate status` reports the schema is up to date. Demo seed data was restored (200 products, 5 demo sellers).
- `prisma validate`, `prisma generate`, the production build, and the unit suite pass (150 tests: 147 passed, 3 skipped). The initial build failure caused by missing tables is resolved on this database.
- `verify:prisma-env` now loads `.env` and treats Docker as optional when a PostgreSQL URL is configured. Docker Desktop's engine remains unavailable.
- Server-rendered page queries were moved behind domain repositories, and ESLint enforces the no-direct-Prisma boundary for UI modules. API route handlers remain server-side entry points; their domain logic is still being migrated incrementally.
- A separate shadow database URL is not configured, so migration-to-schema drift comparison remains outstanding.
- Authentication and authorization implementation is the next roadmap phase; it has not been declared complete.

## Repository map

The inventory contained 463 files outside generated/dependency directories. Major application areas include 155 files under `app/`, 92 reusable components, 46 files under `lib/`, 12 feature files, and 28 test files.

| Area | Location | Responsibility and dependencies |
|---|---|---|
| Routes and pages | `app/` | App Router pages, layouts, route handlers, and customer/seller/admin interfaces. Route handlers commonly call Prisma directly and use shared `lib/auth`, `lib/api`, and domain helpers. |
| Shared presentation | `components/` | Navigation, product/category UI, forms, upload, reviews, newsletter, and reusable controls. Components consume contexts and call API routes. |
| Feature state | `features/` | Auth, cart, search, account, catalog, orders, and seller namespaces. Auth, cart, and search contain client contexts; several feature entry points are empty. |
| Shared services | `lib/` | Prisma singleton, auth/session checks, input validation, query construction, rate limiting, payments, uploads, review summaries, site content, and marketplace settings. |
| Persistence | `prisma/` | Canonical schema, one active initial migration, legacy migration backups, seed script, and guarded legacy-repair/preflight SQL. |
| Verification | `tests/`, `scripts/`, `.github/workflows/` | Node test-runner unit tests, opt-in PostgreSQL search integration tests, local database helper scripts, and CI checks. |
| Static assets and styling | `public/`, `styles/`, `app/globals.css`, Tailwind config | Product/site assets, global styling, and utility-class design tokens. |

### Data flow

The intended request path is browser UI -> Next.js page or API route -> auth/validation/domain helpers -> `lib/db/prisma.js` -> Prisma Client -> PostgreSQL. The active implementation often skips a domain/data-access layer and queries Prisma directly in route handlers. The cart is held in browser local storage and submits item identifiers and quantities to `/api/orders`; that handler currently recalculates totals and checks stock server-side, but uses fields absent from the canonical schema.

## Canonical schema and domain mapping

The complete schema contains 136 models and 31 enums across identity/access control; currencies, countries, and locations; sellers, KYC, stores, and staff; catalog, translations, attributes, and variants; warehouses, inventory, reservations, and procurement; carts and guest sessions; orders and vendor orders; payments, refunds, and disputes; double-entry accounting, commissions, and payouts; tax/customs; shipping and returns; promotions, coupons, loyalty, and gift cards; reviews, favorites, questions, support, and store messaging; invoices/credit notes; a separate property/booking domain; notifications, audit logs, CMS, integrations, webhooks, background jobs, analytics, search synonyms, and newsletters.

| Schema domain | Existing application surface | Audit observation |
|---|---|---|
| User, session, roles, permissions, OAuth, reset tokens | `lib/auth/`, `app/(auth)/`, `/api/auth`, `/api/register`, account/admin routes | Authentication exists, but several handlers use legacy scalar fields rather than the canonical user and role relations. |
| Seller, verification, store, staff | `app/seller/`, `/api/seller/`, `/api/shop/`, admin seller/store surfaces | Seller onboarding, store, dashboard, product, and order routes exist; their data shape must be reconciled with `Seller`, `Store`, `SellerStaff`, and role scope. |
| Category, product, brand, variant, price, attributes, media | `/api/product`, `/api/search`, `/api/categories/`, `/api/posts`, `/api/showPostById`, catalog/product pages | The application queries an older listing shape. The canonical product is store-owned and priced/inventoried through variants and related models. |
| Cart, inventory, orders, vendor orders, payments | Cart context/page, `/api/orders`, `/api/payments/methods`, Stripe webhook, order pages, seller order routes | A checkout flow exists for the old schema, but is not compatible with canonical orders, variants, inventory, and payments. |
| Favorite, review, product questions, store review | Favorite routes/page, `components/Reviews/`, `/api/reviews`, admin review pages | Some functionality exists; coverage and canonical-schema integration need verification. The favorite-table test currently expects a migration absent from active history. |
| Messaging, support, notification | Account message/notification pages, `/api/messages`, admin control panel | Messaging and notification surfaces exist; delivery, permissions, and persistence need end-to-end verification. |
| Property and booking | `app/(shop)/properties/`, `app/(selling)/properties/`, `/api/properties/`, `/api/bookings` | A distinct property/booking domain exists in both the schema and UI; it should remain separate from product commerce. |
| Admin, CMS, settings, analytics, newsletter | `app/admin/`, `/api/admin/`, site-page, analytics, newsletter routes | Multiple management surfaces exist. Authorization and schema alignment require review before claiming complete administrative control. |
| Logistics, refunds, tax, ledger, payouts, procurement, jobs | Schema models; limited or no matching end-to-end UI/API identified in the route inventory | These domains are modeled but are not demonstrated as integrated customer/seller workflows. |

### Prisma model-to-application delegate coverage

A static scan of `app/`, `lib/`, `features/`, and `prisma/seed.js` found direct `prisma.<model>.<operation>` calls for only 23 of the 136 schema models. This is a delegate-usage inventory, not proof that the other models are never touched: raw SQL, transaction-client delegates, implicit relation includes, and external services need separate review. The schema remains the contract; no compatibility fields were inferred from legacy callsites.

| Schema domain | Models with direct Prisma delegates | Existing callsites / contract notes |
|---|---|---|
| Identity and access control | `User` | Auth options, registration, account/admin APIs, and seed. Role, permission, session, OAuth-account, token, consent, and login-attempt models have no direct delegate call in the scanned code. Existing auth still selects legacy `User.role`. |
| Globalization and locations | `Currency`, `Country` | Seed only. `ExchangeRate`, `StateProvince`, and `City` have no direct delegate call. |
| User addresses | None | `UserAddress` has no direct delegate call; checkout uses legacy address payloads. |
| Seller, KYC, and stores | `Seller`, `Store` | Seller/admin/shop APIs, pages, auth helper, and seed. `Store` is used by the seed only; most storefront routes still query `Seller`. Verification, seller documents/tax registrations, translations, and staff have no direct delegate call. |
| Catalog and product attributes | `Category`, `Product`, `ProductCategory`, `ProductMedia`, `ProductVariant`, `ProductPrice` | Product/search/category/admin/seller routes, storefront pages, sitemap, deletion helper, and seed. App routes still query legacy listing fields; canonical relations other than seed are not integrated. Brand, translations, attributes, values, identifiers, and variant attributes have no direct delegate call. |
| Inventory and warehouses | `Warehouse`, `Inventory` | Seed only. Movements, reservations, and stock transfers have no direct delegate call; no application oversell-safe canonical inventory flow was found. |
| Suppliers and procurement | None | All supplier, purchase-order, and goods-receipt models have no direct delegate call. |
| Cart and guest checkout | None | `GuestSession`, `Cart`, and `CartItem` have no direct delegate call; the current cart is client-local. |
| Orders | `Order`, `VendorOrder`, `OrderItem` | Checkout, order history/invoice, seller orders/dashboard, and admin dashboard. These calls use legacy order/item fields and lifecycle values. Order addresses and status history have no direct delegate call. |
| Payments, refunds, and providers | `Payment` | Checkout and admin dashboard. Payment attempts, providers, refunds, reconciliation, disputes, and evidence have no direct delegate call; Stripe paths remain legacy-contract code. |
| Accounting | None | Ledger, journal, commission, payout, and payout-method models have no direct delegate call. |
| Tax and customs | None | No direct delegate calls found. |
| Shipping and logistics | None | No direct delegate calls found. |
| Returns | None | No direct delegate calls found. |
| Promotions, coupons, and loyalty | None | No direct delegate calls found. |
| Reviews and product questions | None | Review UI/API surfaces exist, but review, media, store-review, favorite, recommendation, and product-question models had no direct Prisma delegate call in the scan; some routes use raw SQL. |
| Support and communication | `Notification` | Notification page and admin message/control-panel routes. Support tickets/messages and store conversations/messages have no direct delegate call. |
| Invoices and credit notes | None | Invoice page reads `Order`; invoice/credit-note models themselves have no direct delegate call. |
| Property domain | `Property`, `PropertyWishlist` | Property pages, APIs, admin, seller dashboard, and sitemap. Media, translations, and booking requests have no direct delegate call in the scan. |
| Notifications, audit, CMS, and settings | `SitePage` | Sitemap and site-page reads. `Notification` is listed under communication. Audit logs, translations, marketplace settings, and feature flags have no direct delegate call. |
| Webhooks and integrations | None | No direct delegate calls found; payment webhook handling uses a provider integration and legacy persistence. |
| Outbox and background jobs | None | No direct delegate calls found. |
| Reports, analytics, and search | `DailySiteVisit` | Analytics page-view API. `Report` and `SearchSynonym` have no direct delegate call; product search uses legacy product columns. |
| Newsletter | `NewsletterSubscriber` | Public subscribe/confirm and admin subscriber routes now use `lib/newsletter/repository.mjs` for persistence, `tokens.mjs` for token generation/hashing, and `email.mjs` for Resend delivery. |

## Existing functionality observed

- Next.js 16 App Router pages and API handlers for authentication, product/catalog search, categories, favorites, orders, seller onboarding/management, admin, messaging, property listings/bookings, reviews, newsletter, analytics, and site pages.
- NextAuth credentials and Google providers, rate-limited sign-in/registration, account status checks, and admin/seller helper functions.
- Product and search handlers include input limits, pagination, rate limiting, visibility checks, and rating summaries.
- The cart UI persists locally; checkout sends only item IDs/quantities and shipping/contact fields. The order handler independently reads prices and stock and uses a database transaction for its legacy order writes.
- Stripe webhook signature verification and sandbox-only event handling are present, but handler queries and status transitions target the legacy data model.
- The schema includes normalized marketplace, finance, inventory, shipping, tax, and operational models, with indexes, unique constraints, monetary decimals, and explicit deletion policies.
- CI is configured for Prisma checks, migrations on PostgreSQL, a search integration database, unit tests, lint, and a production build.

## Findings

Severity: **P0** blocks safe implementation against the declared contract; **P1** is a major broken/incomplete workflow; **P2** is significant quality, coverage, or operational debt.

| ID | Severity | Description / root cause | Affected files | Proposed resolution | Status / verification |
|---|---|---|---|---|---|
| AUD-001 | P0 | Application code assumes legacy `User.password`, `userImage`, `googleId`, and scalar `role`; canonical `User` instead has `passwordHash`, `imageUrl`, and role assignments/permissions. The canonical model has no matching Google-ID or password fields under the names used by current code. | `prisma/schema.prisma`; `lib/auth/options.js`; `app/api/register/route.js`; `lib/auth/require-auth.js` | In Phase One, produce a field-by-field mapping and decide how auth providers, password hashes, and scoped roles map to the declared relations. Then update auth code without inventing fields or weakening authorization. | Open. Confirmed by schema and code inspection. Authentication files are JavaScript and were not type-checked by the direct TypeScript command; runtime auth tests remain pending. |
| AUD-002 | P0 | Catalog code uses `Product.userId`, `sellerId`, `images`, `basePrice`, `stockQuantity`, `categoryId`, and `approvalStatus`. Canonical `Product` is owned by `storeId`, has `ProductStatus`, and relates to categories, media, variants, prices, and inventory. Category identifiers are UUIDs in the schema while legacy handlers parse numeric IDs. | `prisma/schema.prisma`; `app/api/product/route.js`; `app/api/search/route.js`; `lib/api/search-query.mjs`; catalog pages | Map each existing read/write to the canonical product, variant, price, inventory, media, and category relations. Add no schema compatibility fields until a documented domain gap and precise change are approved. | Open. Schema validates and Client generated; direct TypeScript checking confirms a legacy `categoryId` Product selection error in the admin product route. Runtime/catalog integration remains unverified. |
| AUD-003 | P0 | Checkout, order history, seller order, and Stripe handlers assume legacy order totals/address columns, product-linked order items, payment method/user fields, and a `PAID` order state. Canonical models use monetary `subtotal`/`grandTotal`, order addresses, variant-based order-item snapshots, a provider-backed payment, and `OrderStatus` without `PAID`. | `prisma/schema.prisma`; `app/api/orders/route.ts`; `app/api/seller/orders/route.ts`; `app/api/stripe/webhook/route.ts`; `app/(shop)/orders/` | Rebuild checkout and webhook persistence against canonical models and allowed lifecycle transitions; preserve server-side price checks, transactions, signed webhook verification, and idempotency. Never translate payment completion into an unsupported order state. | Open. Confirmed by schema and route inspection; the typed application check did not reach or report all JavaScript/route contracts, and payment integration is not declared complete. |
| AUD-004 | P1 | The repository has one active migration directory (`20261102000000_init`), while the favorite-table test had expected `20261102000000_map_favorites_table` under active migrations even though it exists only in the legacy backup. | `prisma/migrations/`; `prisma/migrations_legacy_backup/`; `tests/favorite-table-mapping.test.mjs` | Test clean-install behavior against the active initial migration and keep the historical table-rename safeguard covered as archived-history behavior. Do not restore archived migrations just to satisfy a stale path assertion. | Resolved. Updated the test to check the active lowercase table creation and separately assert the archived migration's guarded rename; the unit suite passes. |
| AUD-005 | P1 | Order creation has no demonstrated idempotency-key enforcement despite retry-sensitive stock/payment operations and the canonical schema's order/payment idempotency fields. | `app/api/orders/route.ts`; canonical `Order`/`Payment` models | Add request-level idempotency to the canonical checkout design and test repeated/concurrent submissions before enabling checkout. | Open. Code/schema inspection; duplicate-request integration tests are absent. |
| AUD-006 | P1 | The search/catalog and older posts/show-post endpoints expose overlapping listing concepts and separate query contracts. The canonical schema has product and separate property domains, but current naming/data contracts are legacy and not consistently feature-oriented. | `/api/product`, `/api/search`, `/api/posts`, `/api/showPostById`; `app/post/`, `app/posts/`, `app/search/` | Identify which routes are products, property listings, or compatibility endpoints; converge clients on canonical domain endpoints and document any retained compatibility surface. | Open. Route inventory; no route consolidation performed. |
| AUD-007 | P1 | The cart context is persisted in local storage, not a server cart; cart items are keyed by listing ID rather than product variant. A server-backed favorite API also exists alongside local favorite state, so favorite persistence paths need a single source-of-truth review. Cross-device cart persistence, variant selection, and canonical inventory validation are not implemented end to end. | `features/cart/commerce-context.jsx`; `components/ReusableComponents/SmallCard/FavoriteButton.jsx`; `app/(shop)/cart/page.jsx`; `app/api/favorite/`; `prisma/schema.prisma` cart models | Implement the canonical cart/guest-session and variant workflow after product and inventory mapping; keep client totals informational only. Reconcile local favorite cache with the server-backed API. | Open. Code and schema inspection; no browser workflow tests. |
| AUD-008 | P1 | The schema contains normalized roles/permissions and scoped role assignments, but access helpers and several route handlers inspect a legacy scalar role. This prevents the active authorization model from being reliably enforced as designed. | `prisma/schema.prisma`; `lib/auth/require-auth.js`; `lib/auth/require-seller.ts`; admin/seller APIs | Define a server-side permission policy over role assignments and seller/store scope, then verify every protected mutation and ownership boundary. | Open. Code/schema inspection; full route authorization matrix not tested. |
| AUD-009 | P2 | Architecture is mixed JavaScript/TypeScript with permissive TypeScript settings (`strict: false`, `allowJs: true`); route handlers commonly combine transport, validation, business logic, and Prisma access. Several `features/*/index.js` files are empty. | `tsconfig.json`; `app/api/`; `features/`; `lib/` | Introduce domain services/data-access boundaries incrementally after contract alignment; tighten types and remove empty entry points only when consumers are understood. | Open. Repository inventory and config inspection. |
| AUD-010 | P2 | The production build compiles but type checking reports generated-Prisma-client contract errors across admin product/store and property search/update. PostgreSQL search integration setup also fails against the canonical schema because its fixtures and query helper target legacy catalog fields. | `tsconfig.json`; project scripts; `tests/`; CI; affected admin/property/messaging/search routes | Resolve each contract mismatch as its domain is migrated; implement search integration against normalized product/category/variant/price/inventory relations during the catalog/search phases. | Open. Removed deprecated `baseUrl`, initially exposing 10 real type errors. The store-message notification error is fixed using the canonical relation and required title; the latest production build reports 9 remaining errors. The full suite passes 135 tests with 0 failures and 3 opt-in database integration tests skipped by default. The newsletter integration passes on the isolated database. Full lint exits 0 with 84 warnings. Build, direct `tsc`, and isolated search checks were executed on 2026-11-02. |
| AUD-011 | P2 | Production readiness depends on external credentials/services (Redis rate limiting and trusted proxy headers, Google OAuth, Stripe sandbox configuration, upload providers, email/SMS). No deployment smoke test or live service verification was performed. | `docs/security/durable-rate-limiting.md`; `lib/auth/options.js`; upload, newsletter, messaging, and payment routes | Maintain a per-environment configuration checklist and verify services in staging; never treat CI or local builds as evidence of deployment readiness. | Open. Documentation and code inventory only. |
| AUD-012 | P2 | Database documentation disagrees about whether a production database exists versus a configured legacy database. Applying the active migration history or repair scripts to an unknown target could be unsafe. | `docs/prisma-migration-safety-plan.md`; `docs/architecture/commerce-domain-decisions.md`; `prisma/legacy-repairs/` | Resolve the target database/environment with the owner. Use only a verified backup-restored or disposable database for Phase One checks; do not use the local `.env` database until explicitly identified. | Open. Documentation conflict confirmed; only the two new, uniquely named local Phase One databases were contacted. |
## Security, reliability, and performance notes

- Positive controls observed: authenticated user identity is rechecked against the database; several write routes validate bounded request bodies; product visibility and active-seller checks exist; checkout recalculates legacy prices/stock server-side; the Stripe webhook verifies its signature and rejects live-mode events.
- Blocking security concern: these controls are attached to a legacy schema contract. Role resolution, seller scope, and payment/order state must be revalidated against canonical relations before the workflows can be relied upon.
- Sensitive integration settings are read server-side in the inspected route handlers. The durable-rate-limit documentation explicitly requires a shared Redis service and trusted proxy configuration for production; these settings have not been verified in a deployment.
- The schema contains token/secret-bearing fields (for example OAuth tokens, two-factor secrets, and webhook secrets). Encryption, rotation, and access controls for those values were not demonstrated by the inspected application paths; assess them before production.
- Search uses server-side filters, capped page sizes, rate limits, and limited result fields. It still queries legacy denormalized product columns, and the canonical schema must be integrated before its query/index performance is meaningful.
- In-memory catalog caching is process-local; there is no evidence here of distributed invalidation. The cart is client-local. Both are operational limitations, not evidence of a current exploitable vulnerability.

## Baseline verification

The baseline results below were recorded before Phase One fixes. The Prisma schema was not changed; Phase One database checks used only the newly created test databases and the `postgres` maintenance database for permission checks/database creation.

| Command | Result |
|---|---|
| Initial `npm test` baseline | Failed: 103 passed, 1 failed, 2 skipped. The failure was `tests/favorite-table-mapping.test.mjs` reading a migration path absent from active `prisma/migrations/`. |
| `npm run lint` | Exit code 0; 84 warnings, 0 errors. |
| `npm run build` | Optimized compilation succeeded; TypeScript check failed with `TS5101` for `compilerOptions.baseUrl` at `tsconfig.json:3`. |
| `npx prisma -v` | Prisma CLI and Client are both 6.19.3; project manifests specify `^6.4.1`. |
| `npx prisma validate --schema=prisma/schema.prisma` | Passed. |
| `npx prisma generate --schema=prisma/schema.prisma` | Passed; generated Prisma Client 6.19.3. |
| `npx tsc --noEmit --ignoreDeprecations 6.0 --pretty false` | Failed with 10 generated-client type errors in admin product/store, property, and notification call sites. This diagnostic bypasses the build's initial deprecation blocker; it does not type-check JavaScript files. |
| PostgreSQL migration replay | Passed on a fresh local test database; the one active initial migration applied successfully. |
| Schema-to-migration drift | Passed on an isolated shadow database with the active PostgreSQL lockfile; exit code 0 and no non-extension DDL differences. |
| PostgreSQL search integration tests | Ran against the isolated canonical test database and failed in test setup: fixtures use a non-UUID user ID, but the canonical schema requires UUIDs. Both tests fail before their assertions. |
| Database connectivity | Verified through successful migration deployment to the two new local databases. The configured application database was not contacted. Docker CLI is present but its engine is unavailable. |

## Phase One verification results

- The canonical seed now creates 22 UUID-backed categories, five users/sellers/stores/warehouses, and 200 products across the 20 commerce categories. Real-estate and jobs categories are intentionally left without Products; those require separate domain workflows.
- The seed ran twice on the isolated database. Exact counts remained 22 categories; five sellers, stores, and warehouses; and 200 each of products, variants, prices, inventory rows, media rows, and product-category relations.
- After updating the stale favorite migration test, the then-current `npm test` passed 109 tests, with 0 failures and 2 skips. Newsletter and analytics coverage now bring the current count to 122 passing tests, with 0 failures and 3 opt-in database tests skipped by default.
- The search integration tests still fail during setup against the canonical schema because the test fixtures and search query use legacy user/product fields. They were run only against the isolated test database; align them during catalog/search implementation.
- At the initial audit checkpoint, generated-client type checking reported 10 errors. The latest build reports 9 remaining errors after fixing store-message notification persistence. Legacy JavaScript routes are outside the direct TypeScript check.

- Schema validation, Prisma Client generation, clean migration replay, and schema-to-migration drift comparison passed on the two newly created isolated PostgreSQL databases; no legacy or configured application database was contacted.
- The domain map covers all 24 schema domains. A static scan found direct delegates for 23 of 136 models and records the application callsites and the 113 models with no direct delegates in the mapping table. Raw SQL, transaction-client delegates, implicit relation includes, and external services are called out as separate review surfaces.
- Demo seed behavior and migration safety are verified without resetting or overwriting user data.
- All requested Phase One checks have been executed against the canonical schema or the two isolated databases. The tests and type/build checks still expose concrete application/schema mismatches; these are recorded as downstream implementation blockers, not hidden or treated as schema defects.
- Phase One verification is **complete**. The unconverted application contracts remain explicit work for the catalog, search, seller, property, messaging, and type-safety phases.

## Phase Two checkpoint (paused, incomplete)

- Removed the deprecated `baseUrl` option from `tsconfig.json` while preserving the `@/*` path alias. Next.js 16.4.3 completes compilation. The original 10 generated-client type errors included store-message notification persistence; the latest build reports 9 after that persistence now connects the canonical user relation and supplies the required notification title.
- Extracted newsletter HTTP handling, business orchestration, persistence, token generation/hashing, and Resend delivery into distinct route, service, repository, token, and email modules under `lib/newsletter/`. Consent-token consumption is a single conditional database update, so concurrent/replayed links cannot both be accepted. Existing response shapes and consent flow are preserved.
- Added unit coverage for token generation, service orchestration, and the Resend adapter, plus an opt-in PostgreSQL repository integration test. The isolated newsletter repository integration test passes. Analytics path normalization and route-prefix exclusions also have focused tests. Targeted ESLint reports no issues in changed newsletter and analytics test files; full lint exits 0 with 84 warnings.
- Extracted analytics daily aggregation into a service and Prisma repository while preserving same-origin, rate-limit, input-validation, excluded-path, and unavailable-table behavior. Focused tests cover UTC day boundaries, repository failures, identifier normalization, and private-route exclusions.
- Extracted store conversation creation into the messaging repository and the transactional conversation/message flow into a service. Added unit tests for transaction ordering, persisted input, and error propagation so failed writes reject the transaction.
- Extracted store-message request parsing and bounds checking into a pure validation module; tests cover input shape, trimming, and maximum field sizes.
- Extracted conversation-list persistence from the route and added service handling for table availability and user-scoped reads. Tests verify unavailable storage does not query, the authenticated user ID is passed to the repository, and read errors propagate.
- Extracted conversation participant lookup, message listing, reply transactions, and read-receipt updates from the conversation detail route into messaging repository/service modules. Tests cover unauthorized conversation reads, recipient selection, and participant-gated read receipts.
- Updated store-message notification persistence to use the canonical `Notification.user` relation and required `title`, resolving its generated-client type error.
- After these changes, `npm test` passes 135 tests (0 failures, 3 skips). Production compilation succeeds; TypeScript reports 9 remaining Prisma contract errors, with none in the analytics or messaging slices. Targeted ESLint passes for the analytics and messaging modules and tests; full lint exits successfully with 84 warnings.
- Phase Two is paused at the user's direction to begin Phase Three; it is not complete. These are tested domain vertical slices, not a completed application-wide architecture migration. A repository scan found 34 of 66 route handlers still contain direct Prisma/raw-SQL access (down from 35 before the messaging routes were fully moved behind the repository). Nine Prisma-contract errors remain.

## Phase Three checkpoint (in progress)

- Existing homepage, catalog, cart, and storefront files have concurrent user changes and are being preserved.
- Added `/products` and `/products/[id]` using canonical product, category, variant, price, media, inventory, store, and seller relations. Listing supports text search, category filtering, newest/oldest/title sorting, and stable pagination; details show active variants, latest valid prices per currency, and unreserved stock from active warehouses.
- Product details use a selectable, accessible image gallery; only resolved safe image URLs are passed into the client component.
- Seeded `ProductMedia.storageKey` values that match the bundled category assets resolve to those local images. Other supported image values are safe HTTPS URLs or local absolute paths; protocol-relative and unsupported storage keys are not rendered.
- Added a footer link so visitors can reach the canonical catalog without replacing the existing `/search` experience.
- `npm test` passes 145 tests (0 failures, 3 skipped). The catalog, CMS, and messaging focused tests pass (23 tests); targeted ESLint passes for catalog code and navigation. `npm run build` completes optimized compilation, then fails type checking on the same 9 pre-existing generated-client contract errors in admin product/store and property routes. No catalog type error was reported.
- No database-backed integration test or browser visual test has been run for these pages. The category/product pages still need runtime verification against a confirmed database and visual QA.
- This is a bounded catalog milestone, not completion of Phase Three. Price/rating filters, subcategory navigation, ratings/review counts, shipping information, wishlist, related products, canonical variant-aware cart, checkout, and the remaining shopping/account/vendor workflows are not implemented. Existing checkout remains on the legacy contract.
- Variant-aware add-to-cart and checkout are deliberately not exposed by this slice because the existing cart and order endpoints still use the legacy product contract. Complete those workflows only after their canonical persistence path is implemented and tested.

## Prioritized execution plan

Follow the sequence in the project plan; do not implement later domains against the legacy contract:

1. **Phase One - Prisma/database verification.** Validate and generate from `prisma/schema.prisma`; map application access to every relevant model; test the complete migration history and schema drift on a disposable PostgreSQL database; review seed safety. No existing database reset, repair, or migration.
2. **Phase Two - application architecture.** Define domain boundaries, validation, services, and data access using the canonical schema; keep changes incremental.
3. **Authentication and authorization.** Map credentials/OAuth/session handling and implement schema-backed roles and seller/store ownership checks before protected commerce writes.
4. **Catalog and product systems.** Move categories/products/media/variants/prices/inventory and storefront pages together.
5. **Search and filtering.** Build against normalized catalog data, database indexes, stable pagination, and URL state.
6. **Cart and checkout.** Implement guest/user carts, variant/stock validation, server-calculated totals, transactions, and idempotency.
7. **Orders, payments, and fulfillment.** Implement valid lifecycle transitions, provider-verified payment updates, vendor orders, shipping, returns, and inventory movement.
8. **Seller/store and customer account workflows.** Enforce isolation and connect account features to canonical records.
9. **Administration.** Gate every operation through schema-backed permissions and audit sensitive changes.
10. **Reviews, messaging, and notifications.** Complete related moderation/delivery workflows.
11. **UI/UX redesign.** Improve design consistency after the integrated functional surfaces stabilize.
12. **Security, reliability, and performance.** Verify the complete threat model, transaction boundaries, service availability, and query behavior.
13. **Functional and end-to-end testing.** Cover critical happy paths and failure/authorization/idempotency cases against disposable PostgreSQL and browser workflows.
14. **Documentation and deployment readiness.** Reconcile implementation docs, CI, environment configuration, migrations, and staging smoke tests.

### Phase One acceptance criteria

The plan's **Phase One - Prisma/database verification** exit criteria are:

- The complete canonical schema validates and Prisma Client generates from the explicit schema path.
- The active migration history builds the same schema on an empty, isolated PostgreSQL database, with every non-extension drift explained.
- The database target is confirmed to be disposable or a verified restore; no command is run against an unknown `.env` target.
- The schema-to-application mapping identifies legacy call sites and concrete incompatibilities without silently changing the schema.
- Search integration tests run against an isolated database; unit, lint, and build blockers are tracked and their current status is reported.
- Seed behavior and migration safety are verified without resetting or overwriting user data.
