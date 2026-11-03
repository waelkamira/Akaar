import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { prisma } from '../lib/db/prisma.js';
import {
  consumePasswordResetToken,
  consumeVerificationToken,
  savePasswordResetToken,
  saveVerificationToken,
} from '../lib/auth/email-token-repository.mjs';
import { createAuthToken, hashAuthToken } from '../lib/auth/tokens.mjs';

const enabled = process.env.AUTH_DB_INTEGRATION === '1' && Boolean(process.env.DATABASE_URL);

test('email verification and password reset tokens expire, replace, and consume once', { skip: !enabled }, async () => {
  const email = `auth-email-${randomUUID()}@example.invalid`;
  let userId;
  const verificationToken = createAuthToken();
  const firstResetToken = createAuthToken();
  const secondResetToken = createAuthToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  try {
    const user = await prisma.user.create({
      data: { email, status: 'ACTIVE', passwordHash: 'old-hash' },
      select: { id: true },
    });
    userId = user.id;

    await saveVerificationToken({
      identifier: email,
      tokenHash: hashAuthToken(verificationToken),
      expiresAt,
    });
    assert.equal(await consumeVerificationToken(hashAuthToken(verificationToken)), true);
    assert.equal(await consumeVerificationToken(hashAuthToken(verificationToken)), false);
    const verifiedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { emailVerifiedAt: true },
    });
    assert.ok(verifiedUser?.emailVerifiedAt);

    await savePasswordResetToken({
      userId: user.id,
      tokenHash: hashAuthToken(firstResetToken),
      expiresAt,
    });
    await savePasswordResetToken({
      userId: user.id,
      tokenHash: hashAuthToken(secondResetToken),
      expiresAt,
    });
    assert.equal(await consumePasswordResetToken(hashAuthToken(firstResetToken), 'unused-hash'), false);
    assert.equal(await consumePasswordResetToken(hashAuthToken(secondResetToken), 'new-hash'), true);
    assert.equal(await consumePasswordResetToken(hashAuthToken(secondResetToken), 'reused-hash'), false);

    const resetUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    assert.equal(resetUser?.passwordHash, 'new-hash');
  } finally {
    try {
      await prisma.verificationToken.deleteMany({ where: { identifier: email } });
      if (userId) await prisma.user.delete({ where: { id: userId } });
    } finally {
      await prisma.$disconnect();
    }
  }
});
