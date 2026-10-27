import test from 'node:test';
import assert from 'node:assert/strict';
import { publicProductWhere } from '../lib/api/public-product-where.mjs';

test('public product predicate excludes soft-deleted products using deployed columns only', () => {
  assert.deepEqual(publicProductWhere(), { isDeleted: false });
});

test('public product predicate preserves endpoint-specific filters', () => {
  assert.deepEqual(publicProductWhere({ userId: 'seller-1', categoryId: 7 }), {
    userId: 'seller-1',
    categoryId: 7,
    isDeleted: false,
  });
});

test('endpoint filters cannot weaken the soft-delete constraint', () => {
  assert.deepEqual(publicProductWhere({
    userId: 'seller-1',
    isDeleted: true,
  }), {
    userId: 'seller-1',
    isDeleted: false,
  });
});
