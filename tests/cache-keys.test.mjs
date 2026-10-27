import test from 'node:test';
import assert from 'node:assert/strict';
import { favoriteCacheKey } from '../lib/api/cache-keys.mjs';

test('favorite cache key is deterministic for a user, page, and limit', () => {
  assert.equal(favoriteCacheKey('user-1', 1, 8), favoriteCacheKey('user-1', 1, 8));
});

test('favorite cache key changes when user, page, or limit changes', () => {
  const key = favoriteCacheKey('user-1', 1, 8);
  assert.notEqual(favoriteCacheKey('user-2', 1, 8), key);
  assert.notEqual(favoriteCacheKey('user-1', 2, 8), key);
  assert.notEqual(favoriteCacheKey('user-1', 1, 16), key);
});
