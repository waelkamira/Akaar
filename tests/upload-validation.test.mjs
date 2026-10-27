import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_IMAGE_SIZE, safeImageFileName, validateImageContent, validateImageFile } from '../lib/uploads/validate-image.mjs';

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
  assert.match(validateImageFile(fakeFile({ size: MAX_IMAGE_SIZE + 1 })), /5 ميغابايت/);
  assert.match(validateImageFile(fakeFile({ size: 0 })), /5 ميغابايت/);
});

test('safeImageFileName strips directory components and unsafe characters', () => {
  assert.equal(safeImageFileName('../../my photo?.png'), 'my-photo-.png');
  assert.equal(safeImageFileName('C:\\fakepath\\photo.png'), 'photo.png');
  assert.equal(safeImageFileName(''), 'image');
});

function fileWithBytes(type, values) {
  const bytes = Uint8Array.from(values);
  return { type, size: bytes.length, name: 'image.bin', arrayBuffer: async () => bytes.buffer };
}

test('image content validation checks signatures rather than trusting MIME type', async () => {
  assert.equal(await validateImageContent(fileWithBytes('image/jpeg', [0xff, 0xd8, 0xff, 0x00])), null);
  assert.equal(await validateImageContent(fileWithBytes('image/png', [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), null);
  assert.equal(await validateImageContent(fileWithBytes('image/webp', [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])), null);
  assert.equal(await validateImageContent(fileWithBytes('image/avif', [0, 0, 0, 0, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66])), null);
});

test('image content validation rejects MIME-spoofed and truncated files', async () => {
  assert.match(await validateImageContent(fileWithBytes('image/jpeg', [0x3c, 0x73, 0x76, 0x67])), /لا يطابق/);
  assert.match(await validateImageContent(fileWithBytes('image/png', [0x89, 0x50, 0x4e])), /لا يطابق/);
});
