import test from 'node:test';
import assert from 'node:assert/strict';
import {
  areValidProductImageUrls,
  isValidProductImageUrl,
  isValidProductLink,
} from '../lib/api/product-media-validation.mjs';

test('accepts HTTP(S) image URLs and same-origin paths', () => {
  assert.equal(isValidProductImageUrl('https://cdn.example.com/image.webp'), true);
  assert.equal(isValidProductImageUrl('http://localhost:3000/image.png'), true);
  assert.equal(isValidProductImageUrl('/images/placeholder.jpg'), true);
  assert.equal(areValidProductImageUrls(['/image.jpg', 'https://cdn.example.com/a.png']), true);
});

test('rejects unsafe, malformed, oversized, and credential-bearing image URLs', () => {
  for (const value of [
    '', 'javascript:alert(1)', 'data:image/svg+xml,<svg/>',
    '//attacker.example/image.png', 'https://user:pass@example.com/a.png',
    'https://example.com/a\\b.png', '/bad\npath.png',
    'https://example.com/' + 'x'.repeat(2048),
  ]) assert.equal(isValidProductImageUrl(value), false, String(value));
  assert.equal(areValidProductImageUrls(['https://cdn.example.com/a.png', 123]), false);
  assert.equal(areValidProductImageUrls(Array.from({ length: 21 }, () => '/image.png')), false);
});

test('product links must be bounded absolute HTTP(S) URLs or empty/null', () => {
  assert.equal(isValidProductLink('https://example.com/item'), true);
  assert.equal(isValidProductLink('http://localhost:3000/item'), true);
  assert.equal(isValidProductLink(''), true);
  assert.equal(isValidProductLink(null), true);
  assert.equal(isValidProductLink('/relative/path'), false);
  assert.equal(isValidProductLink('javascript:alert(1)'), false);
  assert.equal(isValidProductLink('//attacker.example/item'), false);
  assert.equal(isValidProductLink('https://user:pass@example.com/item'), false);
  assert.equal(isValidProductLink('https://example.com/' + 'x'.repeat(2000)), false);
});
