import { createHash, randomBytes } from 'node:crypto';

export function createNewsletterTokens() {
  return {
    confirmationToken: randomBytes(32).toString('base64url'),
    unsubscribeToken: randomBytes(32).toString('base64url'),
  };
}

/** @param {string} token */
export function hashNewsletterToken(token) {
  return createHash('sha256').update(token).digest('hex');
}
