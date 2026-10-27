import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCategoryRouteId } from '../lib/api/category-route-id.mjs';

test('parseCategoryRouteId accepts positive decimal integer strings', () => {
  assert.equal(parseCategoryRouteId('1'), 1);
  assert.equal(parseCategoryRouteId('42'), 42);
});

test('parseCategoryRouteId rejects non-canonical or unsafe identifiers', () => {
  for (const value of ['', '0', '-1', '+1', ' 1', '1 ', '1.0', '1e2', '12abc', '9007199254740992', null, 1]) {
    assert.equal(parseCategoryRouteId(value), null, String(value));
  }
});
