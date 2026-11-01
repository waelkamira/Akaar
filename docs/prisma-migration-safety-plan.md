# Prisma schema and migration policy

Status: **canonical schema for clean deployment; a configured legacy database also exists and has not been migrated**.

The project owner confirmed that Akaar has no production database and that the schema can be corrected before launch. This repository should therefore maintain one canonical Prisma schema and a migration history that builds the intended schema from an empty PostgreSQL database.

## Sources of truth

- Canonical schema: `prisma/schema.prisma`.
- Committed migration history: `prisma/migrations/`.
- Package scripts and CI must use the canonical schema path explicitly.
- The old root-level `schema.prisma` is a historical artifact and must not be restored as a second source of truth.
- Current commerce model decisions are documented in `docs/architecture/commerce-domain-decisions.md`.

## Development and CI requirements

Before accepting schema changes:

1. Run `npx prisma validate --schema=prisma/schema.prisma`.
2. Run `npx prisma generate --schema=prisma/schema.prisma`.
3. Apply the complete committed history to an empty disposable PostgreSQL database with `npx prisma migrate deploy --schema=prisma/schema.prisma`.
4. Compare the database created by migrations with the canonical schema and investigate any DDL drift. The known extension-only `pg_trgm` diff may be excluded if explicitly documented.
5. Run the PostgreSQL integration tests, unit tests, ESLint, and production build on the exact commit.

## First deployment

- Configure the new PostgreSQL database and its credentials in the deployment environment; never commit credentials.
- Apply committed migrations with `prisma migrate deploy`.
- Do not use `prisma db push --accept-data-loss` as the deployment migration strategy.
- Keep schema changes and their migrations in the same pull request and require passing CI before deployment.
- Do not claim that CI against a disposable database proves a real deployed runtime is configured; verify deployment environment variables and perform smoke tests separately.
- For a local, disposable, or explicitly designated demo database, run `npm run seed` to upsert five passwordless fictitious sellers and 10 demo products in each of the 22 categories. The seed is idempotent and preserves the IDs from the earlier five-product sample.
- The seed does not migrate or repair the database schema. It writes the catalog columns available in the inspected legacy database; it does not enable Stripe or reconcile legacy order/payment tables. Production execution is blocked unless `ALLOW_DEMO_SEED_IN_PRODUCTION=true` is explicitly set for an intentional demo environment.

## Narrow auth repair for the inspected legacy user table

The standalone script at `prisma/legacy-repairs/20261031_auth_user_fields.sql` is a narrowly scoped, additive repair for the inspected legacy `public.users` shape. It adds the role/status enums and auth-related columns expected by the current Prisma `User` model, assigning existing accounts the least-privileged `CUSTOMER` role and `ACTIVE` status. It does not repair other legacy tables or make the database compatible with the complete current schema.

- Do not run this script against an unverified database or as a substitute for the committed migration history.
- First create a full backup and verify that it can be restored to an isolated database. Inspect the restored schema and row counts, then confirm `public.users` still matches the script's preconditions.
- Apply this standalone SQL only to the reviewed target after the backup gate. It runs in a transaction and aborts if the legacy table or enum definitions differ.
- This script is intentionally outside `prisma/migrations`; do not mark the committed migrations applied or run `prisma migrate deploy` against the legacy database as part of this repair.
- Plan a separately reviewed, data-preserving migration for the remaining legacy schema before treating this database as fully upgraded.

## Narrow catalog repair for the inspected empty legacy tables

The standalone script at `prisma/legacy-repairs/20261031_catalog_fields.sql` repairs the specific legacy catalog mismatch observed in `propertiesdatabase`: an empty `products` table with text `categoryId`, an empty lowercase `categories` table, and no canonical `"Category"` table. It preserves the legacy `categories` table, creates and seeds the canonical 22-category table, converts the empty product table's category ID to integer, and adds the product status fields required by public catalog queries.

- Use only after a fresh backup has been restored and verified; re-inspect the target because this script requires both legacy product and category tables to be empty.
- The script aborts if either table has rows or the inspected schema has changed. Do not remove those guards to force it through.
- It is intentionally outside `prisma/migrations` and is not a substitute for reconciling the remaining schema or applying the committed migrations to a clean database.

## Narrow seller/property domain repair for the inspected legacy database

The standalone script at `prisma/legacy-repairs/20261031_admin_domain_tables.sql` adds the missing seller, store, property, property-wishlist, and booking-request tables and their enums. These tables are needed by the existing seller review queue and admin user/property lists. The script also adds the product-to-seller foreign key; it requires `products.sellerId` to be nullable text with no existing references.

- Use only after a fresh backup has been restored and verified; re-inspect the target because the script requires all five domain tables and four enums to be absent.
- The script aborts if any target table or enum already exists, or if the inspected `users`/`products` shape differs. It creates empty domain tables and does not migrate or delete existing application rows.
- It is intentionally outside `prisma/migrations` and does not make the legacy database compatible with the complete canonical schema.

## Narrow marketplace settings repair for the inspected legacy database

The standalone script at `prisma/legacy-repairs/20261031_marketplace_settings_table.sql` creates the missing `public.marketplace_settings` table used by marketplace feature switches. It creates no setting rows; application defaults keep marketplace, seller applications, and product approval enabled until an administrator changes them.

- Use only after a fresh backup has been restored and verified, and only if `public.marketplace_settings` is still absent.
- The script aborts if the table already exists and does not modify existing application rows.
- This repair does not reconcile the legacy `orders`/`payments` tables with canonical Prisma model names. The admin dashboard reads those legacy tables when canonical `"Order"`/`"Payment"` tables are absent; legacy revenue is grouped by payment creation time because the old payments table has no `paidAt` column.

