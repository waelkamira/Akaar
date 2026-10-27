import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSchema } from '../scripts/lib/schema-audit-analysis.mjs';

const row = (table_name, column_name, data_type = 'text', udt_name = 'text') => ({
  table_name,
  column_name,
  data_type,
  udt_name,
  is_nullable: 'YES',
});

test('reports missing tables and missing critical columns', () => {
  const result = analyzeSchema(
    [row('products', 'title')],
    { products: { title: 'display', sellerId: 'seller relation' }, sellers: { userId: 'owner' } },
    {},
  );

  assert.deepEqual(result.tableNames, ['products']);
  assert.deepEqual(result.findings, [
    { type: 'missing-column', table: 'products', column: 'sellerId', purpose: 'seller relation' },
    { type: 'missing-table', table: 'sellers' },
  ]);
});

test('accepts the expected PostgreSQL internal type', () => {
  const result = analyzeSchema(
    [row('Category', 'id', 'integer', 'int4')],
    { Category: { id: 'category identifier' } },
    { 'Category.id': ['int4'] },
  );

  assert.deepEqual(result.findings, []);
});

test('reports a type mismatch without treating a missing column as a type mismatch', () => {
  const result = analyzeSchema(
    [row('Category', 'id', 'text', 'text')],
    { Category: { id: 'identifier', slug: 'URL slug' } },
    { 'Category.id': ['int4'], 'Category.slug': ['text'] },
  );

  assert.deepEqual(result.findings, [
    { type: 'missing-column', table: 'Category', column: 'slug', purpose: 'URL slug' },
    {
      type: 'type-mismatch',
      table: 'Category',
      column: 'id',
      actualDataType: 'text',
      actualUdtName: 'text',
      expectedUdtNames: ['int4'],
    },
  ]);
});

test('does not mutate input rows or configuration', () => {
  const rows = [row('Category', 'id', 'integer', 'int4')];
  const expected = { Category: { id: 'identifier' } };
  const types = { 'Category.id': ['int4'] };
  const beforeRows = structuredClone(rows);
  const beforeExpected = structuredClone(expected);
  const beforeTypes = structuredClone(types);

  analyzeSchema(rows, expected, types);

  assert.deepEqual(rows, beforeRows);
  assert.deepEqual(expected, beforeExpected);
  assert.deepEqual(types, beforeTypes);
});
