import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { appendProductPriceVersion } from '@/lib/admin/product-price-history.mjs';
import { isProductPriceCurrency, parseProductPriceAmount } from '@/lib/api/product-price-validation.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';

const HISTORY_PAGE_SIZE = 50;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RouteContext = { params: Promise<{ id: string }> };

function priceRecordToJson(price: {
  id: string;
  amount: Prisma.Decimal;
  compareAt: Prisma.Decimal | null;
  currency: string;
  validFrom: Date;
  validUntil: Date | null;
  currencyRef: { symbol: string | null; minorUnits: number };
}) {
  return {
    id: price.id,
    amount: price.amount.toString(),
    compareAt: price.compareAt?.toString() ?? null,
    currency: price.currency,
    validFrom: price.validFrom,
    validUntil: price.validUntil,
    currencyRef: price.currencyRef,
  };
}

export async function GET(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.catalog.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ error: 'معرف المنتج غير صالح.' }, { status: 400 });
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get('variantId');
  const cursor = searchParams.get('cursor');

  try {
    if (variantId) {
      if (!uuidPattern.test(variantId) || (cursor !== null && !uuidPattern.test(cursor))) {
        return NextResponse.json({ error: 'معرف النسخة أو مؤشر السجل غير صالح.' }, { status: 400 });
      }

      const variant = await prisma.productVariant.findFirst({
        where: { id: variantId, productId: id },
        select: { id: true, sku: true, title: true },
      });
      if (!variant) return NextResponse.json({ error: 'نسخة المنتج غير موجودة.' }, { status: 404 });

      if (cursor && !await prisma.productPrice.findFirst({
        where: { id: cursor, variantId },
        select: { id: true },
      })) {
        return NextResponse.json({ error: 'مؤشر سجل الأسعار غير صالح.' }, { status: 400 });
      }

      const records = await prisma.productPrice.findMany({
        where: { variantId },
        orderBy: [{ validFrom: 'desc' }, { id: 'desc' }],
        take: HISTORY_PAGE_SIZE + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          amount: true,
          compareAt: true,
          currency: true,
          validFrom: true,
          validUntil: true,
          currencyRef: { select: { symbol: true, minorUnits: true } },
        },
      });
      const hasMore = records.length > HISTORY_PAGE_SIZE;
      const page = records.slice(0, HISTORY_PAGE_SIZE);
      return NextResponse.json({
        variant,
        prices: page.map(priceRecordToJson),
        nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null,
      }, { headers: { 'Cache-Control': 'private, no-store' } });
    }

    if (cursor) return NextResponse.json({ error: 'يجب تحديد نسخة المنتج.' }, { status: 400 });
    const [product, currencies] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          variants: {
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            select: { id: true, sku: true, title: true },
          },
        },
      }),
      prisma.currency.findMany({
        where: { isActive: true },
        orderBy: { code: 'asc' },
        select: { code: true, name: true, symbol: true, minorUnits: true },
      }),
    ]);
    if (!product) return NextResponse.json({ error: 'المنتج غير موجود.' }, { status: 404 });
    return NextResponse.json({ product, currencies }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load product price history:', error);
    return NextResponse.json({ error: 'تعذر تحميل سجل أسعار المنتج.' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.catalog.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ error: 'معرف المنتج غير صالح.' }, { status: 400 });

  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });

  const { variantId, currency, amount } = parsed.value;
  const compareAtInput = parsed.value.compareAt;
  const hasCompareAt = compareAtInput !== undefined && compareAtInput !== null && compareAtInput !== '';
  const compareAt = !hasCompareAt
    ? null
    : parseProductPriceAmount(compareAtInput);
  const parsedAmount = parseProductPriceAmount(amount);
  if (typeof variantId !== 'string' || !uuidPattern.test(variantId) ||
    !isProductPriceCurrency(currency) || parsedAmount === null ||
    (hasCompareAt && compareAt === null)) {
    return NextResponse.json({ error: 'تحقق من نسخة المنتج والعملة والسعر وسعر المقارنة.' }, { status: 400 });
  }

  try {
    const price = await prisma.$transaction(async (transaction) => {
      const variant = await transaction.productVariant.findFirst({
        where: { id: variantId, productId: id },
        select: { id: true },
      });
      if (!variant) throw new Error('PRODUCT_PRICE_VARIANT_NOT_FOUND');
      const currencyRecord = await transaction.currency.findUnique({
        where: { code: currency },
        select: { code: true, isActive: true },
      });
      if (!currencyRecord?.isActive) throw new Error('PRODUCT_PRICE_CURRENCY_INACTIVE');

      return appendProductPriceVersion(transaction, {
        variantId,
        currency,
        amount: new Prisma.Decimal(parsedAmount),
        compareAt: compareAt === null ? null : new Prisma.Decimal(compareAt),
      }, new Date());
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json({
      id: price.id,
      variantId: price.variantId,
      amount: price.amount.toString(),
      compareAt: price.compareAt?.toString() ?? null,
      currency: price.currency,
      validFrom: price.validFrom,
      validUntil: price.validUntil,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'PRODUCT_PRICE_VARIANT_NOT_FOUND') {
      return NextResponse.json({ error: 'نسخة المنتج غير موجودة.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'PRODUCT_PRICE_CURRENCY_INACTIVE') {
      return NextResponse.json({ error: 'العملة غير موجودة أو غير مفعلة.' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'PRODUCT_PRICE_WINDOW_CONFLICT') {
      return NextResponse.json({ error: 'يوجد سعر مجدول قريبًا؛ أعد المحاولة بعد لحظات.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === 'P2002' || error.code === 'P2034')) {
      return NextResponse.json({ error: 'تغير سجل الأسعار بالتزامن؛ أعد المحاولة.' }, { status: 409 });
    }
    console.error('Unable to update product price history:', error);
    return NextResponse.json({ error: 'تعذر حفظ سعر المنتج.' }, { status: 500 });
  }
}
