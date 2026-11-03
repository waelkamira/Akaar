const seededCatalogImages = new Set([
  'agriculture.png',
  'babySupplies.png',
  'bags.png',
  'beauty.png',
  'bikes.png',
  'books.png',
  'cars.png',
  'computers.png',
  'electronics.png',
  'fashion.png',
  'furniture.png',
  'games.png',
  'gifts.png',
  'health.png',
  'jewelry.png',
  'kitchen.png',
  'phones.png',
  'shoes.png',
  'sports.png',
  'tools.png',
]);

export function getCatalogImageSource(storageKey) {
  if (typeof storageKey !== 'string') return null;
  if (storageKey.startsWith('https://')) return storageKey;
  if (storageKey.startsWith('/') && !storageKey.startsWith('//')) return storageKey;
  if (seededCatalogImages.has(storageKey)) return `/images/categories/${storageKey}`;
  return null;
}

export function getCurrentCatalogPrices(prices) {
  const latestByCurrency = new Map();

  for (const price of prices) {
    const validFrom = new Date(price.validFrom).getTime();
    const current = latestByCurrency.get(price.currency);
    if (!current || validFrom > new Date(current.validFrom).getTime()) {
      latestByCurrency.set(price.currency, price);
    }
  }

  return [...latestByCurrency.values()].sort((left, right) => left.currency.localeCompare(right.currency));
}

export function getAvailableInventory(inventory, sellerId) {
  return inventory.reduce((total, item) => {
    if (sellerId && item.warehouse?.sellerId && item.warehouse.sellerId !== sellerId) {
      return total;
    }
    const available = Number.isInteger(item.onHand) && Number.isInteger(item.reserved)
      ? Math.max(0, item.onHand - item.reserved)
      : 0;
    return total + available;
  }, 0);
}

export function formatCatalogPrice(price) {
  const amount = Number(price.amount);
  const minorUnits = Number.isInteger(price.currencyRef.minorUnits)
    ? Math.max(0, Math.min(price.currencyRef.minorUnits, 6))
    : 2;
  const formattedAmount = Number.isFinite(amount)
    ? new Intl.NumberFormat('ar', {
        minimumFractionDigits: minorUnits,
        maximumFractionDigits: minorUnits,
      }).format(amount)
    : price.amount;
  const symbol = price.currencyRef.symbol?.trim();
  return symbol ? `${symbol} ${formattedAmount}` : `${formattedAmount} ${price.currency}`;
}
