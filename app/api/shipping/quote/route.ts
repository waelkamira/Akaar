import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { calculateShippingQuotes, getWeightInKilograms } from '@/lib/shipping/quotes.mjs';

type QuoteLine = { variantId: string; quantity: number };

function parseQuoteLines(value: unknown): QuoteLine[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) return null;
  const seen = new Set<string>();
  const lines: QuoteLine[] = [];

  for (const item of value) {
    if (!isPlainObject(item)
      || typeof item.variantId !== 'string'
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.variantId)
      || typeof item.quantity !== 'number'
      || !Number.isSafeInteger(item.quantity)
      || item.quantity < 1
      || item.quantity > 1_000
      || seen.has(item.variantId)) {
      return null;
    }
    seen.add(item.variantId);
    lines.push({ variantId: item.variantId, quantity: item.quantity });
  }

  return lines;
}

export async function POST(request: Request) {
  const rateLimit = await consumeDurableRateLimit({
    request,
    scope: 'shipping-quotes',
    limit: 60,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds
      ? { 'Retry-After': String(rateLimit.retryAfterSeconds) }
      : undefined;
    return NextResponse.json(
      { error: status === 429 ? 'تم تجاوز حد طلبات أسعار الشحن.' : 'خدمة الحماية غير متاحة حاليًا.' },
      { status, headers },
    );
  }

  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) {
    return NextResponse.json({ error: 'بيانات طلب الشحن غير صالحة.' }, { status: 400 });
  }

  const { countryCode, currency } = parsed.value;
  const lines = parseQuoteLines(parsed.value.items);
  if (typeof countryCode !== 'string'
    || !/^[A-Za-z]{2}$/.test(countryCode)
    || typeof currency !== 'string'
    || !/^[A-Za-z]{3}$/.test(currency)
    || !lines) {
    return NextResponse.json({ error: 'يرجى التحقق من بلد الشحن والعملة والمنتجات.' }, { status: 400 });
  }

  try {
    const normalizedCountryCode = countryCode.toUpperCase();
    const normalizedCurrency = currency.toUpperCase();
    const country = await prisma.country.findFirst({
      where: { code: normalizedCountryCode, isActive: true },
      select: { code: true },
    });
    const currencyRecord = await prisma.currency.findFirst({
      where: { code: normalizedCurrency, isActive: true },
      select: { code: true, minorUnits: true },
    });
    if (!country || !currencyRecord) {
      return NextResponse.json({ error: 'بلد الشحن أو العملة غير مفعّلين.' }, { status: 400 });
    }

    const now = new Date();
    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: lines.map((line) => line.variantId) },
        status: 'ACTIVE',
        product: {
          isActive: true,
          status: 'APPROVED',
          store: { isActive: true, seller: { status: 'ACTIVE', isVerified: true } },
        },
        prices: {
          some: {
            currency: normalizedCurrency,
            validFrom: { lte: now },
            OR: [{ validUntil: null }, { validUntil: { gt: now } }],
            currencyRef: { isActive: true },
          },
        },
      },
      select: {
        id: true,
        weight: true,
        weightUnit: true,
        product: { select: { store: { select: { sellerId: true } } } },
        inventory: {
          where: { warehouse: { isActive: true } },
          select: {
            onHand: true,
            reserved: true,
            warehouse: { select: { sellerId: true } },
          },
        },
      },
    });
    if (variants.length !== lines.length) {
      return NextResponse.json({ error: 'بعض المنتجات لم تعد متاحة بالسعر المحدد.' }, { status: 409 });
    }

    const variantById = new Map<string, (typeof variants)[number]>(
      variants.map((variant) => [variant.id, variant]),
    );
    let totalWeightKg = 0;
    for (const line of lines) {
      const variant = variantById.get(line.variantId);
      if (!variant) return NextResponse.json({ error: 'بعض المنتجات لم تعد متاحة.' }, { status: 409 });
      const available = variant.inventory.reduce(
        (sum, inventory) => sum + (inventory.warehouse.sellerId === variant.product.store.sellerId
          ? Math.max(0, inventory.onHand - inventory.reserved)
          : 0),
        0,
      );
      if (available < line.quantity) {
        return NextResponse.json({ error: 'المخزون غير كافٍ لبعض المنتجات.' }, { status: 409 });
      }
      totalWeightKg += getWeightInKilograms(variant.weight, variant.weightUnit) * line.quantity;
    }

    const [zones, services] = await Promise.all([
      prisma.shippingZone.findMany({
        where: { isActive: true, countries: { has: normalizedCountryCode } },
        select: {
          id: true,
          name: true,
          countries: true,
          isActive: true,
          rates: {
            where: { currency: normalizedCurrency },
            select: { id: true, serviceCode: true, currency: true, baseCost: true, perKgCost: true },
          },
        },
      }),
      prisma.shippingService.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          isActive: true,
          carrier: { select: { id: true, name: true, isActive: true } },
        },
      }),
    ]);

    const quotes = calculateShippingQuotes({
      countryCode: normalizedCountryCode,
      currency: normalizedCurrency,
      weightKg: totalWeightKg,
      minorUnits: currencyRecord.minorUnits,
      zones,
      services,
    });
    return NextResponse.json({ currency: normalizedCurrency, weightKg: totalWeightKg, quotes });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNSUPPORTED_WEIGHT_UNIT') {
      return NextResponse.json({ error: 'وحدة وزن أحد المنتجات غير مدعومة لحساب الشحن.' }, { status: 422 });
    }
    if (error instanceof Error && error.message === 'INVALID_VARIANT_WEIGHT') {
      console.error('Invalid product variant weight while quoting shipping:', error);
      return NextResponse.json({ error: 'تعذر حساب وزن الشحنة.' }, { status: 422 });
    }
    if (error instanceof Error && [
      'AMBIGUOUS_SHIPPING_ZONES',
      'AMBIGUOUS_SHIPPING_SERVICE_CODE',
      'INVALID_SHIPPING_RATE',
    ].includes(error.message)) {
      console.error('Shipping configuration is invalid:', error.message);
      return NextResponse.json({ error: 'إعدادات أسعار الشحن غير صالحة. يرجى التواصل مع الإدارة.' }, { status: 503 });
    }
    console.error('Unable to calculate shipping quotes:', error);
    return NextResponse.json({ error: 'تعذر حساب أسعار الشحن حاليًا.' }, { status: 500 });
  }
}
