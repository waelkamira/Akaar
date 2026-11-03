import test from 'node:test';
import assert from 'node:assert/strict';
import { replaceProductMedia } from '../lib/admin/product-media.mjs';

test('replaces product media in order and marks only the first image as primary', async () => {
  const calls = [];
  const database = {
    productMedia: {
      async deleteMany(args) {
        calls.push(['deleteMany', args]);
      },
      async createMany(args) {
        calls.push(['createMany', args]);
      },
    },
  };

  await replaceProductMedia(database, 'product-1', ['/first.jpg', 'https://cdn.example.com/second.jpg']);

  assert.deepEqual(calls, [
    ['deleteMany', { where: { productId: 'product-1' } }],
    ['createMany', {
      data: [
        {
          productId: 'product-1',
          storageKey: '/first.jpg',
          mediaType: 'IMAGE',
          sortOrder: 0,
          isPrimary: true,
        },
        {
          productId: 'product-1',
          storageKey: 'https://cdn.example.com/second.jpg',
          mediaType: 'IMAGE',
          sortOrder: 1,
          isPrimary: false,
        },
      ],
    }],
  ]);
});

test('clears product media without attempting to create empty rows', async () => {
  const calls = [];
  const database = {
    productMedia: {
      async deleteMany(args) {
        calls.push(['deleteMany', args]);
      },
      async createMany(args) {
        calls.push(['createMany', args]);
      },
    },
  };

  await replaceProductMedia(database, 'product-1', []);

  assert.deepEqual(calls, [['deleteMany', { where: { productId: 'product-1' } }]]);
});
