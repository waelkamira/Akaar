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

## Legacy data warning

The repository began with a legacy root schema and an initial migration that differ from the current canonical schema. The greenfield reconciliation migrations intentionally reshape those artifacts and are designed for a clean first deployment. They are **not a data-preserving upgrade plan** for an already populated database.

If a populated database is later found and its data must be preserved, stop before applying these migrations. First create and verify a backup, inspect its exact schema and migration history, and prepare a separately reviewed mapping/backfill migration. Do not silently cast category identifiers, discard legacy image columns, or rewrite order state values in a database whose data must be retained.
