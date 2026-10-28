import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidAdminUserId } from '../lib/api/admin-user-validation.mjs';

test('accepts bounded, non-empty user IDs without surrounding whitespace', () => {
  assert.equal(isValidAdminUserId('clx123abc'), true);
  assert.equal(isValidAdminUserId('a'.repeat(128)), true);
});

test('rejects malformed user IDs before admin mutations', () => {
  for (const value of ['', ' user ', 'a'.repeat(129), 'user\nadmin', 'user\u0000', null, 123, {}, undefined]) {
    assert.equal(isValidAdminUserId(value), false);
  }
});
