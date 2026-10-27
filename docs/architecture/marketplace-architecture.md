# Akaar Marketplace Architecture

## Status

This document defines the target architecture and a safe migration plan. It is a proposal, not a claim that the directory tree already exists or that all listed capabilities are implemented.

## Current repository observations

The repository currently uses the Next.js App Router and contains 377 entries in the reviewed tree. Its main areas include:

- `app/`: storefront, account, selling, and API routes.
- `components/`: shared UI and page components.
- `features/`: initial modules for account, auth, cart, catalog, orders, search, and seller.
- `lib/`: API helpers, auth, database access, uploads, and validation.
- `prisma/`, `tests/`, `scripts/`, and `docs/`.

Existing route examples include `app/api/product/route.js`, `app/api/search/route.js`, `app/posts/[id]`, `app/categories/[id]`, and `app/seller/dashboard`. There is also a root-level `schema.prisma` in addition to `prisma/schema.prisma`.

This inventory is based on repository files, not a full browser-based acceptance test.

## Architectural decision

Use a **modular monolith** first. Keep one deployable Next.js application and establish explicit domain boundaries in code. Do not split into microservices until operational evidence (team ownership, independent scaling, deployment cadence, or reliability boundaries) justifies the added complexity.

### Layer responsibilities

1. **`app/` — delivery and routing**
   - Route groups, layouts, loading/error states, pages, and thin Route Handlers.
   - Parse HTTP input, invoke domain services, and map domain outcomes to HTTP responses.
   - Do not place substantial business rules directly in route files.

2. **`features/` — business domains**
   - Own domain-specific components, input schemas, queries, services, policies, and tests.
   - Suggested domains: auth, catalog, search, cart, checkout, orders, sellers, inventory, payments, shipping, reviews, promotions, notifications, moderation, and admin.
   - Avoid cross-domain imports of internal implementation files; expose intentional public entry points.

3. **`components/` — reusable presentation**
   - `ui/`: low-level primitives without marketplace-specific business rules.
   - `common/`: reusable application-wide elements such as price display, empty states, and confirmation dialogs.
   - `layout/`: header, navigation, footer, breadcrumbs.
   - `providers/`: narrowly scoped React providers.

4. **`lib/` — infrastructure and cross-cutting concerns**
   - Prisma client, environment validation, logging, cache, storage, rate limiting, API error conventions, authentication adapters, and utilities.
   - Keep business workflows in the owning feature rather than accumulating them in `lib/`.

5. **`store/` and `context/` — client state**
   - Use React state for local UI state and Context for genuinely cross-cutting provider values.
   - Consider Zustand for shared interactive client state such as a cart drawer or transient UI.
   - Do not duplicate server data in a global client store without a clear invalidation strategy. Never trust client state for price, inventory, roles, or authorization.

6. **`prisma/` — database contract**
   - One explicitly selected Prisma schema, reviewed migrations, seed/fixture data, and documented migration procedures.
   - Never use `db push`, destructive resets, or unreviewed generated SQL against production data.

7. **`tests/` — verification**
   - Unit tests for pure domain logic, integration tests against isolated databases, API authorization tests, and browser-driven end-to-end tests for critical user journeys.

## Target directory tree

