import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShippingQuotes, getWeightInKilograms } from '../lib/shipping/quotes.mjs';

const carrier = { id: 'carrier-1', name: 'Example carrier', isActive: true };
const services = [
  { id: 'service-1', code: 'STANDARD', name: 'Standard', isActive: true, carrier },
  { id: 'service-inactive', code: 'INACTIVE', name: 'Inactive', isActive: false, carrier },
];
const zones = [{
  id: 'zone-1',
  countries: ['SY', 'LB'],
  isActive: true,
  rates: [
    { id: 'rate-1', serviceCode: 'STANDARD', currency: 'USD', baseCost: '3.2500', perKgCost: '1.5000' },
    { id: 'rate-2', serviceCode: 'INACTIVE', currency: 'USD', baseCost: 1, perKgCost: 0 },
    { id: 'rate-3', serviceCode: 'STANDARD', currency: 'SYP', baseCost: 100, perKgCost: 0 },
  ],
}];

test('calculates country and currency matching quotes from server rates and billable weight', () => {
  const quotes = calculateShippingQuotes({
    countryCode: 'SY',
    currency: 'USD',
    weightKg: 2.5,
    zones,
    services,
  });

  assert.deepEqual(quotes, [{
    carrierId: 'carrier-1',
    carrierName: 'Example carrier',
    serviceId: 'service-1',
    serviceName: 'Standard',
    serviceCode: 'STANDARD',
    rateId: 'rate-1',
    zoneId: 'zone-1',
    amount: 7,
    currency: 'USD',
  }]);
});

test('does not return rates for another currency or a country without an active zone', () => {
  assert.deepEqual(calculateShippingQuotes({
    countryCode: 'SY',
    currency: 'JOD',
    weightKg: 1,
    zones,
    services,
  }), []);
  assert.deepEqual(calculateShippingQuotes({
    countryCode: 'AE',
    currency: 'USD',
    weightKg: 1,
    zones,
    services,
  }), []);
});

test('rejects overlapping active country zones rather than choosing an arbitrary rate', () => {
  assert.throws(() => calculateShippingQuotes({
    countryCode: 'SY',
    currency: 'USD',
    weightKg: 1,
    zones: [...zones, { ...zones[0], id: 'zone-2' }],
    services,
  }), { message: 'AMBIGUOUS_SHIPPING_ZONES' });
});

test('rejects ambiguous service codes and invalid rate data', () => {
  assert.throws(() => calculateShippingQuotes({
    countryCode: 'SY',
    currency: 'USD',
    weightKg: 1,
    zones,
    services: [...services, { ...services[0], id: 'service-duplicate' }],
  }), { message: 'AMBIGUOUS_SHIPPING_SERVICE_CODE' });
  assert.throws(() => calculateShippingQuotes({
    countryCode: 'SY',
    currency: 'USD',
    weightKg: 1,
    zones: [{ ...zones[0], rates: [{ ...zones[0].rates[0], baseCost: '-1' }] }],
    services,
  }), { message: 'INVALID_SHIPPING_RATE' });
});

test('converts known variant weight units and rejects unsupported units', () => {
  assert.equal(getWeightInKilograms('1250', 'g'), 1.25);
  assert.equal(getWeightInKilograms('1.25', 'kg'), 1.25);
  assert.equal(getWeightInKilograms(null, null), 0);
  assert.throws(() => getWeightInKilograms(1, 'lb'), { message: 'UNSUPPORTED_WEIGHT_UNIT' });
});
