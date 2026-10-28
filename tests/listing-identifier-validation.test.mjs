import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidListingIdentifier } from '../lib/api/listing-identifier-validation.mjs';

test('accepts bounded non-empty identifiers without surrounding whitespace', () => {
  assert.equal(isValidListingIdentifier('clx123abc'), true);
  assert.equal(isValidListingIdentifier('a'.repeat(128)), true);
  assert.equal(isValidListingIdentifier('product-1', 100), true);
});

test('rejects malformed listing identifiers', () => {
  for (const value of ['', ' user ', 'a'.repeat(129), 'user\nadmin', 'user\u0000', null, 123, {}, undefined]) {
    assert.equal(isValidListingIdentifier(value), false);
  }
  assert.equal(isValidListingIdentifier('a'.repeat(101), 100), false);
});
