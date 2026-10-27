import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeDetailsFilters } from '../lib/api/search-filters.mjs';

test('sanitizes valid primitive dynamic filters and trims values', () => {
  assert.deepEqual(sanitizeDetailsFilters({
    brand: '  Acme  ',
    year: 2025,
    verified: false,
    empty: '   ',
  }), [
    ['brand', 'Acme'],
    ['year', '2025'],
    ['verified', 'false'],
  ]);
});

test('rejects invalid keys, objects, arrays, and oversized values', () => {
  assert.deepEqual(sanitizeDetailsFilters({
    'bad key': 'value',
    nested: { x: 1 },
    list: ['x'],
    tooLong: 'x'.repeat(201),
  }), []);
});

test('caps the number of dynamic filters', () => {
  const details = Object.fromEntries(
    Array.from({ length: 35 }, (_, index) => [`field${index}`, index]),
  );
  assert.equal(sanitizeDetailsFilters(details).length, 30);
});

test('rejects non-object filter containers', () => {
  assert.deepEqual(sanitizeDetailsFilters(null), []);
  assert.deepEqual(sanitizeDetailsFilters([]), []);
  assert.deepEqual(sanitizeDetailsFilters('value'), []);
});
