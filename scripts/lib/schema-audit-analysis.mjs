/**
 * Pure helpers for the read-only live-schema audit.
 * No database access or environment reads belong in this module.
 */

export const EXPECTED_SCHEMA = {
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

export const EXPECTED_TYPES = {
  'Category.id': ['int4'],
};

/**
 * @param {Array<{table_name:string,column_name:string,data_type:string,udt_name:string,is_nullable:string}>} rows
 * @param {Record<string, Record<string, string>>} expected
 * @param {Record<string, string[]>} expectedTypes
 */
export function analyzeSchema(rows, expected = EXPECTED_SCHEMA, expectedTypes = EXPECTED_TYPES) {
  const tables = new Map();
  for (const row of rows) {
    if (!tables.has(row.table_name)) tables.set(row.table_name, new Map());
    tables.get(row.table_name).set(row.column_name, row);
  }

  const findings = [];
  for (const [table, columns] of Object.entries(expected)) {
    const actual = tables.get(table);
    if (!actual) {
      findings.push({ type: 'missing-table', table });
      continue;
    }

    for (const [column, purpose] of Object.entries(columns)) {
      if (!actual.has(column)) findings.push({ type: 'missing-column', table, column, purpose });
    }
  }

  for (const [key, allowed] of Object.entries(expectedTypes)) {
    const [table, column] = key.split('.');
    const actual = tables.get(table)?.get(column);
    if (actual && !allowed.includes(actual.udt_name)) {
      findings.push({
        type: 'type-mismatch',
        table,
        column,
        actualDataType: actual.data_type,
        actualUdtName: actual.udt_name,
        expectedUdtNames: [...allowed],
      });
    }
  }

  return { findings, tableNames: [...tables.keys()].sort() };
}
