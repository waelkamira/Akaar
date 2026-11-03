import assert from 'node:assert/strict';
import test from 'node:test';
import { createNewsletterTokens, hashNewsletterToken } from '../lib/newsletter/tokens.mjs';

test('creates independent URL-safe newsletter tokens and stores only deterministic hashes', () => {
  const first = createNewsletterTokens();
  const second = createNewsletterTokens();

  for (const token of [first.confirmationToken, first.unsubscribeToken]) {
    assert.match(token, /^[A-Za-z0-9_-]{43}$/);
    assert.match(hashNewsletterToken(token), /^[a-f0-9]{64}$/);
    assert.notEqual(hashNewsletterToken(token), token);
  }

  assert.notEqual(first.confirmationToken, first.unsubscribeToken);
  assert.notEqual(first.confirmationToken, second.confirmationToken);
  assert.equal(hashNewsletterToken(first.confirmationToken), hashNewsletterToken(first.confirmationToken));
});
