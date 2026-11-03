export function parseProductPriceAmount(value) {
  if (typeof value !== 'string' || value.length > 20) return null;
  return /^(?:0|[1-9]\d{0,14})(?:\.\d{1,4})?$/.test(value) ? value : null;
}

export function isProductPriceCurrency(value) {
  return typeof value === 'string' && /^[A-Z]{3}$/.test(value);
}
