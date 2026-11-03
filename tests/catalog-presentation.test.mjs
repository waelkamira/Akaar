import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatCatalogPrice,
  getAvailableInventory,
  getCatalogImageSource,
  getCurrentCatalogPrices,
} from '../lib/catalog/presentation.mjs';

test('resolves seeded media keys to public assets and rejects unsafe paths', () => {
  assert.equal(getCatalogImageSource('cars.png'), '/images/categories/cars.png');
  assert.equal(getCatalogImageSource('https://cdn.example.com/product.png'), 'https://cdn.example.com/product.png');
  assert.equal(getCatalogImageSource('/uploads/product.png'), '/uploads/product.png');
  assert.equal(getCatalogImageSource('//cdn.example.com/product.png'), null);
  assert.equal(getCatalogImageSource('../product.png'), null);
  assert.equal(getCatalogImageSource('http://cdn.example.com/product.png'), null);
});

test('selects only the latest current price for each currency', () => {
  const latest = {
    amount: '12',
    currency: 'USD',
    validFrom: new Date('2026-04-01T00:00:00Z'),
  };
  assert.deepEqual(getCurrentCatalogPrices([
    { amount: '10', currency: 'USD', validFrom: new Date('2026-01-01T00:00:00Z') },
    { amount: '20', currency: 'EUR', validFrom: new Date('2026-02-01T00:00:00Z') },
    latest,
  ]), [
    { amount: '20', currency: 'EUR', validFrom: new Date('2026-02-01T00:00:00Z') },
    latest,
  ]);
});

test('calculates only unreserved stock from inventory rows', () => {
  assert.equal(getAvailableInventory([
    { onHand: 10, reserved: 3 },
    { onHand: 4, reserved: 4 },
    { onHand: 2, reserved: 7 },
    { onHand: 3.5, reserved: 0 },
  ]), 7);
});

test('formats a price with its configured symbol and precision', () => {
  const expectedAmount = new Intl.NumberFormat('ar', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(1234.5);
  assert.equal(formatCatalogPrice({
    amount: '1234.5',
    currency: 'USD',
    currencyRef: { symbol: '$', minorUnits: 2 },
  }), `$ ${expectedAmount}`);
});

test('uses the currency code when no symbol is configured', () => {
  const expectedAmount = new Intl.NumberFormat('ar', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(12);
  assert.equal(formatCatalogPrice({
    amount: '12',
    currency: 'EUR',
    currencyRef: { symbol: null, minorUnits: 0 },
  }), `${expectedAmount} EUR`);
});
