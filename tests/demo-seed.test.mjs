import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { buildDemoProducts, categories, demoSellerProfiles } = require('../prisma/seed.js');

test('builds ten demo products for each seeded category', () => {
  const products = buildDemoProducts();
  const productsByCategory = new Map();

  for (const product of products) {
    productsByCategory.set(
      product.categoryId,
      (productsByCategory.get(product.categoryId) || 0) + 1,
    );
  }

  assert.equal(products.length, categories.length * 10);
  assert.equal(productsByCategory.size, categories.length);
  for (const category of categories) {
    assert.equal(productsByCategory.get(category.id), 10, category.name);
  }
});

test('assigns stable product IDs and links every demo product to a demo seller', () => {
  const products = buildDemoProducts();
  const productIds = new Set(products.map(({ id }) => id));
  const sellerIds = new Set(demoSellerProfiles.map(({ sellerId }) => sellerId));

  assert.equal(productIds.size, products.length);
  assert.equal(sellerIds.size, demoSellerProfiles.length);
  for (const product of products) {
    assert.ok(sellerIds.has(product.sellerId));
    assert.equal(product.userId, demoSellerProfiles.find(({ sellerId }) => sellerId === product.sellerId).userId);
    assert.equal(product.approvalStatus, 'APPROVED');
    assert.equal(product.images.length, 1);
    assert.ok(product.images[0].startsWith('/images/categories/'));
  }
});

test('preserves IDs from the earlier five-product demo seed', () => {
  const products = buildDemoProducts();
  const expectedLegacyIds = [
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8000-000000000004',
    '00000000-0000-4000-8000-000000000005',
  ];

  for (const id of expectedLegacyIds) {
    assert.ok(products.some((product) => product.id === id));
  }
});
