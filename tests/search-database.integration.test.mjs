import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
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
let nextServer;
let nextServerOutput = '';
const searchApiBaseUrl = 'http://127.0.0.1:3101';

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
  await prisma.review.createMany({
    data: [
      { userId, productId: productIds[0], rating: 5, comment: 'Search test high rating' },
      { userId, productId: productIds[1], rating: 2, comment: 'Search test low rating' },
    ],
  });

  // Exercise the actual Next.js route handlers against the isolated PostgreSQL database.
  nextServer = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3101'],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'development',
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_URL: searchApiBaseUrl,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'ci-only-search-api-secret',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  const captureServerOutput = (chunk) => {
    nextServerOutput = (nextServerOutput + chunk.toString()).slice(-12000);
  };
  nextServer.stdout?.on('data', captureServerOutput);
  nextServer.stderr?.on('data', captureServerOutput);

  let ready = false;
  for (let attempt = 0; attempt < 90; attempt += 1) {
    if (nextServer.exitCode !== null) {
      throw new Error(`Next.js development server exited before the search API became ready.\n${nextServerOutput || 'No server output was captured.'}`);
    }
    try {
      const response = await fetch(`${searchApiBaseUrl}/api/search/suggestions?query=Akaar`);
      if (response.status === 200) {
        ready = true;
        break;
      }
    } catch {
      // The server may still be compiling its first route.
    }
    await delay(1000);
  }
  if (!ready) throw new Error('Timed out waiting for the Next.js search API test server.');
});

after(async () => {
  if (nextServer) {
    if (nextServer.exitCode === null) {
      nextServer.kill('SIGTERM');
      await Promise.race([once(nextServer, 'exit'), delay(2000)]);
    }
    // Next dev and next build share .next; remove dev output before CI's production build.
    await rm('.next', { recursive: true, force: true });
  }
  if (productIds.length) await prisma.review.deleteMany({ where: { productId: { in: productIds } } });
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


test('Next.js POST /api/search applies combined filters and returns the expected response shape', { skip: !enabled }, async () => {
  const response = await fetch(`${searchApiBaseUrl}/api/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: 'Akaar Phone',
      categoryId,
      limit: 10,
      page: 1,
      filters: {
        priceMin: '80',
        priceMax: '150',
        city: 'Damascus',
        brand: 'Acme',
        subCategory: 'Phones',
      },
    }),
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload.products.map((product) => product.id), [productIds[0]]);
  assert.equal(payload.totalCount, 1);
  assert.equal(payload.hasMore, false);
  assert.equal(payload.page, 1);
  assert.equal(payload.limit, 10);
});

test('Next.js GET /api/search/suggestions excludes deleted and inactive products', { skip: !enabled }, async () => {
  const response = await fetch(`${searchApiBaseUrl}/api/search/suggestions?query=Akaar%20Phone`);
  assert.equal(response.status, 200);
  const payload = await response.json();

  assert.ok(payload.suggestions.includes('Akaar Phone Alpha'));
  assert.ok(payload.suggestions.includes('Akaar Phone Beta'));
  assert.ok(!payload.suggestions.includes('Akaar Phone Deleted'));
  assert.ok(!payload.suggestions.includes('Akaar Phone Inactive'));
});


test('Next.js search rating filter returns only products meeting the average-rating threshold', { skip: !enabled }, async () => {
  const response = await fetch(`${searchApiBaseUrl}/api/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: 'Akaar Phone',
      categoryId,
      limit: 10,
      page: 1,
      filters: { rating: '4' },
    }),
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload.products.map((product) => product.id), [productIds[0]]);
});

test('Next.js search API rejects malformed and oversized JSON bodies', { skip: !enabled }, async () => {
  const malformed = await fetch(`${searchApiBaseUrl}/api/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });
  assert.equal(malformed.status, 400);

  const oversized = await fetch(`${searchApiBaseUrl}/api/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: 'x'.repeat(70 * 1024) }),
  });
  assert.equal(oversized.status, 413);
});

test('Next.js search API paginates with stable order and accurate hasMore values', { skip: !enabled }, async () => {
  const requestPage = (page) => fetch(`${searchApiBaseUrl}/api/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ categoryId, limit: 1, page, filters: { city: 'Damascus', sortBy: 'cheapest' } }),
  });

  const firstResponse = await requestPage(1);
  const secondResponse = await requestPage(2);
  assert.equal(firstResponse.status, 200);
  assert.equal(secondResponse.status, 200);
  const first = await firstResponse.json();
  const second = await secondResponse.json();

  assert.deepEqual(first.products.map((product) => product.id), [productIds[0]]);
  assert.deepEqual(second.products.map((product) => product.id), [productIds[1]]);
  assert.equal(first.totalCount, 2);
  assert.equal(second.totalCount, 2);
  assert.equal(first.hasMore, true);
  assert.equal(second.hasMore, false);
});
