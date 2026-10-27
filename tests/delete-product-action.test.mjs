import test from 'node:test';
import assert from 'node:assert/strict';
import { deleteProductAction } from '../lib/api/delete-product-action.mjs';

function fakePrisma(product = { id: 'product-1', userId: 'seller-1' }) {
  const calls = { findFirst: [], update: [] };
  return {
    calls,
    product: {
      async findFirst(args) {
        calls.findFirst.push(args);
        return product;
      },
      async update(args) {
        calls.update.push(args);
        return { id: args.where.id, ...args.data };
      },
    },
  };
}

test('requires an authenticated user before querying the product', async () => {
  const prisma = fakePrisma();
  const result = await deleteProductAction({ productId: 'product-1', authenticatedUser: null, prisma });
  assert.equal(result.status, 401);
  assert.equal(prisma.calls.findFirst.length, 0);
  assert.equal(prisma.calls.update.length, 0);
});

test('rejects invalid product IDs before querying the database', async () => {
  const prisma = fakePrisma();
  const result = await deleteProductAction({
    productId: '   ',
    authenticatedUser: { id: 'seller-1', role: 'SELLER' },
    prisma,
  });
  assert.equal(result.status, 400);
  assert.equal(prisma.calls.findFirst.length, 0);
});

test('allows the owner to soft-delete a product', async () => {
  const prisma = fakePrisma();
  const deletedAt = new Date('2026-01-02T03:04:05.000Z');
  const result = await deleteProductAction({
    productId: 'product-1',
    authenticatedUser: { id: 'seller-1', role: 'SELLER' },
    prisma,
    now: () => deletedAt,
  });
  assert.equal(result.status, 200);
  assert.deepEqual(prisma.calls.findFirst[0], {
    where: { id: 'product-1', isDeleted: false },
    select: { id: true, userId: true },
  });
  assert.deepEqual(prisma.calls.update[0], {
    where: { id: 'product-1' },
    data: { isDeleted: true, deletedAt },
  });
});

test('allows an administrator to soft-delete another user product', async () => {
  const prisma = fakePrisma();
  const result = await deleteProductAction({
    productId: 'product-1',
    authenticatedUser: { id: 'admin-1', role: 'ADMIN' },
    prisma,
  });
  assert.equal(result.status, 200);
  assert.equal(prisma.calls.update.length, 1);
});

test('does not delete a product owned by an unrelated non-admin user', async () => {
  const prisma = fakePrisma();
  const result = await deleteProductAction({
    productId: 'product-1',
    authenticatedUser: { id: 'customer-1', role: 'CUSTOMER' },
    prisma,
  });
  assert.equal(result.status, 404);
  assert.equal(prisma.calls.update.length, 0);
});

test('returns not found without updating when the product does not exist', async () => {
  const prisma = fakePrisma(null);
  const result = await deleteProductAction({
    productId: 'missing-product',
    authenticatedUser: { id: 'admin-1', role: 'ADMIN' },
    prisma,
  });
  assert.equal(result.status, 404);
  assert.equal(prisma.calls.update.length, 0);
});

test('converts database failures to a generic server error', async () => {
  const prisma = fakePrisma();
  prisma.product.findFirst = async () => { throw new Error('private database detail'); };
  const result = await deleteProductAction({
    productId: 'product-1',
    authenticatedUser: { id: 'seller-1', role: 'SELLER' },
    prisma,
  });
  assert.deepEqual(result, { status: 500, body: { error: 'Internal Server Error' } });
});
