# Prisma migration safety plan

Status: **design only — not an executable migration**

This document records the minimum safe sequence for reconciling the legacy root `schema.prisma` and the migration-backed `prisma/schema.prisma`. It deliberately does not include a blanket schema-diff SQL script: the current diff includes destructive and data-dependent changes that cannot be safely inferred without inspecting the target database.

## Current evidence

- `package.json` explicitly generates Prisma Client from `prisma/schema.prisma`.
- `.github/workflows/quality.yml` applies `prisma/migrations` to a disposable PostgreSQL database and generates a schema-drift report against `prisma/schema.prisma`.
- The committed initial migration creates `ProductImage.image1` through `image5`, while the current canonical Prisma model expects `ProductImage.url`, `sortOrder`, and a Product relation.
- The initial migration models `Category.id` as `TEXT`; the canonical schema models it as `INTEGER` and requires `slug`, `isActive`, `createdAt`, and `updatedAt`.
- The canonical schema also contains newer models/columns that are not created by the initial migration.
- A successful clean-database CI run is not evidence that an existing deployment database can be upgraded without data loss.

## Hard safety rules

1. Never apply the generated `prisma migrate diff` output directly to production.
2. Do not use `prisma db push --accept-data-loss` against a shared, staging-with-real-data, or production database.
3. Do not change `Category.id` types or drop legacy image columns until a verified mapping and row-count reconciliation exist.
4. Do not add a required column to populated tables without a deterministic backfill and a constraint-validation step.
5. Take a database backup, verify that it can be restored, and record pre-migration row counts before any production change.
6. Do not mark this task complete until a reviewed migration passes on both a clean database and a sanitized representative copy of the existing database.

## Required preflight evidence

Capture, without exporting secrets or personal data:

- The exact database engine/version and deployed application commit.
- `prisma migrate status` output and the applied rows in `_prisma_migrations`.
- Table/column/index/constraint inventories for `users`, `products`, `ProductImage`, `Category`, and all tables referenced by current Prisma relations.
- Row counts and null/duplicate counts for affected keys; counts of products whose category has no matching canonical category.
- Counts of legacy image slots that are null/empty, plus the number of populated image slots per product.
- Whether production code still reads/writes the legacy `ProductImage.image1`–`image5` shape or the `products.images` array.

Do not include database URLs, credentials, user emails, product descriptions, or raw image URLs in committed reports.

## Migration phases

### Phase A — freeze the contract

- Keep `prisma/schema.prisma` as the only schema used by package scripts and CI.
- Audit references to the root `schema.prisma`; do not delete it until repository and deployment configuration checks confirm it is not used by any external workflow.
- Decide whether `ProductImage` is authoritative, whether `products.images` remains a compatibility field, and how reads/writes behave during rollout.

### Phase B — establish an explicit category mapping

The old string category IDs cannot be safely cast to integers by assumption. Create a reviewed mapping table from each existing category ID to the intended canonical integer ID. Include a unique constraint on both sides and fail the migration if any referenced category has no mapping or if two old categories map to one canonical category unexpectedly.

Before switching foreign keys, reconcile:
- every distinct `products.categoryId` value;
- every existing `Category.id`;
- the application's stable category IDs and names;
- parent/child category relationships, if present in the target database.

Preserve the original IDs in a temporary mapping/audit table until post-migration validation is complete. Do not silently map unknown values to category 1.

### Phase C — expand and backfill product images

1. Add the new image representation without dropping `image1`–`image5`.
2. Backfill one new image row per non-empty legacy image slot. Preserve slot order, the product ID, and primary-image intent. If the old table contains multiple rows for a product, calculate a deterministic ordering and ensure `sortOrder` remains unique or stable per product.
3. Reconcile the backfill against the source: compare expected non-empty legacy slots with inserted image rows, report products with zero images, and check for orphan product IDs.
4. Compare the new rows with `products.images` where that array is populated. Do not assume the two sources are identical; define precedence and report conflicts.
5. Update application reads/writes to the new model and deploy the compatibility version before dropping legacy columns.
6. Only remove old columns in a later migration after production telemetry/queries confirm no legacy consumer remains and the backup/restore procedure is verified.

### Phase D — backfill required category fields

- Populate `slug` using a deterministic normalization strategy, then resolve collisions explicitly before creating the unique constraint. Never silently overwrite a collision.
- Backfill `createdAt` and `updatedAt` with a documented timestamp policy. Prefer existing trustworthy timestamps; otherwise use an agreed migration timestamp and record that fallback.
- Populate `isActive` with an explicit business rule.
- Validate all non-null and unique constraints before enforcing them.

### Phase E — add newer models and relationships

Add missing tables/columns in expand-first steps. Backfill values before adding NOT NULL constraints. Add foreign keys as `NOT VALID` where supported, validate them after checking orphan rows, and only then switch application code to require the relationship. Review every delete/update action against orders, users, and product history.

### Phase F — verify before cutover

Run all of the following against disposable databases:
- migrate from empty database using only committed migrations;
- migrate a sanitized representative legacy snapshot;
- repeat migration in a restored copy to prove the documented restore path;
- assert row counts and foreign-key integrity before/after;
- assert every populated legacy image slot is represented according to the approved mapping;
- assert all products resolve to a valid canonical category;
- run application integration tests for product creation, product detail, search/category filtering, favorites, order history, and seller listings;
- run the full CI workflow against the exact migration commit.

## Rollout and rollback

- Schedule a maintenance window and stop writes if the migration cannot safely support concurrent writes.
- Take a verified pre-migration backup and test restore into an isolated database.
- Prefer additive/expand migrations first, deploy compatible application code, backfill in bounded batches, validate, and defer destructive cleanup to a later release.
- Define a rollback decision point before cutover. If the migration changes identifiers or transforms data, a down migration alone may not restore the original state; restoring the verified backup may be the only safe rollback.
- Record migration duration, row counts, validation results, and the exact commit. Never paste production data or secrets into GitHub logs.

## Exit criteria

This task remains **blocked** until the real deployed database schema and migration history have been inspected, the category mapping has been approved, image backfill reconciliation passes, a representative-data migration test passes, and a verified backup/restore has been demonstrated. CI against a clean database alone does not satisfy these criteria.
