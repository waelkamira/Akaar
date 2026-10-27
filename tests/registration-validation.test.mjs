import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistrationInput } from '../lib/auth/registration-validation.mjs';

test('normalizes valid registration fields', () => {
  assert.deepEqual(validateRegistrationInput({
    name: '  Test Seller  ',
    email: '  SELLER@example.com ',
    password: 'secure-pass-123',
  }), {
    ok: true,
    name: 'Test Seller',
    email: 'seller@example.com',
    password: 'secure-pass-123',
  });
});

test('rejects short and oversized names', () => {
  assert.equal(validateRegistrationInput({ name: 'A', email: 'a@b.com', password: '12345678' }).ok, false);
  assert.equal(validateRegistrationInput({ name: 'x'.repeat(101), email: 'a@b.com', password: '12345678' }).ok, false);
});

test('rejects invalid and oversized email addresses', () => {
  assert.equal(validateRegistrationInput({ name: 'Seller', email: 'invalid', password: '12345678' }).ok, false);
  assert.equal(validateRegistrationInput({ name: 'Seller', email: `${'x'.repeat(250)}@a.com`, password: '12345678' }).ok, false);
});

test('enforces bcrypt password byte limits without truncation ambiguity', () => {
  assert.equal(validateRegistrationInput({ name: 'Seller', email: 'a@b.com', password: '1234567' }).ok, false);
  assert.equal(validateRegistrationInput({ name: 'Seller', email: 'a@b.com', password: 'p'.repeat(73) }).ok, false);
  assert.equal(validateRegistrationInput({ name: 'Seller', email: 'a@b.com', password: 'p'.repeat(72) }).ok, true);
  assert.equal(validateRegistrationInput({ name: 'Seller', email: 'a@b.com', password: 'é'.repeat(37) }).ok, false);
});
