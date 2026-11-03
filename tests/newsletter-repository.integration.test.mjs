import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { prisma } from '../lib/db/prisma.js';
import {
  consumeNewsletterConfirmationToken,
  consumeNewsletterUnsubscribeToken,
  upsertPendingNewsletterSubscriber,
} from '../lib/newsletter/repository.mjs';
import { createNewsletterTokens, hashNewsletterToken } from '../lib/newsletter/tokens.mjs';

const enabled = process.env.NEWSLETTER_DB_INTEGRATION === '1' && Boolean(process.env.DATABASE_URL);

test('newsletter consent tokens are consumed atomically and only once in PostgreSQL', { skip: !enabled }, async () => {
  const email = `newsletter-test-${randomUUID()}@example.invalid`;
  const tokens = createNewsletterTokens();
  const confirmationTokenHash = hashNewsletterToken(tokens.confirmationToken);
  const unsubscribeTokenHash = hashNewsletterToken(tokens.unsubscribeToken);

  try {
    await upsertPendingNewsletterSubscriber({ email, confirmationTokenHash, unsubscribeTokenHash });

    assert.equal(await consumeNewsletterConfirmationToken(confirmationTokenHash), true);
    assert.equal(await consumeNewsletterConfirmationToken(confirmationTokenHash), false);

    const confirmed = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: { confirmedAt: true, confirmationTokenHash: true, unsubscribeTokenHash: true },
    });
    assert.ok(confirmed?.confirmedAt);
    assert.equal(confirmed.confirmationTokenHash, null);
    assert.equal(confirmed.unsubscribeTokenHash, unsubscribeTokenHash);

    assert.equal(await consumeNewsletterUnsubscribeToken(unsubscribeTokenHash), true);
    assert.equal(await consumeNewsletterUnsubscribeToken(unsubscribeTokenHash), false);

    const unsubscribed = await prisma.newsletterSubscriber.findUnique({
      where: { email },
      select: { unsubscribedAt: true, confirmationTokenHash: true, unsubscribeTokenHash: true },
    });
    assert.ok(unsubscribed?.unsubscribedAt);
    assert.equal(unsubscribed.confirmationTokenHash, null);
    assert.equal(unsubscribed.unsubscribeTokenHash, null);
  } finally {
    try {
      await prisma.newsletterSubscriber.deleteMany({ where: { email } });
    } finally {
      await prisma.$disconnect();
    }
  }
});
