import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { buildWhere, getQueryTerms, textConditions, SORT_ORDERS } from '../lib/api/search-query.mjs';

const enabled = process.env.SEARCH_DB_INTEGRATION === '1' && Boolean(process.env.DATABASE_URL);
const prisma = new PrismaClient();
const suffix = randomUUID();
const userId = `search-test-user-${suffix}`;
const categoryId = 900000 + Math.floor(Math.random() * 90000);
const productIds = [];
let categoryCreated = false;
let userCreated = false;

before(async () => {
  if (!enabled) return;
  await prisma.user.create({
    data: { id: userId, email: `search-test-${suffix}@example.invalid`, userName: 'Search Test Seller' },
  });
  userCreated = true;
  await prisma.category.create({
    data: { id: categoryId, name: `Search Test ${suffix}`, slug: `search-test-${suffix}` },
  });
  categoryCreated = true;
  const fixtures = [
    {
      id: `search-alpha-${suffix}`, title: 'Akaar Phone Alpha', basePrice: 100,
      city: 'Damascus', town: 'Midan', details: { brand: 'Acme', subCategory: 'Phones', year: 2024 },
      isActive: true, isDeleted: false, salesCount: 5,
    },
    {
      id: `search-beta-${suffix}`, title: 'Akaar Phone Beta', basePrice: 200,
      city: 'Damascus', town: 'Qadam', details: { brand: 'Acme', subCategory: 'Tablets' },
      isActive: true, isDeleted: false, salesCount: 15,
    },
    {
      id: `search-deleted-${suffix}`, title: 'Akaar Phone Deleted', basePrice: 50,
      city: 'Damascus', town: 'Midan', details: { brand: 'Acme', subCategory: 'Phones' },
      isActive: true, isDeleted: true, salesCount: 100,
    },
    {
      id: `search-inactive-${suffix}`, title: 'Akaar Phone Inactive', basePrice: 75,
      city: 'Damascus', town: 'Midan', details: { brand: 'Acme', subCategory: 'Phones' },
      isActive: false, isDeleted: false, salesCount: 80,
    },
  ];
  for (const fixture of fixtures) {
    await prisma.product.create({
      data: {
        ...fixture, userId, categoryId, categoryName: 'Electronics',
        images: [], stockQuantity: 3,
      },
    });
    productIds.push(fixture.id);
  }
});

after(async () => {
  if (productIds.length) await prisma.product.deleteMany({ where: { id: { in: productIds } } });
  if (categoryCreated) await prisma.category.delete({ where: { id: categoryId } });
  if (userCreated) await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});

test('PostgreSQL combines text, price, city, brand, and subcategory filters and excludes hidden products', { skip: !enabled }, async () => {
  const filters = {
    priceMin: '80', priceMax: '150', city: 'Damascus', brand: 'Acme', subCategory: 'Phones',
  };
  const where = buildWhere({ categoryId, filters });
  where.AND = [...(where.AND || []), { AND: textConditions(getQueryTerms('Akaar Phone')) }];
  const rows = await prisma.product.findMany({ where, select: { id: true, title: true, basePrice: true } });
  assert.deepEqual(rows.map((row) => row.id), [productIds[0]]);
});

test('PostgreSQL sorting and pagination return stable price-ordered pages and consistent counts', { skip: !enabled }, async () => {
  const where = buildWhere({ categoryId, filters: { city: 'Damascus' } });
  const [total, firstPage, secondPage] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, orderBy: SORT_ORDERS.cheapest, skip: 0, take: 1, select: { id: true, basePrice: true } }),
    prisma.product.findMany({ where, orderBy: SORT_ORDERS.cheapest, skip: 1, take: 1, select: { id: true, basePrice: true } }),
  ]);
  assert.equal(total, 2);
  assert.equal(firstPage[0]?.id, productIds[0]);
  assert.equal(secondPage[0]?.id, productIds[1]);
  assert.ok(firstPage[0].basePrice < secondPage[0].basePrice);
});
