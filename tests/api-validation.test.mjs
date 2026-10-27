import test from 'node:test';
import assert from 'node:assert/strict';
import { getPagination, isPaginationOffsetOutOfRange, isPlainObject, isValidIdentifier, parseOptionalNumber, parsePositiveInteger } from '../lib/api/validation.mjs';

test('parsePositiveInteger uses fallback for invalid and non-positive input', () => {
  assert.equal(parsePositiveInteger('0', 3), 3);
  assert.equal(parsePositiveInteger('-2', 3), 3);
  assert.equal(parsePositiveInteger('abc', 3), 3);
  assert.equal(parsePositiveInteger('12abc', 3), 3);
  assert.equal(parsePositiveInteger('1.5', 3), 3);
  assert.equal(parsePositiveInteger('9007199254740992', 3), 3);
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

test('getPagination clamps extremely large page offsets to safe integers', () => {
  const result = getPagination(new URLSearchParams('page=9007199254740991&limit=50'));
  assert.ok(Number.isSafeInteger(result.page));
  assert.ok(Number.isSafeInteger(result.skip));
  assert.ok(result.skip >= 0);
  assert.equal(result.skip, (result.page - 1) * result.limit);
});

test('pagination avoids querying offsets outside the result set', () => {
  assert.equal(isPaginationOffsetOutOfRange(0, 0), true);
  assert.equal(isPaginationOffsetOutOfRange(20, 20), true);
  assert.equal(isPaginationOffsetOutOfRange(19, 20), false);
  assert.equal(isPaginationOffsetOutOfRange(Number.MAX_SAFE_INTEGER + 1, 100), true);
  assert.equal(isPaginationOffsetOutOfRange(-1, 100), true);
  assert.equal(isPaginationOffsetOutOfRange(Number.NaN, 100), true);
  assert.equal(isPaginationOffsetOutOfRange(0.5, 100), true);
  assert.equal(isPaginationOffsetOutOfRange(0, Number.NaN), true);
  assert.equal(isPaginationOffsetOutOfRange(0, Number.POSITIVE_INFINITY), true);
  assert.equal(isPaginationOffsetOutOfRange(0, -1), true);
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

test('isValidIdentifier rejects malformed and oversized identifiers', () => {
  assert.equal(isValidIdentifier('abc'), true);
  assert.equal(isValidIdentifier('  abc  '), false);
  assert.equal(isValidIdentifier(''), false);
  assert.equal(isValidIdentifier(123), false);
  assert.equal(isValidIdentifier('x'.repeat(128)), true);
  assert.equal(isValidIdentifier('x'.repeat(129)), false);
});
