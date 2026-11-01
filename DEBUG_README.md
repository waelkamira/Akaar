# Project Debugging & Audit

The canonical audit log is maintained in [README.md](README.md). It records confirmed issues, suspected risks, ordered fixes, test status, and deployment blockers.

## Reproduce the core verification

Run from the repository root with Node.js 22 and the committed lockfile. Use a disposable PostgreSQL test database, never a production database.

```bash
npm ci
npx prisma validate --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/schema.prisma
npm test
npm run lint
npm run build
```

For the PostgreSQL-backed search integration suite, follow the test-database commands in README.md and ensure the integration test environment variable is set as documented by the package scripts/workflow.

## Reporting a new defect

For each new defect, record:
1. File and route/component name.
2. Reproduction steps and expected/actual result.
3. Severity and user/data impact.
4. Regression test added.
5. Fix commit and passing CI run.

Never paste secrets, production database credentials, payment keys or personal data into this report.
