import { prisma } from '../db/prisma.js';

export async function saveVerificationToken({ identifier, tokenHash, expiresAt }) {
  return prisma.$transaction(async (transaction) => {
    await transaction.verificationToken.updateMany({
      where: { identifier, usedAt: null },
      data: { usedAt: new Date() },
    });
    return transaction.verificationToken.create({
      data: { identifier, tokenHash, expiresAt },
    });
  });
}

export async function consumeVerificationToken(tokenHash) {
  return prisma.$transaction(async (transaction) => {
    const now = new Date();
    const token = await transaction.verificationToken.findUnique({
      where: { tokenHash },
      select: { id: true, identifier: true, expiresAt: true, usedAt: true },
    });
    if (!token || token.usedAt || token.expiresAt <= now) return false;

    const user = await transaction.user.findUnique({
      where: { email: token.identifier },
      select: { id: true, status: true, emailVerifiedAt: true },
    });
    if (!user || user.status === 'DELETED') return false;

    const consumed = await transaction.verificationToken.updateMany({
      where: { id: token.id, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
    if (consumed.count !== 1) return false;
    if (!user.emailVerifiedAt) {
      await transaction.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: now },
      });
    }
    return true;
  });
}

export async function savePasswordResetToken({ userId, tokenHash, expiresAt }) {
  return prisma.$transaction(async (transaction) => {
    await transaction.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
    return transaction.passwordResetToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  });
}

export async function consumePasswordResetToken(tokenHash, passwordHash) {
  return prisma.$transaction(async (transaction) => {
    const now = new Date();
    const token = await transaction.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, expiresAt: true, usedAt: true },
    });
    if (!token || token.usedAt || token.expiresAt <= now) return false;

    const user = await transaction.user.findUnique({
      where: { id: token.userId },
      select: { id: true, status: true },
    });
    if (!user || user.status === 'DELETED') return false;

    const consumed = await transaction.passwordResetToken.updateMany({
      where: { id: token.id, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
    if (consumed.count !== 1) return false;
    await transaction.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: now },
    });
    await transaction.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
    return true;
  });
}
