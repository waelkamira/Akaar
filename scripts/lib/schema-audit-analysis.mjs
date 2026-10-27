/**
 * Pure helpers for the read-only live-schema audit.
 * No database access or environment reads belong in this module.
 */

export const EXPECTED_SCHEMA = {
  products: {
    id: 'product primary key',
    title: 'product title',
    userId: 'owner relation key',
    categoryId: 'legacy numeric category key',
    categoryName: 'legacy category display name',
    images: 'legacy product image array',
    isDeleted: 'soft-delete visibility',
    createdAt: 'product creation timestamp',
    updatedAt: 'product update timestamp',
  },
  Category: {
    id: 'legacy text category ID',
    name: 'category display name',
    description: 'category description',
  },
  ProductImage: {
    id: 'image record primary key',
    productId: 'legacy product image key',
    image1: 'legacy image slot 1',
    image2: 'legacy image slot 2',
    image3: 'legacy image slot 3',
    image4: 'legacy image slot 4',
    image5: 'legacy image slot 5',
    isPrimary: 'primary image marker',
  },
};

export const EXPECTED_TYPES = {
  'Category.id': ['text'],
  'products.categoryId': ['int4'],
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
