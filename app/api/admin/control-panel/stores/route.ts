import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination, isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { isVendorOrderTableAvailable } from '@/lib/admin/review-table-availability';
import { getStoreRatingSummaries } from '@/lib/reviews/ratings';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

const storeSelect = {
  id: true,
  userId: true,
  storeName: true,
  slug: true,
  description: true,
  logo: true,
  contactName: true,
  contactEmail: true,
  phoneNumber: true,
  residence: true,
  latitude: true,
  longitude: true,
  businessType: true,
  sellingCategories: true,
  intendedProducts: true,
  identityDocumentFileId: true,
  facebookUrl: true,
  youtubeUrl: true,
  twitterUrl: true,
  status: true,
  isVerified: true,
  createdAt: true,
  user: { select: { email: true, userName: true } },
  _count: { select: { products: true } },
} satisfies Prisma.SellerSelect;

const sellerStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'] as const;

function serializeStore<T extends { identityDocumentFileId: string | null }>(store: T) {
  const { identityDocumentFileId, ...safeStore } = store;
  return { ...safeStore, hasIdentityDocument: Boolean(identityDocumentFileId) };
}

function optionalText(value: unknown, maximum: number) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.trim().length > maximum) return undefined;
  return value.trim() || null;
}

export async function GET(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });
  const query = searchParams.get('q')?.trim().slice(0, 100) || '';
  const where: Prisma.SellerWhereInput = query
    ? {
        OR: [
          { storeName: { contains: query, mode: 'insensitive' } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
        ],
      }
    : {};
  try {
    const [items, totalCount, users, vendorOrdersAvailable] = await Promise.all([
      prisma.seller.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: storeSelect,
      }),
      prisma.seller.count({ where }),
      prisma.user.findMany({
        where: { status: 'ACTIVE', seller: null },
        orderBy: { email: 'asc' },
        select: { id: true, email: true, userName: true },
      }),
      isVendorOrderTableAvailable(),
    ]);
    const ratings = await getStoreRatingSummaries(items.map((item) => item.id));
    const orderCounts = new Map<string, number>();
    if (vendorOrdersAvailable && items.length) {
      const sellerOrderCounts = await prisma.$queryRaw<Array<{ sellerId: string; count: bigint }>>`
        SELECT "sellerId", COUNT(*)::bigint AS "count"
        FROM public."VendorOrder"
        WHERE "sellerId" IN (${Prisma.join(items.map((item) => item.id))})
        GROUP BY "sellerId"
      `;
      for (const orderCount of sellerOrderCounts) {
        orderCounts.set(orderCount.sellerId, Number(orderCount.count));
      }
    }

    return NextResponse.json({
      items: items.map((item) => ({
        ...serializeStore(item),
        averageRating: ratings.get(item.id)?.average ?? null,
        reviewCount: ratings.get(item.id)?.count ?? 0,
        _count: {
          ...item._count,
          vendorOrders: vendorOrdersAvailable ? orderCounts.get(item.id) || 0 : null,
        },
      })),
      users,
      page,
      limit,
      totalCount,
      hasMore: skip + items.length < totalCount,
      vendorOrdersAvailable,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load control panel stores:', error);
    return NextResponse.json({ error: 'تعذر تحميل المتاجر.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const parsedBody = await readJsonBody(request, 32 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });

  const body = payload as Record<string, unknown>;
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const storeName = typeof body.storeName === 'string' ? body.storeName.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';
  const description = optionalText(body.description, 10000);
  const logo = optionalText(body.logo, 2048);
  if (!userId || userId.length > 128 || !storeName || storeName.length > 160 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100 ||
    description === undefined || logo === undefined) {
    return NextResponse.json({ error: 'تحقق من المستخدم واسم المتجر والرابط والوصف والشعار.' }, { status: 400 });
  }
  const status = body.status === undefined ? 'PENDING' : body.status;
  if (typeof status !== 'string' || !sellerStatuses.includes(status as typeof sellerStatuses[number])) {
    return NextResponse.json({ error: 'حالة المتجر غير صالحة.' }, { status: 400 });
  }
  const contactName = optionalText(body.contactName, 160);
  const contactEmail = optionalText(body.contactEmail, 254);
  const phoneNumber = optionalText(body.phoneNumber, 40);
  const residence = optionalText(body.residence, 240);
  if ([contactName, contactEmail, phoneNumber, residence].includes(undefined)) {
    return NextResponse.json({ error: 'بيانات التواصل غير صالحة.' }, { status: 400 });
  }
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return NextResponse.json({ error: 'البريد الإلكتروني للتواصل غير صالح.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, status: true } });
    if (!user || user.status !== 'ACTIVE') return NextResponse.json({ error: 'المستخدم غير موجود أو غير نشط.' }, { status: 404 });
    const item = await prisma.$transaction(async (transaction) => {
      const store = await transaction.seller.create({
        data: {
          userId,
          storeName,
          slug,
          description,
          logo,
          contactName,
          contactEmail,
          phoneNumber,
          residence,
          status,
          isVerified: status === 'ACTIVE',
        },
        select: storeSelect,
      });
      await transaction.user.update({ where: { id: userId }, data: { role: 'SELLER' } });
      return store;
    });
    return NextResponse.json({
      item: { ...serializeStore(item), _count: { ...item._count, vendorOrders: 0 } },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'للمستخدم متجر بالفعل أو أن رابط المتجر مستخدم.' }, { status: 409 });
    }
    console.error('Unable to create control panel store:', error);
    return NextResponse.json({ error: 'تعذر إنشاء المتجر.' }, { status: 500 });
  }
}
