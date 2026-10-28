import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidProductMutationIdentifier } from '../lib/api/product-mutation-validation.mjs';

test('accepts bounded, non-empty identifiers without surrounding whitespace', () => {
  assert.equal(isValidProductMutationIdentifier('product-123'), true);
  assert.equal(isValidProductMutationIdentifier('  '), false);
  assert.equal(isValidProductMutationIdentifier('x'.repeat(128)), true);
});

test('rejects malformed product mutation identifiers', () => {
  assert.equal(isValidProductMutationIdentifier(''), false);
  assert.equal(isValidProductMutationIdentifier(null), false);
  assert.equal(isValidProductMutationIdentifier(123), false);
  assert.equal(isValidProductMutationIdentifier(' product-123'), false);
  assert.equal(isValidProductMutationIdentifier('product-123 '), false);
  assert.equal(isValidProductMutationIdentifier('x'.repeat(129)), false);
  assert.equal(isValidProductMutationIdentifier('bad\nvalue'), false);
  assert.equal(isValidProductMutationIdentifier('bad\u0000value'), false);
});

test('supports an explicit stricter maximum length', () => {
  assert.equal(isValidProductMutationIdentifier('abcd', 3), false);
  assert.equal(isValidProductMutationIdentifier('abc', 3), true);
});
