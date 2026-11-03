import assert from 'node:assert/strict';
import test from 'node:test';
import { appendProductPriceVersion } from '../lib/admin/product-price-history.mjs';

test('closes the current price and preserves the next scheduled price window', async () => {
  const now = new Date('2026-02-01T12:00:00.000Z');
  const currentPrice = { validFrom: new Date('2026-01-01T00:00:00.000Z') };
  const nextScheduledPrice = { validFrom: new Date('2026-03-01T00:00:00.000Z') };
  const calls = [];
  const transaction = {
    productPrice: {
      async findFirst(args) {
        calls.push(['findFirst', args]);
        return args.where.validFrom.lte ? currentPrice : nextScheduledPrice;
      },
      async updateMany(args) {
        calls.push(['updateMany', args]);
      },
      async create(args) {
        calls.push(['create', args]);
        return { id: 'new-price', ...args.data };
      },
    },
  };

  const result = await appendProductPriceVersion(transaction, {
    variantId: 'variant-1',
    currency: 'USD',
    amount: '15.25',
    compareAt: '20.00',
  }, now);

  assert.equal(result.validFrom, now);
  assert.equal(result.validUntil, nextScheduledPrice.validFrom);
  assert.deepEqual(calls.map(([name]) => name), ['findFirst', 'findFirst', 'updateMany', 'create']);
  assert.deepEqual(calls[2][1].data, { validUntil: now });
  assert.deepEqual(calls[3][1].data, {
    variantId: 'variant-1',
    currency: 'USD',
    amount: '15.25',
    compareAt: '20.00',
    validFrom: now,
    validUntil: nextScheduledPrice.validFrom,
  });
});

test('moves a colliding price start forward by one millisecond', async () => {
  const now = new Date('2026-02-01T12:00:00.000Z');
  const nextScheduledPrice = { validFrom: new Date('2026-02-02T00:00:00.000Z') };
  let created;
  const transaction = {
    productPrice: {
      async findFirst(args) {
        return args.where.validFrom.lte ? { validFrom: now } : nextScheduledPrice;
      },
      async updateMany() {},
      async create(args) {
        created = args.data;
        return args.data;
      },
    },
  };

  await appendProductPriceVersion(transaction, {
    variantId: 'variant-1',
    currency: 'USD',
    amount: '15',
    compareAt: null,
  }, now);

  assert.equal(created.validFrom.getTime(), now.getTime() + 1);
});

test('rejects a collision with a scheduled price instead of overlapping validity windows', async () => {
  const now = new Date('2026-02-01T12:00:00.000Z');
  const scheduledPrice = { validFrom: new Date(now.getTime() + 1) };
  const transaction = {
    productPrice: {
      async findFirst(args) {
        return args.where.validFrom.lte ? { validFrom: now } : scheduledPrice;
      },
      async updateMany() {
        assert.fail('must not close prices when no non-overlapping start time is available');
      },
      async create() {
        assert.fail('must not create an overlapping price version');
      },
    },
  };

  await assert.rejects(
    appendProductPriceVersion(transaction, {
      variantId: 'variant-1',
      currency: 'USD',
      amount: '15',
      compareAt: null,
    }, now),
    { message: 'PRODUCT_PRICE_WINDOW_CONFLICT' },
  );
});
