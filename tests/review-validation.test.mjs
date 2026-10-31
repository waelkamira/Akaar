import test from 'node:test';
import assert from 'node:assert/strict';
import { parseReviewSubmission } from '../lib/api/review-validation.mjs';

test('accepts a valid product review and normalizes its comment', () => {
  assert.deepEqual(parseReviewSubmission({
    targetType: 'product',
    targetId: ' product-1 ',
    rating: 5,
    comment: '  Great product  ',
  }), {
    targetType: 'product',
    targetId: 'product-1',
    rating: 5,
    comment: 'Great product',
  });
});

test('accepts a store rating without a comment', () => {
  assert.deepEqual(parseReviewSubmission({
    targetType: 'store',
    targetId: 'store-1',
    rating: 1,
  }), {
    targetType: 'store',
    targetId: 'store-1',
    rating: 1,
    comment: null,
  });
});

test('rejects invalid targets, ratings, identifiers, and comments', () => {
  const valid = { targetType: 'product', targetId: 'product-1', rating: 4 };
  assert.equal(parseReviewSubmission(null), null);
  assert.equal(parseReviewSubmission({ ...valid, targetType: 'other' }), null);
  assert.equal(parseReviewSubmission({ ...valid, rating: 0 }), null);
  assert.equal(parseReviewSubmission({ ...valid, rating: 5.5 }), null);
  assert.equal(parseReviewSubmission({ ...valid, targetId: ' ' }), null);
  assert.equal(parseReviewSubmission({ ...valid, comment: 123 }), null);
  assert.equal(parseReviewSubmission({ ...valid, comment: 'a'.repeat(1001) }), null);
});
