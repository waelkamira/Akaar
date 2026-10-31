import test from 'node:test';
import assert from 'node:assert/strict';
import { isSameOriginRequest } from '../lib/api/same-origin.mjs';
import { normalizeAnalyticsPath } from '../lib/analytics/normalize-path.mjs';

test('allows requests whose Origin matches the request origin', () => {
  const request = new Request('https://akaar.example/api/newsletter', {
    method: 'POST',
    headers: { Origin: 'https://akaar.example' },
  });
  assert.equal(isSameOriginRequest(request), true);
});

test('rejects cross-origin, malformed, and missing Origin headers', () => {
  const crossOriginRequest = new Request('https://akaar.example/api/newsletter', {
    method: 'POST',
    headers: { Origin: 'https://attacker.example' },
  });
  const malformedOriginRequest = new Request('https://akaar.example/api/newsletter', {
    method: 'POST',
    headers: { Origin: 'not-an-origin' },
  });
  const missingOriginRequest = new Request('https://akaar.example/api/newsletter', { method: 'POST' });

  assert.equal(isSameOriginRequest(crossOriginRequest), false);
  assert.equal(isSameOriginRequest(malformedOriginRequest), false);
  assert.equal(isSameOriginRequest(missingOriginRequest), false);
});

test('aggregates public routes without retaining user-specific identifiers', () => {
  assert.equal(normalizeAnalyticsPath('/post/123e4567-e89b-12d3-a456-426614174000'), '/post/:id');
  assert.equal(normalizeAnalyticsPath('/pages/terms'), '/pages/terms');
  assert.equal(normalizeAnalyticsPath('/orders/123e4567-e89b-12d3-a456-426614174000'), null);
});
