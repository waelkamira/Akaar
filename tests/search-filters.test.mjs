import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sanitizeDetailsFilters } from '../lib/api/search-filters.mjs';

const searchRoute = await readFile(
  new URL('../app/api/search/route.js', import.meta.url),
  'utf8',
);

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

import { sanitizeSearchText } from '../lib/api/search-filters.mjs';

test('trims and bounds scalar search text while rejecting non-strings', () => {
  assert.equal(sanitizeSearchText('  Damascus  '), 'Damascus');
  assert.equal(sanitizeSearchText('x'.repeat(150), 120), 'x'.repeat(120));
  assert.equal(sanitizeSearchText({ value: 'city' }), '');
  assert.equal(sanitizeSearchText(null), '');
  assert.equal(sanitizeSearchText('value', 0), '');
});

test('keeps the JavaScript search route free of TypeScript generic call syntax', () => {
  assert.doesNotMatch(searchRoute, /prisma\.\$queryRaw\s*</);
});
