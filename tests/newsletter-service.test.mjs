import assert from 'node:assert/strict';
import test from 'node:test';
import { subscribeToNewsletter } from '../lib/newsletter/service.mjs';

function createDependencies(existing = null) {
  const calls = [];
  return {
    calls,
    findNewsletterSubscriberByEmail: async (email) => {
      calls.push(['find', email]);
      return existing;
    },
    upsertPendingNewsletterSubscriber: async (input) => calls.push(['upsert', input]),
    createNewsletterTokens: () => ({
      confirmationToken: 'confirmation-token',
      unsubscribeToken: 'unsubscribe-token',
    }),
    hashNewsletterToken: (token) => `hash:${token}`,
    sendNewsletterConfirmation: async (...args) => calls.push(['send', ...args]),
  };
}

test('does not re-send confirmation to an already active newsletter subscriber', async () => {
  const dependencies = createDependencies({ confirmedAt: new Date(), unsubscribedAt: null });
  await subscribeToNewsletter('buyer@example.invalid', dependencies);

  assert.deepEqual(dependencies.calls, [['find', 'buyer@example.invalid']]);
});

test('persists token hashes before sending confirmation for a pending subscriber', async () => {
  const dependencies = createDependencies();
  await subscribeToNewsletter('buyer@example.invalid', dependencies);

  assert.deepEqual(dependencies.calls, [
    ['find', 'buyer@example.invalid'],
    ['upsert', {
      email: 'buyer@example.invalid',
      confirmationTokenHash: 'hash:confirmation-token',
      unsubscribeTokenHash: 'hash:unsubscribe-token',
    }],
    ['send', 'buyer@example.invalid', 'confirmation-token', 'unsubscribe-token'],
  ]);
});

test('propagates delivery errors after persisting the pending subscription', async () => {
  const dependencies = createDependencies();
  dependencies.sendNewsletterConfirmation = async () => {
    throw new Error('delivery unavailable');
  };

  await assert.rejects(
    subscribeToNewsletter('buyer@example.invalid', dependencies),
    /delivery unavailable/,
  );
  assert.equal(dependencies.calls.some(([operation]) => operation === 'upsert'), true);
});
