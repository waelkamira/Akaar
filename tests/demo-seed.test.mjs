import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { buildDemoProducts, categories, demoSellerProfiles } = require('../prisma/seed.js');
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/i;

test('builds ten demo products for each seeded commerce category only', () => {
  const products = buildDemoProducts();
  const productsByCategory = new Map();

  for (const product of products) {
    productsByCategory.set(
      product.categoryId,
      (productsByCategory.get(product.categoryId) || 0) + 1,
    );
  }

  const commerceCategories = categories.filter(({ slug }) => !['real-estate', 'jobs'].includes(slug));
  assert.equal(products.length, commerceCategories.length * 10);
  assert.equal(productsByCategory.size, commerceCategories.length);
  for (const category of categories) {
    if (['real-estate', 'jobs'].includes(category.slug)) {
      assert.equal(productsByCategory.has(category.id), false, category.name);
    } else {
      assert.equal(productsByCategory.get(category.id), 10, category.name);
    }
  }
});

test('assigns stable IDs and maps products to canonical commerce records', () => {
  const products = buildDemoProducts();
  const productIds = new Set(products.map(({ id }) => id));
  const sellerIds = new Set(demoSellerProfiles.map(({ sellerId }) => sellerId));
  const storeIds = new Set(demoSellerProfiles.map(({ storeId }) => storeId));

  assert.equal(productIds.size, products.length);
  assert.equal(sellerIds.size, demoSellerProfiles.length);
  assert.equal(storeIds.size, demoSellerProfiles.length);
  for (const product of products) {
    assert.ok(sellerIds.has(product.sellerId));
    assert.ok(storeIds.has(product.storeId));
    assert.match(product.id, uuidPattern);
    assert.match(product.categoryId, uuidPattern);
    assert.match(product.variantId, uuidPattern);
    assert.match(product.mediaId, uuidPattern);
    assert.match(product.sku, /^DEMO-/);
    assert.ok(product.image.startsWith('/images/categories/'));
    assert.ok(product.price > 0);
    assert.equal(product.quantity, 10);
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
