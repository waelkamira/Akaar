# Prisma legacy-schema preflight runbook

This runbook explains how to collect diagnostic evidence before designing a data-preserving migration. It does **not** authorize or perform a production migration.

## Safety requirements

- Use a freshly restored backup in an isolated staging database first. Do not point this report at production.
- Use a dedicated database role with **SELECT-only** privileges on the required tables. The report is intended to be read-only, but least privilege is the actual safety boundary.
- Keep the database URL in an environment variable or secret manager. Never commit it, paste it into an issue, or include it in logs.
- Record the backup timestamp and database/schema version used for the report.
- If table names or columns differ from the legacy shape below, stop and adapt the report only after DBA review.

## 1. Inspect the schema before running the report

Connect to the restored database with a read-only role and inspect the expected tables and columns:

```sql
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('ProductImage', 'products', 'Category')
ORDER BY table_name, ordinal_position;
```

The current report expects these legacy fields:

- `public."ProductImage"`: `productId`, `image1` through `image5`, `isPrimary`
- `public.products`: `id`, `categoryId`, `categoryName`, `images`
- `public."Category"`: `id`, `name`, `description`

The initial committed migration is one historical reference, not proof of the deployed database's shape.

## 2. Run the report against the restored copy

With PostgreSQL client tools installed, set `PREFLIGHT_DATABASE_URL` in your shell using your secret manager or a secure interactive method. Do not put a credential-bearing URL directly in a command that may be saved to shell history.

```sh
: "${PREFLIGHT_DATABASE_URL:?Set PREFLIGHT_DATABASE_URL to the restored, read-only database}"
PGOPTIONS='-c default_transaction_read_only=on' \
  psql "$PREFLIGHT_DATABASE_URL" \
    --no-psqlrc \
    --set ON_ERROR_STOP=1 \
    --file prisma/preflight-legacy-schema.sql \
    --output preflight-report.txt
```

The database role should remain SELECT-only even with `default_transaction_read_only` enabled. The report uses psql's `\echo` commands, so run it with `psql`, not a generic SQL editor that does not support psql meta-commands.

Review `preflight-report.txt` locally. Treat it as potentially sensitive operational data and do not commit real production-derived output.

## 3. Reconcile results before proposing a migration

For each result, document the count and the proposed handling:

- Legacy image slots: count populated URLs by slot and reconcile them against `products.images` and any existing normalized media rows. Decide explicitly how duplicate URLs and primary-image ordering are handled.
- Orphan image slots: resolve missing product references; do not silently discard the records.
- Category names: distinguish exact matches, normalized-name collisions, missing names, and one legacy ID associated with multiple names. Do not automatically map categories by lowercased name alone.
- Category IDs: verify the existing type and every foreign-key dependency before proposing a key conversion.

Do not include personal data, credentials, tokens, or full image URLs in a public report. Counts and reviewed mapping summaries are generally sufficient.

## 4. Migration gate

Do not write or run a data migration until all of these are true:

1. A representative restored database has been inspected and its schema matches the reviewed assumptions.
2. Explicit, human-reviewed mappings exist for every ambiguous category and image case.
3. A migration plan preserves all source records and can be rerun or safely resumed as designed.
4. Automated tests cover both an empty database and representative legacy data.
5. Before production rollout, a fresh backup exists and its restore has been verified.
6. The rollout plan includes post-migration reconciliation and a rollback/recovery decision.

Never apply generated schema-drift SQL directly to production. In particular, do not drop legacy image columns, change category primary-key types, or add required fields without a verified backfill and dependency review.

## Evidence status

This repository does not run this report against the owner's database. No real database results are implied by a passing GitHub Actions run. The database owner/DBA must run it on a restored copy and review the resulting evidence.
