import test from 'node:test';
import assert from 'node:assert/strict';
import { canDeleteProduct } from '../lib/api/product-delete-access.mjs';

const product = { id: 'product-1', userId: 'seller-1' };

test('allows the product owner to delete their product', () => {
  assert.equal(canDeleteProduct({ id: 'seller-1', role: 'SELLER' }, product), true);
});

test('allows an authenticated administrator to delete a product', () => {
  assert.equal(canDeleteProduct({ id: 'admin-1', role: 'ADMIN' }, product), true);
});

test('rejects another non-admin user', () => {
  assert.equal(canDeleteProduct({ id: 'customer-1', role: 'CUSTOMER' }, product), false);
});

test('rejects missing user or product identity', () => {
  assert.equal(canDeleteProduct(null, product), false);
  assert.equal(canDeleteProduct({ id: 'seller-1', role: 'SELLER' }, null), false);
  assert.equal(canDeleteProduct({ role: 'ADMIN' }, product), false);
});
