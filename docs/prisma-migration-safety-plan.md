# Prisma schema and migration policy

Status: **greenfield setup — no production database exists**.

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

## Legacy data warning

The repository began with a legacy root schema and an initial migration that differ from the current canonical schema. The greenfield reconciliation migrations intentionally reshape those artifacts and are designed for a clean first deployment. They are **not a data-preserving upgrade plan** for an already populated database.

If a populated database is later found and its data must be preserved, stop before applying these migrations. First create and verify a backup, inspect its exact schema and migration history, and prepare a separately reviewed mapping/backfill migration. Do not silently cast category identifiers, discard legacy image columns, or rewrite order state values in a database whose data must be retained.
