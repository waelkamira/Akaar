import { createHmac, timingSafeEqual } from 'node:crypto';

export function isStripeSandboxConfigured(env = process.env) {
  return Boolean(
    typeof env.STRIPE_SECRET_KEY === 'string'
    && env.STRIPE_SECRET_KEY.startsWith('sk_test_')
    && typeof env.STRIPE_WEBHOOK_SECRET === 'string'
    && env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_'),
  );
}

export function verifyStripeSignature(payload, signatureHeader, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (typeof payload !== 'string' || typeof signatureHeader !== 'string' || !secret) return false;
  const signatures = new Map();
  for (const part of signatureHeader.split(',')) {
    const separator = part.indexOf('=');
    if (separator <= 0) continue;
    const key = part.slice(0, separator);
    const value = part.slice(separator + 1);
    if (!signatures.has(key)) signatures.set(key, []);
    signatures.get(key).push(value);
  }

  const timestamp = Number(signatures.get('t')?.[0]);
  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest();
  return (signatures.get('v1') || []).some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const received = Buffer.from(signature, 'hex');
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}
