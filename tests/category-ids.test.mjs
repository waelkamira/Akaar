import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCategoryIds } from '../lib/api/category-ids.mjs';

test('parses positive decimal category IDs and removes duplicates', () => {
  assert.deepEqual(parseCategoryIds('1,2,2,03,0,-4'), [1, 2, 3]);
});

test('rejects malformed numeric prefixes instead of accepting parseInt fragments', () => {
  assert.deepEqual(parseCategoryIds('1abc,2x,3.5,4'), [4]);
});

test('bounds category count and input processing', () => {
  assert.deepEqual(parseCategoryIds('1,2,3,4', 2), [1, 2]);
  assert.deepEqual(parseCategoryIds(null), []);
});

test('rejects non-string-like empty values safely', () => {
  assert.deepEqual(parseCategoryIds(''), []);
});
