import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { isStripeSandboxConfigured, verifyStripeSignature } from '../lib/payments/stripe.mjs';

const secret = 'whsec_test_secret';
const payload = JSON.stringify({ id: 'evt_test', type: 'checkout.session.completed' });
const timestamp = 1_800_000_000;

function signatureFor(body, time = timestamp) {
  const signature = createHmac('sha256', secret).update(`${time}.${body}`).digest('hex');
  return `t=${time},v1=${signature}`;
}

test('accepts a valid recent Stripe webhook signature', () => {
  assert.equal(verifyStripeSignature(payload, signatureFor(payload), secret, timestamp), true);
});

test('rejects invalid payloads, stale signatures, and malformed headers', () => {
  assert.equal(verifyStripeSignature(`${payload} `, signatureFor(payload), secret, timestamp), false);
  assert.equal(verifyStripeSignature(payload, signatureFor(payload, timestamp - 301), secret, timestamp), false);
  assert.equal(verifyStripeSignature(payload, 't=bad,v1=not-a-signature', secret, timestamp), false);
});

test('requires Stripe test credentials and a webhook signing secret', () => {
  assert.equal(isStripeSandboxConfigured({ STRIPE_SECRET_KEY: 'sk_test_123', STRIPE_WEBHOOK_SECRET: 'whsec_123' }), true);
  assert.equal(isStripeSandboxConfigured({ STRIPE_SECRET_KEY: 'sk_live_123', STRIPE_WEBHOOK_SECRET: 'whsec_123' }), false);
  assert.equal(isStripeSandboxConfigured({ STRIPE_SECRET_KEY: 'sk_test_123' }), false);
});
