import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSafeRedirectUrl } from '../lib/auth/redirect-url.mjs';

const baseUrl = 'https://akaar.example';

test('allows relative paths on the configured origin', () => {
  assert.equal(resolveSafeRedirectUrl('/account?tab=orders', baseUrl), 'https://akaar.example/account?tab=orders');
});

test('allows absolute URLs on the exact configured origin', () => {
  assert.equal(resolveSafeRedirectUrl('https://akaar.example/search?q=phone', baseUrl), 'https://akaar.example/search?q=phone');
});

test('rejects external absolute URLs', () => {
  assert.equal(resolveSafeRedirectUrl('https://attacker.example/phish', baseUrl), baseUrl);
});

test('rejects prefix-lookalike hosts', () => {
  assert.equal(resolveSafeRedirectUrl('https://akaar.example.attacker.example/phish', baseUrl), baseUrl);
});

test('rejects protocol-relative external URLs', () => {
  assert.equal(resolveSafeRedirectUrl('//attacker.example/phish', baseUrl), baseUrl);
});

test('falls back safely for malformed base URLs', () => {
  assert.equal(resolveSafeRedirectUrl('https://attacker.example', 'not-a-url'), 'not-a-url');
});
