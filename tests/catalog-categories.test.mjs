import test from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORIES, getCategoryById, getCategoryIds } from '../lib/catalog/categories.mjs';

test('category registry has unique positive numeric IDs and non-empty canonical names', () => {
  const ids = CATEGORIES.map(({ id }) => id);
  assert.ok(ids.every((id) => Number.isSafeInteger(id) && id > 0));
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(CATEGORIES.every(({ name }) => typeof name === 'string' && name.trim()));
});

test('category lookup uses server-owned names and rejects unknown IDs', () => {
  assert.deepEqual(getCategoryById(1), {
    id: 1,
    name: 'عقارات',
    description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار',
  });
  assert.equal(getCategoryById('2').name, 'سيارات');
  assert.equal(getCategoryById(999), null);
});

test('category IDs can be limited for bounded bulk catalog requests', () => {
  assert.deepEqual(getCategoryIds(3), [1, 2, 3]);
  assert.deepEqual(getCategoryIds(0), []);
});