```text
akaar/
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx
│   │   ├── products/[productId]/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── stores/[storeSlug]/page.tsx
│   │   └── sellers/[sellerSlug]/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (account)/account/
│   │   ├── profile/page.tsx
│   │   ├── addresses/page.tsx
│   │   ├── favorites/page.tsx
│   │   └── orders/[orderId]/page.tsx
│   ├── (checkout)/
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── payment/page.tsx
│   │   └── confirmation/[orderId]/page.tsx
│   ├── (seller)/seller/
│   │   ├── dashboard/page.tsx
│   │   ├── products/page.tsx
│   │   ├── products/new/page.tsx
│   │   ├── products/[productId]/edit/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── inventory/page.tsx
│   │   └── store-settings/page.tsx
│   ├── (admin)/admin/
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── sellers/page.tsx
│   │   ├── products/page.tsx
│   │   └── moderation/page.tsx
│   ├── api/
│   │   ├── v1/products/route.ts
│   │   ├── v1/products/[productId]/route.ts
│   │   ├── v1/categories/route.ts
│   │   ├── v1/search/route.ts
│   │   ├── v1/stores/[storeId]/route.ts
│   │   ├── v1/cart/route.ts
│   │   ├── v1/orders/route.ts
│   │   ├── v1/orders/[orderId]/route.ts
│   │   ├── v1/favorites/route.ts
│   │   ├── v1/uploads/route.ts
│   │   ├── v1/webhooks/[provider]/route.ts
│   │   └── health/route.ts
│   ├── layout.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── common/
│   ├── layout/
│   └── providers/
├── features/
│   ├── auth/
│   ├── catalog/
│   ├── search/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── sellers/
│   ├── inventory/
│   ├── payments/
│   ├── shipping/
│   ├── reviews/
│   ├── promotions/
│   ├── notifications/
│   ├── moderation/
│   └── admin/
├── hooks/
├── context/
├── store/
├── lib/
│   ├── prisma/
│   ├── auth/
│   ├── api/
│   ├── cache/
│   ├── config/
│   ├── email/
│   ├── logging/
│   ├── rate-limit/
│   ├── storage/
│   ├── validation/
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── seed.ts
│   └── fixtures/
├── types/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── api/
│   ├── e2e/
│   └── fixtures/
├── scripts/
│   ├── database/
│   ├── audit/
│   └── maintenance/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── runbooks/
├── public/
├── .github/workflows/
├── middleware.ts
├── next.config.ts
├── eslint.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

This is a target shape. Empty directories and speculative modules should not be created just to match the diagram; add each domain when its behavior is being implemented.

## Route and domain rules

- Route groups in parentheses do not appear in URLs. Avoid creating two pages that resolve to the same URL after route groups are removed.
- Use stable IDs for database identity and slugs for human-readable public URLs where appropriate.
- Route Handlers should validate request size and shape, authenticate the caller, authorize the operation, invoke a service, and return a consistent response.
- Authorization must be enforced server-side at the resource/service boundary, not only in layouts, client components, or middleware.
- A seller must only read or mutate resources belonging to that seller unless a specific, audited administrative permission permits otherwise.
- Validate payment webhooks using the provider's signature and idempotency mechanism. Do not trust a browser redirect as proof of payment.
- Treat cart prices and stock as untrusted client input; recalculate and reserve inventory on the server inside appropriate transactional boundaries.
- For multi-seller checkout, model seller-specific fulfillment/shipping boundaries explicitly instead of assuming every item in an order has one seller.
- Keep external provider integrations behind feature-owned adapters and interfaces so payment, shipping, and storage providers can be replaced without rewriting domain logic.

## Database and release safety gate

The repository currently has both a root-level `schema.prisma` and `prisma/schema.prisma`. Existing repository investigation also found legacy database differences involving category IDs/fields, product flags, and product image storage. This is a release-blocking compatibility concern, not a directory-layout issue.

Before any schema migration:
1. Capture a read-only inventory from a restored copy of the actual database schema.
2. Compare the live schema, both Prisma schemas, migration history, and application query assumptions.
3. Choose and document a single canonical schema strategy.
4. Produce a reviewed migration plan with explicit data-preservation and rollback steps.
5. Test the migration on a disposable database and a representative restored backup.
6. Verify row counts, foreign keys, nullability, indexes, category mapping, and image preservation.
7. Only then schedule a production migration with a backup and recovery plan.

Do not run `prisma db push`, `migrate reset`, or inferred SQL against production as a shortcut.

## Incremental migration plan

### Phase 0 — baseline and safety
- Keep the current production schema unchanged.
- Ensure CI uses an isolated PostgreSQL database.
- Record current behavior and add regression tests before moving code.
- Resolve the canonical Prisma schema and legacy DB compatibility first.

### Phase 1 — shared infrastructure
- Consolidate the Prisma client entry point.
- Standardize environment validation, API errors, logging, and request validation.
- Establish authorization helpers and tests for owner/admin boundaries.
- Avoid changing public API contracts in the same commit as internal file moves.

### Phase 2 — catalog and search
- Extract product/category services and query builders into `features/catalog` and `features/search`.
- Keep current Route Handler URLs as compatibility adapters while callers are migrated.
- Test category consistency, filters, sorting, pagination, and deleted/inactive product exclusion.

### Phase 3 — seller, inventory, and orders
- Establish seller ownership and store identity.
- Define inventory reservation, order lifecycle, and cancellation semantics.
- Add transaction and concurrency tests before enabling real checkout.

### Phase 4 — checkout, payments, and shipping
- Add idempotent order creation and payment processing.
- Verify webhook signatures and duplicate delivery handling.
- Separate order-level status from seller-specific fulfillment where needed.

### Phase 5 — frontend organization and UX
- Move shared primitives to `components/ui`, shared app components to `components/common`, and shell components to `components/layout`.
- Move domain-specific UI next to its feature.
- Consolidate duplicate hooks only after checking imports and behavior.
- Introduce client stores only where server rendering and local state do not suffice.

### Phase 6 — production readiness
- Add end-to-end tests for customer, seller, and admin workflows.
- Verify rate limits, upload constraints, security headers, observability, backups, restore drills, and incident runbooks.
- Use load tests and database query plans to guide caching and indexing.
- Split out services only when measured needs justify it.

## Definition of done for each migration

- The old behavior is covered by a regression test.
- The new implementation has clear ownership and a documented public interface.
- Authorization and input validation are tested.
- No production schema/data changes are hidden inside a refactor.
- Lint, unit tests, Prisma validation, isolated DB integration tests, and production build pass on the exact commit.
- The pull request records what was not tested, especially browser and production database behavior.
