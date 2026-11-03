import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAnalyticsPath } from '../lib/analytics/normalize-path.mjs';

test('excludes private and operational route prefixes without excluding neighboring public paths', () => {
  for (const prefix of [
    '/admin',
    '/api',
    '/cart',
    '/favorite',
    '/login',
    '/newsletter',
    '/orders',
    '/profile',
    '/register',
    '/seller',
  ]) {
    assert.equal(normalizeAnalyticsPath(prefix), null);
    assert.equal(normalizeAnalyticsPath(`${prefix}/item`), null);
  }

  assert.equal(normalizeAnalyticsPath('/cartoon'), '/cartoon');
  assert.equal(normalizeAnalyticsPath('/seller-info'), '/seller-info');
});

test('replaces user-specific identifiers while preserving public path segments', () => {
  assert.equal(
    normalizeAnalyticsPath('/pages/terms/123e4567-e89b-12d3-a456-426614174000'),
    '/pages/terms/:id',
  );
  assert.equal(normalizeAnalyticsPath('/stores/user@example.com'), '/stores/:id');
  assert.equal(normalizeAnalyticsPath('/products/abcdefghijklmnopqrst'), '/products/:id');
});

test('rejects non-path and protocol-relative values', () => {
  assert.equal(normalizeAnalyticsPath('https://akaar.example/products'), null);
  assert.equal(normalizeAnalyticsPath('//akaar.example/products'), null);
  assert.equal(normalizeAnalyticsPath(null), null);
});
