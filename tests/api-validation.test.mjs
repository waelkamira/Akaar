import test from 'node:test';
import assert from 'node:assert/strict';
import { getPagination, isPlainObject, parseOptionalNumber, parsePositiveInteger } from '../lib/api/validation.mjs';

test('parsePositiveInteger uses fallback for invalid and non-positive input', () => {
  assert.equal(parsePositiveInteger('0', 3), 3);
  assert.equal(parsePositiveInteger('-2', 3), 3);
  assert.equal(parsePositiveInteger('abc', 3), 3);
  assert.equal(parsePositiveInteger('12', 3), 12);
});

test('parsePositiveInteger caps large values', () => {
  assert.equal(parsePositiveInteger('1000', 20, 50), 50);
});

test('getPagination produces one-based pages and non-negative offsets', () => {
  assert.deepEqual(getPagination(new URLSearchParams('page=3&limit=10')), {
    page: 3, limit: 10, skip: 20,
  });
  assert.deepEqual(getPagination(new URLSearchParams('page=-1&limit=999')), {
    page: 1, limit: 50, skip: 0,
  });
});

test('parseOptionalNumber rejects invalid, negative and non-integer integer fields', () => {
  assert.equal(parseOptionalNumber(undefined), undefined);
  assert.equal(parseOptionalNumber(''), undefined);
  assert.equal(parseOptionalNumber('NaN'), null);
  assert.equal(parseOptionalNumber('-1'), null);
  assert.equal(parseOptionalNumber('1.5', { integer: true }), null);
  assert.equal(parseOptionalNumber('4', { integer: true }), 4);
});

test('isPlainObject rejects null, arrays and primitive values', () => {
  assert.equal(isPlainObject({}), true);
  assert.equal(isPlainObject(null), false);
  assert.equal(isPlainObject([]), false);
  assert.equal(isPlainObject('value'), false);
});
