# Prisma schema and migration reconciliation

Status: **greenfield reconciliation under review in PR #32**.

## Project context

The project owner confirmed on 2026-10-28 that the marketplace has no production database and is still under development. The repository did contain an initial migration and two conflicting Prisma schema files. The canonical application schema is `prisma/schema.prisma`, selected explicitly by `package.json` and CI. The duplicate root-level `schema.prisma` is removed in PR #32 to prevent accidental client generation against the wrong model.

## Changes in PR #32

- Adds a reconciliation migration after the historical initial migration.
- Adds the missing seller, guest-session, cart, cart-item, order-item, and token tables.
- Adds the canonical user/product/category columns and indexes.
- Changes Category to the intended integer ID with slug/parent/activity/timestamps.
- Replaces the legacy ProductImage `image1`–`image5` shape with `url` and `sortOrder`, and restores the intended foreign keys.
- Adds a CI gate that fails when committed migrations differ from `prisma/schema.prisma`.
- Produces a canonical schema SQL artifact for review.

## Important data-safety boundary

The reconciliation migration changes the Category primary-key type and drops legacy ProductImage columns. It is designed for the stated pre-production greenfield project and a clean database. It is **not** a data-preserving migration for a database that contains category or image data.

Before running this migration against any database with data:
1. Stop and create a verified backup.
2. Design explicit Category ID/slug and image-column backfills.
3. Test against a disposable copy of that database.
4. Review the generated SQL and verify row counts, foreign keys, and application behavior.
5. Only then decide whether a separate forward migration is appropriate.

Do not run `prisma migrate reset`, `prisma db push --accept-data-loss`, or seed commands against a shared or production database. `db push --accept-data-loss` is permitted only for the isolated disposable PostgreSQL test database configured by this repository.

## Verification required before closing the task

- `npx prisma validate --schema=prisma/schema.prisma`
- `npx prisma generate --schema=prisma/schema.prisma`
- `npx prisma migrate deploy --schema=prisma/schema.prisma` against clean disposable PostgreSQL
- CI migration-drift assertion passes with no DDL diff
- PostgreSQL search/filter integration tests pass
- Unit tests, ESLint, and production build pass on the exact PR head
- Review the model design separately for order/payment status types, money/currency, product image source-of-truth, and stock/inventory ownership before implementing real checkout

A successful CI run proves behavior only on the disposable test databases used by that run; it does not by itself establish production readiness.
