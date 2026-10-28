import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidProfileImage } from '../lib/api/profile-image.mjs';

test('accepts same-origin paths, HTTP(S) URLs, and clearing the image', () => {
  assert.equal(isValidProfileImage('/placeholder.jpg'), true);
  assert.equal(isValidProfileImage('/images/user.png?size=small'), true);
  assert.equal(isValidProfileImage('https://cdn.example.com/user.webp'), true);
  assert.equal(isValidProfileImage('http://localhost:3000/avatar.png'), true);
  assert.equal(isValidProfileImage(null), true);
});

test('rejects empty, oversized, non-string, and unsafe URL values', () => {
  assert.equal(isValidProfileImage(''), false);
  assert.equal(isValidProfileImage('   '), false);
  assert.equal(isValidProfileImage(123), false);
  assert.equal(isValidProfileImage({ url: 'https://example.com/a.png' }), false);
  assert.equal(isValidProfileImage('javascript:alert(1)'), false);
  assert.equal(isValidProfileImage('data:image/svg+xml,<svg/>'), false);
  assert.equal(isValidProfileImage('//attacker.example/image.png'), false);
  assert.equal(isValidProfileImage('https://user:pass@example.com/a.png'), false);
  assert.equal(isValidProfileImage('https://example.com/' + 'a'.repeat(2048)), false);
  assert.equal(isValidProfileImage('/bad\\npath.png'), false);
});
