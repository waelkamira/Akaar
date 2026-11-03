// @ts-check
import { prisma } from '../db/prisma.js';

const activeSubscriberWhere = {
  confirmedAt: { not: null },
  unsubscribedAt: null,
};

/** @param {string} email */
export function findNewsletterSubscriberByEmail(email) {
  return prisma.newsletterSubscriber.findUnique({
    where: { email },
    select: { confirmedAt: true, unsubscribedAt: true },
  });
}

/**
 * @param {{ email: string; confirmationTokenHash: string; unsubscribeTokenHash: string }} input
 */
export function upsertPendingNewsletterSubscriber(input) {
  const data = {
    confirmationTokenHash: input.confirmationTokenHash,
    unsubscribeTokenHash: input.unsubscribeTokenHash,
    confirmedAt: null,
    unsubscribedAt: null,
  };

  return prisma.newsletterSubscriber.upsert({
    where: { email: input.email },
    create: { email: input.email, ...data },
    update: data,
  });
}

/** @param {string} tokenHash */
export async function consumeNewsletterConfirmationToken(tokenHash) {
  const result = await prisma.newsletterSubscriber.updateMany({
    where: { confirmationTokenHash: tokenHash },
    data: { confirmedAt: new Date(), confirmationTokenHash: null },
  });
  return result.count === 1;
}

/** @param {string} tokenHash */
export async function consumeNewsletterUnsubscribeToken(tokenHash) {
  const result = await prisma.newsletterSubscriber.updateMany({
    where: { unsubscribeTokenHash: tokenHash },
    data: {
      unsubscribedAt: new Date(),
      confirmationTokenHash: null,
      unsubscribeTokenHash: null,
    },
  });
  return result.count === 1;
}

/** @param {{ skip: number; take: number }} pagination */
export function listActiveNewsletterSubscribers(pagination) {
  return prisma.newsletterSubscriber.findMany({
    where: activeSubscriberWhere,
    skip: pagination.skip,
    take: pagination.take,
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, confirmedAt: true, createdAt: true },
  });
}

export function countActiveNewsletterSubscribers() {
  return prisma.newsletterSubscriber.count({ where: activeSubscriberWhere });
}

/** @param {string} id */
export async function deleteNewsletterSubscriber(id) {
  const result = await prisma.newsletterSubscriber.deleteMany({ where: { id } });
  return result.count === 1;
}
