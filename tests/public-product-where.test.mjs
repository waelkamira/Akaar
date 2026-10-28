import test from 'node:test';
import assert from 'node:assert/strict';
import { publicProductWhere } from '../lib/api/public-product-where.mjs';

test('public product predicate excludes deleted and inactive products and hidden categories', () => {
  assert.deepEqual(publicProductWhere(), {
    isDeleted: false,
    isActive: true,
    approvalStatus: 'APPROVED',
    category: { isActive: true },
  });
});

test('public product predicate preserves endpoint-specific filters', () => {
  assert.deepEqual(publicProductWhere({ userId: 'seller-1', categoryId: 7 }), {
    userId: 'seller-1',
    categoryId: 7,
    isDeleted: false,
    isActive: true,
    approvalStatus: 'APPROVED',
    category: { isActive: true },
  });
});

test('endpoint filters cannot weaken public visibility constraints', () => {
  assert.deepEqual(publicProductWhere({
    userId: 'seller-1',
    isDeleted: true,
    isActive: false,
    category: { isActive: false },
  }), {
    userId: 'seller-1',
    isDeleted: false,
    isActive: true,
    approvalStatus: 'APPROVED',
    category: { isActive: true },
  });
});
