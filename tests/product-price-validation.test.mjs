import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isProductPriceCurrency,
  parseProductPriceAmount,
} from '../lib/api/product-price-validation.mjs';

test('accepts monetary values with at most four decimal places', () => {
  assert.equal(parseProductPriceAmount('0'), '0');
  assert.equal(parseProductPriceAmount('123.4500'), '123.4500');
  assert.equal(parseProductPriceAmount('999999999999999.9999'), '999999999999999.9999');
});

test('rejects invalid or out-of-range monetary values', () => {
  for (const value of ['', '01', '-1', '1e3', '1.00001', '1000000000000000', 5]) {
    assert.equal(parseProductPriceAmount(value), null);
  }
});

test('accepts only uppercase three-letter currency codes', () => {
  assert.equal(isProductPriceCurrency('USD'), true);
  assert.equal(isProductPriceCurrency('usd'), false);
  assert.equal(isProductPriceCurrency('US'), false);
});
