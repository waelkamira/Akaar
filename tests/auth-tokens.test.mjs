import assert from 'node:assert/strict';
import test from 'node:test';
import { createAuthToken, hashAuthToken } from '../lib/auth/tokens.mjs';
import { isAuthEmailConfigured, sendPasswordResetEmail, sendVerificationEmail } from '../lib/auth/email.mjs';
import { issuePasswordResetEmail, issueVerificationEmail } from '../lib/auth/email-token-service.mjs';

test('auth tokens are random URL-safe values and are stored as hashes', () => {
  const first = createAuthToken();
  const second = createAuthToken();

  assert.match(first, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(first, second);
  assert.match(hashAuthToken(first), /^[a-f0-9]{64}$/);
  assert.notEqual(hashAuthToken(first), first);
});

test('auth email configuration requires a secure production base URL', () => {
  assert.equal(isAuthEmailConfigured({
    APP_URL: 'https://akaar.example',
    RESEND_API_KEY: 'test-key',
    RESEND_FROM_EMAIL: 'auth@akaar.example',
    NODE_ENV: 'production',
  }), true);
  assert.equal(isAuthEmailConfigured({
    APP_URL: 'http://akaar.example',
    RESEND_API_KEY: 'test-key',
    RESEND_FROM_EMAIL: 'auth@akaar.example',
    NODE_ENV: 'production',
  }), false);
  assert.equal(isAuthEmailConfigured({}), false);
});

test('sends verification and password reset links through Resend', async () => {
  const requests = [];
  const options = {
    env: {
      APP_URL: 'https://akaar.example',
      RESEND_API_KEY: 'test-key',
      RESEND_FROM_EMAIL: 'auth@akaar.example',
      NODE_ENV: 'test',
    },
    fetchImpl: async (url, requestOptions) => {
      requests.push({ url, options: requestOptions });
      return new Response(null, { status: 200 });
    },
  };

  await sendVerificationEmail('buyer@example.invalid', 'verify-token', options);
  await sendPasswordResetEmail('buyer@example.invalid', 'reset-token', options);

  assert.equal(requests.length, 2);
  assert.equal(requests[0].url, 'https://api.resend.com/emails');
  assert.equal(requests[0].options.headers.Authorization, 'Bearer test-key');
  const verificationMessage = JSON.parse(requests[0].options.body);
  assert.match(verificationMessage.text, /https:\/\/akaar\.example\/verify-email\?token=verify-token/);
  const resetMessage = JSON.parse(requests[1].options.body);
  assert.match(resetMessage.text, /https:\/\/akaar\.example\/reset-password\?token=reset-token/);
});

test('reports mail delivery failures', async () => {
  await assert.rejects(
    sendVerificationEmail('buyer@example.invalid', 'verify-token', {
      env: {
        APP_URL: 'https://akaar.example',
        RESEND_API_KEY: 'test-key',
        RESEND_FROM_EMAIL: 'auth@akaar.example',
        NODE_ENV: 'test',
      },
      fetchImpl: async () => new Response(null, { status: 503 }),
    }),
    /AUTH_EMAIL_DELIVERY_FAILED_503/,
  );
});

test('issues hashed verification and password reset tokens before delivery', async () => {
  const saved = [];
  const delivered = [];
  const dependencies = {
    createAuthToken: () => 'raw-test-token',
    hashAuthToken: (token) => `hashed:${token}`,
    saveVerificationToken: async (input) => saved.push({ type: 'verify', ...input }),
    savePasswordResetToken: async (input) => saved.push({ type: 'reset', ...input }),
    sendVerificationEmail: async (...args) => delivered.push({ type: 'verify', args }),
    sendPasswordResetEmail: async (...args) => delivered.push({ type: 'reset', args }),
  };

  await issueVerificationEmail('buyer@example.invalid', dependencies);
  await issuePasswordResetEmail({ id: 'user-id', email: 'buyer@example.invalid' }, dependencies);

  assert.equal(saved[0].tokenHash, 'hashed:raw-test-token');
  assert.equal(saved[0].identifier, 'buyer@example.invalid');
  assert.equal(saved[0].expiresAt.getTime() - Date.now() <= 24 * 60 * 60 * 1000, true);
  assert.equal(saved[1].userId, 'user-id');
  assert.equal(saved[1].expiresAt.getTime() - Date.now() <= 60 * 60 * 1000, true);
  assert.deepEqual(delivered.map(({ type }) => type), ['verify', 'reset']);
});
