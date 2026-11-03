import { createAuthToken, hashAuthToken } from './tokens.mjs';
import { savePasswordResetToken, saveVerificationToken } from './email-token-repository.mjs';
import { sendPasswordResetEmail, sendVerificationEmail } from './email.mjs';

const emailTokenDependencies = {
  createAuthToken,
  hashAuthToken,
  saveVerificationToken,
  savePasswordResetToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
};

export async function issueVerificationEmail(email, dependencies = emailTokenDependencies) {
  const token = dependencies.createAuthToken();
  await dependencies.saveVerificationToken({
    identifier: email,
    tokenHash: dependencies.hashAuthToken(token),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  await dependencies.sendVerificationEmail(email, token);
}

export async function issuePasswordResetEmail(user, dependencies = emailTokenDependencies) {
  const token = dependencies.createAuthToken();
  await dependencies.savePasswordResetToken({
    userId: user.id,
    tokenHash: dependencies.hashAuthToken(token),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
  await dependencies.sendPasswordResetEmail(user.email, token);
}
