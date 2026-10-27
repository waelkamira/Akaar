# Prisma live-schema reconciliation: first audit

## Purpose and safety

This audit is a preparatory step before changing Prisma models or running migrations. The repository's current Prisma model and the original migration SQL disagree on important columns and types. The real database must be inspected before choosing a migration path.

Run the script with an explicitly configured `DATABASE_URL` that points to the intended database:

```bash
node scripts/audit-live-schema.mjs
```

The script only queries PostgreSQL `information_schema.columns`. It does not query product/user content, change rows, create tables, or execute DDL. It reports metadata for the current schema and deliberately does not print the connection string. A connection failure means the audit is inconclusive, not that the database is empty or healthy.

**Never point schema-changing commands at production as a diagnostic.** Do not use `prisma db push`, `prisma migrate reset`, `prisma migrate dev`, or the seed script as a way to discover the current schema.

## Source-level differences confirmed in the repository

| Area | Original migration / known live-schema observation | Current `prisma/schema.prisma` | Risk |
|---|---|---|---|
| `Category.id` | Text ID; known live table uses `TEXT` | Integer ID | Prisma queries using numeric IDs cannot safely assume the DB type matches |
| `Category` | Legacy table has `id`, `name`, `description`; known live table has zero rows | Adds `slug`, `parentId`, `isActive`, timestamps and category tree relations | Category lookups, filtering, and seeding may fail or return no categories |
| `products` | Original migration does not define `sellerId`, `salesCount`, or `isActive`; known live schema likewise lacks these columns | Product model defines all three | Catalog and best-seller queries can fail against the legacy DB |
| `ProductImage` | Legacy shape has required `image1` through `image5` | Model expects `url` and `sortOrder` | Writes/reads through the newer model are incompatible; migration needs a data-preserving conversion plan |
| `sellers` | Must be verified against the selected database and all migration history | Current model maps a Seller model to `sellers` | Multi-vendor flows must not assume table/relations exist just because the model compiles |

The table above distinguishes source-level migration evidence from the last recorded live-schema observations. Run the read-only audit against the intended database to refresh the metadata before implementation.

## Required next steps

1. Confirm the audit ran against the intended database and preserve its output (do not include secrets).
2. Inspect all table/column/type differences, indexes, constraints, foreign keys, and row counts using read-only queries.
3. Decide a canonical category ID strategy. Do not convert text IDs to integers until every reference and existing value has been inventoried.
4. Design a forward-only migration with explicit backfill and validation for `Category`, `ProductImage`, product visibility fields, and seller ownership.
5. Test the migration against a disposable copy or the isolated test database, including rollback/recovery rehearsals.
6. Only then update the Prisma schema and refactor route code to match the agreed schema contract.

## Exit criteria

- Actual DB schema and migration history have been captured without modifying production.
- All existing product/image/category relationships and data are accounted for.
- The proposed migration is reviewed and tested on a non-production copy.
- Catalog API, category API, search, and seller workflows pass integration tests against the reconciled schema.
