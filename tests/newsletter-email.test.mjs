import assert from 'node:assert/strict';
import test from 'node:test';
import { sendNewsletterConfirmation } from '../lib/newsletter/email.mjs';

const mailEnvironmentKeys = ['APP_URL', 'NEXTAUTH_URL', 'RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'NODE_ENV'];

async function withMailerEnvironment(overrides, operation) {
  const previousEnvironment = Object.fromEntries(
    mailEnvironmentKeys.map((key) => [key, process.env[key]]),
  );
  const previousFetch = globalThis.fetch;
  for (const key of mailEnvironmentKeys) delete process.env[key];
  Object.assign(process.env, overrides);

  try {
    await operation();
  } finally {
    for (const key of mailEnvironmentKeys) {
      if (previousEnvironment[key] === undefined) delete process.env[key];
      else process.env[key] = previousEnvironment[key];
    }
    globalThis.fetch = previousFetch;
  }
}

test('sends confirmation and unsubscribe links through the configured Resend adapter', async () => {
  await withMailerEnvironment({
    APP_URL: 'https://akaar.example',
    RESEND_API_KEY: 'test-key',
    RESEND_FROM_EMAIL: 'news@akaar.example',
    NODE_ENV: 'test',
  }, async () => {
    let request;
    globalThis.fetch = async (url, options) => {
      request = { url, options };
      return new Response(null, { status: 200 });
    };

    await sendNewsletterConfirmation('buyer@example.invalid', 'confirm-token', 'unsubscribe-token');

    assert.equal(request.url, 'https://api.resend.com/emails');
    assert.equal(request.options.headers.Authorization, 'Bearer test-key');
    const body = JSON.parse(request.options.body);
    assert.equal(body.to[0], 'buyer@example.invalid');
    assert.match(body.text, /https:\/\/akaar\.example\/newsletter\/confirm\?token=confirm-token/);
    assert.match(body.text, /https:\/\/akaar\.example\/newsletter\/unsubscribe\?token=unsubscribe-token/);
  });
});

test('reports provider delivery failures instead of returning success', async () => {
  await withMailerEnvironment({
    APP_URL: 'https://akaar.example',
    RESEND_API_KEY: 'test-key',
    RESEND_FROM_EMAIL: 'news@akaar.example',
    NODE_ENV: 'test',
  }, async () => {
    globalThis.fetch = async () => new Response(null, { status: 503 });
    await assert.rejects(
      sendNewsletterConfirmation('buyer@example.invalid', 'confirm-token', 'unsubscribe-token'),
      /RESEND_DELIVERY_FAILED_503/,
    );
  });
});

test('requires HTTPS for production newsletter links', async () => {
  await withMailerEnvironment({
    APP_URL: 'http://akaar.example',
    RESEND_API_KEY: 'test-key',
    RESEND_FROM_EMAIL: 'news@akaar.example',
    NODE_ENV: 'production',
  }, async () => {
    globalThis.fetch = async () => {
      throw new Error('fetch must not be called for insecure production URLs');
    };
    await assert.rejects(
      sendNewsletterConfirmation('buyer@example.invalid', 'confirm-token', 'unsubscribe-token'),
      /NEWSLETTER_APP_URL_MUST_USE_HTTPS/,
    );
  });
});
