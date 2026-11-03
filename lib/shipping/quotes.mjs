function asFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function roundCurrencyAmount(value, minorUnits) {
  const scale = 10 ** minorUnits;
  return Math.round((value + Number.EPSILON) * scale) / scale;
}

export function getWeightInKilograms(weight, unit) {
  if (weight === null || weight === undefined) return 0;
  const amount = asFiniteNumber(weight);
  if (amount === null || amount < 0) throw new Error('INVALID_VARIANT_WEIGHT');
  if (unit === 'kg' || unit === 'KG') return amount;
  if (unit === 'g' || unit === 'G') return amount / 1_000;
  throw new Error('UNSUPPORTED_WEIGHT_UNIT');
}

export function calculateShippingQuotes({ countryCode, currency, weightKg, zones, services, minorUnits = 4 }) {
  if (!/^[A-Z]{2}$/.test(countryCode) || !/^[A-Z]{3}$/.test(currency)) {
    throw new Error('INVALID_SHIPPING_DESTINATION');
  }
  if (!Number.isFinite(weightKg) || weightKg < 0) {
    throw new Error('INVALID_SHIPMENT_WEIGHT');
  }
  if (!Number.isInteger(minorUnits) || minorUnits < 0 || minorUnits > 4) {
    throw new Error('INVALID_CURRENCY_PRECISION');
  }

  const matchingZones = zones.filter(
    (zone) => zone.isActive && zone.countries.includes(countryCode),
  );
  if (matchingZones.length > 1) throw new Error('AMBIGUOUS_SHIPPING_ZONES');
  if (matchingZones.length === 0) return [];

  const zone = matchingZones[0];
  const activeServices = services.filter(
    (service) => service.isActive && service.carrier?.isActive,
  );
  const quotes = [];

  for (const rate of zone.rates) {
    if (rate.currency !== currency) continue;

    const matches = activeServices.filter((service) => service.code === rate.serviceCode);
    if (matches.length > 1) throw new Error('AMBIGUOUS_SHIPPING_SERVICE_CODE');
    if (matches.length === 0) continue;

    const baseCost = asFiniteNumber(rate.baseCost);
    const perKgCost = asFiniteNumber(rate.perKgCost);
    if (baseCost === null || perKgCost === null || baseCost < 0 || perKgCost < 0) {
      throw new Error('INVALID_SHIPPING_RATE');
    }

    const amount = roundCurrencyAmount(baseCost + perKgCost * weightKg, minorUnits);
    if (!Number.isFinite(amount)) throw new Error('INVALID_SHIPPING_RATE');

    const service = matches[0];
    quotes.push({
      carrierId: service.carrier.id,
      carrierName: service.carrier.name,
      serviceId: service.id,
      serviceName: service.name,
      serviceCode: service.code,
      rateId: rate.id,
      zoneId: zone.id,
      amount,
      currency,
    });
  }

  return quotes.sort(
    (left, right) => left.amount - right.amount
      || left.carrierName.localeCompare(right.carrierName)
      || left.serviceName.localeCompare(right.serviceName),
  );
}
