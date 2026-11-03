export async function appendProductPriceVersion(transaction, {
  variantId,
  currency,
  amount,
  compareAt,
}, now) {
  const latestStartedPrice = await transaction.productPrice.findFirst({
    where: { variantId, currency, validFrom: { lte: now } },
    orderBy: { validFrom: 'desc' },
    select: { validFrom: true },
  });
  const validFrom = latestStartedPrice?.validFrom.getTime() === now.getTime()
    ? new Date(now.getTime() + 1)
    : now;
  const nextScheduledPrice = await transaction.productPrice.findFirst({
    where: {
      variantId,
      currency,
      validFrom: { gt: now },
      OR: [{ validUntil: null }, { validUntil: { gt: now } }],
    },
    orderBy: { validFrom: 'asc' },
    select: { validFrom: true },
  });

  if (nextScheduledPrice && nextScheduledPrice.validFrom <= validFrom) {
    throw new Error('PRODUCT_PRICE_WINDOW_CONFLICT');
  }

  await transaction.productPrice.updateMany({
    where: {
      variantId,
      currency,
      validFrom: { lte: validFrom },
      OR: [{ validUntil: null }, { validUntil: { gt: validFrom } }],
    },
    data: { validUntil: validFrom },
  });

  return transaction.productPrice.create({
    data: {
      variantId,
      currency,
      amount,
      compareAt,
      validFrom,
      validUntil: nextScheduledPrice?.validFrom ?? null,
    },
  });
}
