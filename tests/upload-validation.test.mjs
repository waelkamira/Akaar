import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_IMAGE_SIZE, safeImageFileName, validateImageFile } from '../lib/uploads/validate-image.mjs';

function fakeFile({ type = 'image/jpeg', size = 1024, name = 'photo.jpg' } = {}) {
  return { type, size, name, arrayBuffer: async () => new ArrayBuffer(0) };
}

test('image validation accepts supported image formats under the limit', () => {
  for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/avif']) {
    assert.equal(validateImageFile(fakeFile({ type })), null);
  }
});

test('image validation rejects missing files, unsupported formats and oversize files', () => {
  assert.equal(validateImageFile(null), 'ملف الصورة مطلوب.');
  assert.match(validateImageFile(fakeFile({ type: 'image/svg+xml' })), /نوع الصورة/);
  assert.match(validateImageFile(fakeFile({ size: MAX_IMAGE_SIZE + 1 })), /10 ميغابايت/);
  assert.match(validateImageFile(fakeFile({ size: 0 })), /10 ميغابايت/);
});

test('safeImageFileName strips directory components and unsafe characters', () => {
  assert.equal(safeImageFileName('../../my photo?.png'), 'my-photo-.png');
  assert.equal(safeImageFileName('C:\\fakepath\\photo.png'), 'photo.png');
  assert.equal(safeImageFileName(''), 'image');
});
