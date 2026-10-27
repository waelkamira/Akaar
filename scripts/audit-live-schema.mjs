import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const expected = {
  products: {
    sellerId: 'multi-vendor ownership',
    salesCount: 'best-seller sorting',
    isActive: 'catalog visibility filtering',
  },
  Category: {
    slug: 'category URL / unique slug',
    parentId: 'category hierarchy',
    isActive: 'category visibility filtering',
    createdAt: 'category audit timestamps',
    updatedAt: 'category audit timestamps',
  },
  ProductImage: {
    url: 'normalized product image URL',
    sortOrder: 'stable image ordering',
  },
  sellers: {
    userId: 'seller account relation',
    storeName: 'seller storefront',
    slug: 'seller storefront URL',
    status: 'seller approval workflow',
  },
};

const expectedTypes = {
  'Category.id': ['integer', 'int4'],
};

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

  const tables = new Map();
  for (const row of rows) {
    if (!tables.has(row.table_name)) tables.set(row.table_name, new Map());
    tables.get(row.table_name).set(row.column_name, row);
  }

  console.log('Akaar read-only live-schema audit');
  console.log('Scope: current_schema() metadata only; no data values are read.\n');

  let findings = 0;
  for (const [table, columns] of Object.entries(expected)) {
    const actual = tables.get(table);
    if (!actual) {
      console.log(`[MISSING TABLE] ${table}`);
      findings += 1;
      continue;
    }

    for (const [column, purpose] of Object.entries(columns)) {
      if (!actual.has(column)) {
        console.log(`[MISSING COLUMN] ${table}.${column} — ${purpose}`);
        findings += 1;
      }
    }
  }

  for (const [key, allowed] of Object.entries(expectedTypes)) {
    const [table, column] = key.split('.');
    const actual = tables.get(table)?.get(column);
    if (actual && !allowed.includes(actual.udt_name)) {
      console.log(
        `[TYPE MISMATCH] ${key}: actual ${actual.data_type} (${actual.udt_name}); expected integer (int4)`,
      );
      findings += 1;
    }
  }

  if (findings === 0) {
    console.log('No differences found in the limited critical-column checks.');
    console.log('This is not proof that the entire Prisma schema matches the database.');
  } else {
    console.log(`\nFound ${findings} schema mismatch(es) in the audited subset.`);
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
