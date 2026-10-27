import test from 'node:test';
import assert from 'node:assert/strict';
import { getVerifiedGoogleIdentity } from '../lib/auth/google-identity.mjs';

test('accepts a verified Google identity and normalizes its email', () => {
  assert.deepEqual(getVerifiedGoogleIdentity({
    email: '  SELLER@example.com ',
    email_verified: true,
    sub: 'google-subject-123',
  }), { email: 'seller@example.com', subject: 'google-subject-123' });
});

test('rejects Google profiles without a verified email', () => {
  assert.equal(getVerifiedGoogleIdentity({ email: 'seller@example.com', email_verified: false, sub: 'sub' }), null);
  assert.equal(getVerifiedGoogleIdentity({ email: 'seller@example.com', sub: 'sub' }), null);
});

test('rejects malformed email addresses and missing or oversized subjects', () => {
  assert.equal(getVerifiedGoogleIdentity({ email: 'invalid', email_verified: true, sub: 'sub' }), null);
  assert.equal(getVerifiedGoogleIdentity({ email: 'seller@example.com', email_verified: true, sub: '' }), null);
  assert.equal(getVerifiedGoogleIdentity({ email: 'seller@example.com', email_verified: true, sub: 's'.repeat(256) }), null);
});
