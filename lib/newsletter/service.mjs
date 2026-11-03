import { sendNewsletterConfirmation } from './email.mjs';
import {
  findNewsletterSubscriberByEmail,
  upsertPendingNewsletterSubscriber,
} from './repository.mjs';
import { createNewsletterTokens, hashNewsletterToken } from './tokens.mjs';

const newsletterDependencies = {
  findNewsletterSubscriberByEmail,
  upsertPendingNewsletterSubscriber,
  createNewsletterTokens,
  hashNewsletterToken,
  sendNewsletterConfirmation,
};

/**
 * @param {string} email
 * @param {typeof newsletterDependencies} dependencies
 */
export async function subscribeToNewsletter(email, dependencies = newsletterDependencies) {
  const existing = await dependencies.findNewsletterSubscriberByEmail(email);
  if (existing?.confirmedAt && !existing.unsubscribedAt) {
    return;
  }

  const { confirmationToken, unsubscribeToken } = dependencies.createNewsletterTokens();
  await dependencies.upsertPendingNewsletterSubscriber({
    email,
    confirmationTokenHash: dependencies.hashNewsletterToken(confirmationToken),
    unsubscribeTokenHash: dependencies.hashNewsletterToken(unsubscribeToken),
  });
  await dependencies.sendNewsletterConfirmation(email, confirmationToken, unsubscribeToken);
}