## Site content and analytics migration

The committed migration `prisma/migrations/20261031100000_control_panel_content_analytics/migration.sql` creates editable site pages, anonymous daily page-view aggregates, and newsletter subscribers with double opt-in and unsubscribe tokens. The matching standalone script `prisma/legacy-repairs/20261031_site_content_analytics_tables.sql` is an additive repair for a reviewed legacy database; it aborts if any target table already exists.

- Apply the committed migration only to a clean database using the complete migration history.
- Do not apply the standalone legacy repair to `propertiesdatabase` without a fresh, restore-verified backup and explicit authorization. Re-inspect all target tables immediately before any authorized application.
- Page-view records contain only UTC day, route path, and aggregate count. Do not add IP addresses or visitor identifiers to this table.
- The analytics endpoint checks that its aggregate table exists and fails closed with a service-unavailable response until the migration or authorized legacy repair has been applied.
- Newsletter delivery requires server-side Resend settings (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `APP_URL` or `NEXTAUTH_URL`). The public subscription flow remains unavailable until those settings and the migration are present.
- External payment checkout remains disabled until the USD-price migration is applied, test credentials and webhook verification are configured, and the control-panel owner explicitly enables it. Environment-key presence alone must never enable payment collection.

## USD prices and Stripe sandbox checkout migration

The committed migration `prisma/migrations/20261031120000_usd_product_prices_stripe_checkout/migration.sql` adds optional product USD prices (integer cents) and payment currency/provider references. The standalone script `prisma/legacy-repairs/20261031_usd_prices_and_stripe_payment_fields.sql` requires both canonical `public.products` and `public."Payment"` tables; it deliberately refuses to run on the currently inspected legacy schema, which has legacy `payments`/`orders` instead of canonical payment/order tables.

- A new USD product price is optional and is required for every item in a Stripe sandbox checkout.
- Stripe checkout remains disabled by default and accepts only `sk_test_` credentials, a configured `whsec_` webhook secret, and explicit owner enablement. Card payments go through Stripe; this includes Visa/Mastercard where Stripe makes them available.
- The checkout amount comes from the admin-set USD cents price, never from an automatic exchange-rate conversion. The SYP catalog price remains the amount used for cash-on-delivery orders.
- Do not apply the standalone USD/Stripe repair to the current legacy database: the canonical Payment table does not exist. Reconcile the legacy order/payment schema in a separate reviewed, data-preserving migration before enabling Stripe.
- PayPal and Sham Cash remain disabled until their official API/webhook requirements are verified and implemented.

## Payment method drafts

The migration `prisma/migrations/20261031150000_payment_method_drafts/migration.sql` stores editable, disableable payment-method drafts for administrator planning. These records are not payment integrations and do not appear in checkout. Only cash on delivery and the explicitly configured Stripe sandbox are accepted by the current checkout flow. Apply the full migration history to a clean database; use the matching guarded legacy repair only after the backup and schema-inspection gates described above.

## Legacy data warning

The repository began with a legacy root schema and an initial migration that differ from the current canonical schema. The greenfield reconciliation migrations intentionally reshape those artifacts and are designed for a clean first deployment. They are **not a data-preserving upgrade plan** for an already populated database.

For the configured populated legacy database—and any other populated database whose data must be preserved—stop before applying these migrations. First create and verify a backup, inspect its exact schema and migration history, and prepare a separately reviewed mapping/backfill migration. Do not silently cast category identifiers, discard legacy image columns, or rewrite order state values in a database whose data must be retained.

## Product and store ratings

The migration `prisma/migrations/20261031200000_product_and_store_ratings/migration.sql` maps product reviews to the existing lowercase `public.reviews` table (renaming `public."Review"` only when the lowercase table is absent), adds the per-customer/product uniqueness constraint, and creates `public.store_reviews` for customer-submitted store ratings linked to `public.sellers`.

- Do not apply this migration to the configured legacy database without an independently reviewed backup, schema inspection, and explicit authorization. It is part of the clean-deployment migration history, not an automatic repair for a legacy database.
- Product ratings can be read from `public.reviews` when its expected columns are present. Store-rating features fail closed until `public.store_reviews` exists; storefronts and admin panels show no fabricated ratings while that storage is unavailable.
- A customer may submit or update one 1–5 star review per product and one per store. The API requires authentication, rejects reviews of the customer's own products or store, and normalizes optional comments. The migration supplies the unique constraints relied on by those upserts.
- Run the complete committed migration history on an empty disposable PostgreSQL database to validate the rating schema. Never run `prisma migrate deploy` against the configured legacy database as part of this feature.

## Store messaging

The migration `prisma/migrations/20261101000000_store_messaging/migration.sql` creates private customer/store-owner conversations and message records, with participant foreign keys, unread indexes, and one conversation per customer/store pair.

- Conversation APIs verify the signed-in user is either the customer or the owner of the linked store. New customer conversations are accepted only for active, verified stores.
- Messaging endpoints return a service-unavailable response until both messaging tables exist. Apply the full migration history to a clean database; do not apply it to the configured legacy database without a separately reviewed, backup-verified migration plan.
- Administrator bulk messages continue to use per-owner in-app notifications. Optional email and SMS delivery is attempted after those notifications are saved, so provider failures do not discard the in-app messages.

## Favorite table mapping

The canonical Prisma `Favorite` model maps to the lowercase `public.favorites` table used by the inspected legacy database. The clean-install migration `prisma/migrations/20261102000000_map_favorites_table/migration.sql` renames the quoted table created by the historical initial migration. It fails if both table names exist so favorite records are never silently merged or discarded. The migration is part of the clean-deployment history; do not run it or the full migration chain against a populated legacy database without the required backup and migration review.
