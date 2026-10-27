# Prisma live-schema reconciliation: legacy catalog compatibility

## Purpose and safety

The current implementation aligns the core catalog Prisma models and routes with the last recorded read-only live-schema inspection. This is a compatibility step, not a migration to the future multi-vendor schema. Re-run the audit against the intended database before deployment because credentials previously prevented a fresh verification.

Run the script with an explicitly configured `DATABASE_URL` that points to the intended database:

```bash
node scripts/audit-live-schema.mjs
```

The script queries PostgreSQL metadata only (`information_schema` and `pg_indexes`). It does not query product/user content, change rows, create tables, or execute DDL. It reports metadata for the current schema and deliberately does not print the connection string. A connection failure means the audit is inconclusive, not that the database is empty or healthy.

**Never point schema-changing commands at production as a diagnostic.** Do not use `prisma db push`, `prisma migrate reset`, `prisma migrate dev`, or the seed script as a way to discover the current schema.

## Source-level differences confirmed in the repository

| Area | Original migration / known live-schema observation | Current `prisma/schema.prisma` | Risk |
|---|---|---|---|
| `Category.id` | Text ID; known live table uses `TEXT` | Text ID | Category model now matches the observed legacy type; product numeric category IDs remain separate and intentionally have no Prisma relation |
| `Category` | `id`, `name`, `description`; last observed live table has zero rows | Core model limited to those columns | Public product category names come from a server-owned registry because the legacy table is empty |
| `products` | No `sellerId`, `salesCount`, or `isActive` | Core Product model no longer declares those columns | Catalog filters use `isDeleted`; best-seller sort temporarily falls back to newest-first |
| `ProductImage` | Required `image1` through `image5`, plus `isPrimary` | ProductImage model now matches the legacy columns and does not assume an unverified FK | Normalized URL/sort-order image storage remains a future migration, not a live-schema assumption |
| `sellers` | No verified table in the last recorded audit | Seller model and Product seller relation removed from the active Prisma model until a migration is designed | Multi-vendor seller persistence is not enabled by the current legacy schema |

The table above reflects the last recorded live-schema observations and the compatibility changes in this branch. The database was not freshly queried while implementing these changes; the local connection previously failed authentication.

## Required next steps

1. Run the read-only audit against the intended database and preserve its output (do not include secrets).
2. Review remaining model/table differences, indexes, constraints, foreign keys, and row counts using read-only queries. The current patch reconciles the core catalog models from known observations, not every model in the full schema.
3. Design a forward-only migration for normalized images and multi-vendor seller ownership, with explicit backfill and validation.
4. Only reintroduce seller fields, category relations, activity flags, or sales metrics after their corresponding database migration has been deployed and verified.
5. Run CI and the isolated PostgreSQL integration suite. Do not claim production compatibility until the read-only audit succeeds against the intended database.

## Exit criteria

- Actual DB schema and migration history have been captured without modifying production.
- All existing product/image/category relationships and data are accounted for.
- The proposed migration is reviewed and tested on a non-production copy.
- Catalog API, category API, search, and seller workflows pass integration tests against the reconciled schema.
