import test from 'node:test';
import assert from 'node:assert/strict';
import { getCanonicalCategoryFields } from '../lib/api/product-category.mjs';

test('uses the server-loaded category ID and name as canonical product fields', () => {
  const category = { id: 3, name: 'هواتف' };
  const clientCategoryName = 'عقارات';

  assert.deepEqual(getCanonicalCategoryFields(category, clientCategoryName), {
    categoryId: 3,
    categoryName: 'هواتف',
  });
});

test('rejects missing or malformed category records', () => {
  assert.equal(getCanonicalCategoryFields(null), null);
  assert.equal(getCanonicalCategoryFields({ id: '3', name: 'هواتف' }), null);
  assert.equal(getCanonicalCategoryFields({ id: 3, name: '   ' }), null);
});
