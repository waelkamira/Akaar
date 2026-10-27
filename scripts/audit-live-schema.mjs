import { PrismaClient } from '@prisma/client';
import { analyzeSchema } from './lib/schema-audit-analysis.mjs';

const prisma = new PrismaClient();

async function main() {
  // Read-only metadata queries: no business rows or schema are changed.
  const [rows, constraints, indexes] = await Promise.all([
    prisma.$queryRaw`
      SELECT table_name, column_name, data_type, udt_name, is_nullable
      FROM information_schema.columns
      WHERE table_schema = current_schema()
      ORDER BY table_name, ordinal_position
    `,
    prisma.$queryRaw`
      SELECT tc.table_name, tc.constraint_name, tc.constraint_type,
             kcu.column_name, ccu.table_name AS referenced_table,
             ccu.column_name AS referenced_column
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu
        ON tc.constraint_catalog = kcu.constraint_catalog
       AND tc.constraint_schema = kcu.constraint_schema
       AND tc.constraint_name = kcu.constraint_name
       AND tc.table_name = kcu.table_name
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_catalog = ccu.constraint_catalog
       AND tc.constraint_schema = ccu.constraint_schema
       AND tc.constraint_name = ccu.constraint_name
      WHERE tc.table_schema = current_schema()
      ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name
    `,
    prisma.$queryRaw`
      SELECT schemaname, tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = current_schema()
      ORDER BY tablename, indexname
    `,
  ]);

  const { findings, tableNames } = analyzeSchema(rows);

  console.log('Akaar read-only live-schema audit');
  console.log('Scope: current_schema() metadata only; no data values are read.\n');

  for (const finding of findings) {
    if (finding.type === 'missing-table') {
      console.log(`[MISSING TABLE] ${finding.table}`);
    } else if (finding.type === 'missing-column') {
      console.log(`[MISSING COLUMN] ${finding.table}.${finding.column} — ${finding.purpose}`);
    } else if (finding.type === 'type-mismatch') {
      console.log(
        `[TYPE MISMATCH] ${finding.table}.${finding.column}: actual ${finding.actualDataType} (${finding.actualUdtName}); expected ${finding.expectedUdtNames.join(' or ')}`,
      );
    }
  }

  if (findings.length === 0) {
    console.log('No differences found in the limited critical-column checks.');
    console.log('This is not proof that the entire Prisma schema matches the database.');
  } else {
    console.log(`\\nFound ${findings.length} schema mismatch(es) in the audited subset.`);
    console.log('Do not run prisma db push or migrations against production based only on this report.');
  }

  console.log('\nConstraints (primary keys, unique constraints, and foreign keys):');
  for (const item of constraints) {
    const relation = item.referenced_table
      ? ` -> ${item.referenced_table}.${item.referenced_column}`
      : '';
    console.log(`  ${item.table_name}.${item.constraint_name} [${item.constraint_type}] ${item.column_name ?? ''}${relation}`);
  }

  console.log('\nIndexes:');
  for (const item of indexes) {
    console.log(`  ${item.tablename}.${item.indexname}: ${item.indexdef}`);
  }

  console.log('\nObserved table names:', [...tables.keys()].sort().join(', ') || '(none)');
  if (findings > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    // Do not print connection URLs or environment variables.
    console.error('Schema audit could not complete:', error?.message ?? 'unknown error');
    process.exitCode = 2;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
