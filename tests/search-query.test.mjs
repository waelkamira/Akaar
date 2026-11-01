import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhere, SORT_ORDERS, getSortOrder, getQueryTerms, textConditions, validPositiveInteger } from '../lib/api/search-query.mjs';

test('all search sort orders end with a unique deterministic tie-breaker', () => {
  for (const [name, orderBy] of Object.entries(SORT_ORDERS)) {
    assert.deepEqual(orderBy.at(-1), { id: 'asc' }, `${name} must use id as the final sort key`);
  }
  assert.deepEqual(SORT_ORDERS.cheapest[0], { basePrice: { sort: 'asc', nulls: 'last' } });
  assert.deepEqual(SORT_ORDERS.best_sellers[0], { salesCount: 'desc' });
  assert.deepEqual(SORT_ORDERS.newest[0], { createdAt: 'desc' });
  assert.deepEqual(getSortOrder('unknown-sort'), SORT_ORDERS.newest);
});

test('search where clause always excludes deleted, inactive, unapproved and ineligible-seller products', () => {
  const where = buildWhere({ filters: {} });
  assert.equal(where.isDeleted, false);
  assert.equal(where.isActive, true);
  assert.equal(where.approvalStatus, 'APPROVED');
  assert.deepEqual(where.category, { isActive: true });
  assert.deepEqual(where.OR, [
    { sellerId: null },
    { seller: { is: { status: 'ACTIVE', isVerified: true } } },
  ]);
});

test('combines category, price, city, vendor and dynamic details filters', () => {
  const where = buildWhere({
    categoryId: '12',
    filters: {
      priceMin: '100.8',
      priceMax: '250.9',
      city: ' Damascus ',
      vendorId: 'seller-1',
      details: { brand: ' Acme ', year: 2025 },
    },
  });

  assert.ok(where.AND.some((item) => item.categoryId === 12));
  assert.ok(where.AND.some((item) => item.basePrice?.gte === 100 && item.basePrice?.lte === 250));
  assert.ok(where.AND.some((item) => item.city === 'Damascus'));
  assert.ok(where.AND.some((item) => item.userId === 'seller-1'));
  assert.ok(where.AND.some((item) => item.details?.path?.[0] === 'brand' && item.details.equals === 'Acme'));
  assert.ok(where.AND.some((item) => item.details?.path?.[0] === 'year' && item.details.equals === '2025'));
});

test('limits query terms and rejects invalid positive integer inputs', () => {
  assert.deepEqual(getQueryTerms('  one two three four five six seven eight nine  '), [
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  ]);
  assert.equal(validPositiveInteger('4', 1), 4);
  assert.equal(validPositiveInteger('-4', 1), 1);
  assert.equal(validPositiveInteger('4.5', 1), 1);
  assert.equal(validPositiveInteger(Number.MAX_SAFE_INTEGER + 1, 1), 1);
  assert.equal(textConditions(['phone']).length, 1);
});
