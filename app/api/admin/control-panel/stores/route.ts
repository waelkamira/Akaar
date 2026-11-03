import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination, isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { isVendorOrderTableAvailable } from '@/lib/admin/review-table-availability';
import { getStoreRatingSummaries } from '@/lib/reviews/ratings';
<<<<<<< HEAD
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
=======
import { assignPlatformRole } from '@/lib/auth/roles.mjs';
import { parseSellerApplicationDetails } from '@/lib/seller/application.mjs';
>>>>>>> wael-work-in-progress

const storeSelect = {
  id: true,
  userId: true,
  displayName: true,
  slug: true,
  description: true,
  sellerType: true,
  countryCode: true,
  status: true,
  isVerified: true,
  createdAt: true,
  user: { select: { email: true, userName: true, phone: true } },
  stores: {
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      _count: { select: { products: true } },
    },
  },
  verifications: {
    orderBy: [{ submittedAt: 'desc' }, { createdAt: 'desc' }],
    take: 1,
    select: { notes: true },
  },
  documents: { where: { type: 'IDENTITY' }, select: { id: true }, take: 1 },
} satisfies Prisma.SellerSelect;

const sellerStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'] as const;

function serializeStore(store: Prisma.SellerGetPayload<{ select: typeof storeSelect }>) {
  const firstStore = store.stores[0];
  const application = parseSellerApplicationDetails(store.verifications[0]?.notes);
  return {
    id: store.id,
    userId: store.userId,
    storeName: firstStore?.name || store.displayName,
    slug: firstStore?.slug || store.slug,
    description: store.description,
    logo: firstStore?.logoUrl ?? null,
    contactName: application?.contactName ?? store.user.userName,
    contactEmail: application?.contactEmail ?? store.user.email,
    phoneNumber: application?.phoneNumber ?? store.user.phone,
    residence: application?.residence ?? store.countryCode,
    latitude: null,
    longitude: null,
    businessType: store.sellerType,
    sellingCategories: application?.sellingCategories ?? null,
    intendedProducts: application?.intendedProducts ?? null,
    hasIdentityDocument: store.documents.length > 0,
    facebookUrl: application?.facebookUrl ?? null,
    youtubeUrl: application?.youtubeUrl ?? null,
    twitterUrl: application?.twitterUrl ?? null,
    status: store.status,
    isVerified: store.isVerified,
    createdAt: store.createdAt,
    user: { email: store.user.email, userName: store.user.userName },
    _count: {
      products: store.stores.reduce((count, item) => count + item._count.products, 0),
    },
  };
}

function optionalText(value: unknown, maximum: number) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.trim().length > maximum) return undefined;
  return value.trim() || null;
}

export async function GET(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.stores.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });
  const query = searchParams.get('q')?.trim().slice(0, 100) || '';
  const where: Prisma.SellerWhereInput = query
    ? {
        OR: [
          { displayName: { contains: query, mode: 'insensitive' } },
          { stores: { some: { name: { contains: query, mode: 'insensitive' } } } },
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
        FROM public.vendor_orders
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
          products: serializeStore(item)._count.products,
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
  const admin = await getControlPanelAdmin('control_panel.stores.manage');
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
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, status: true, email: true } });
    if (!user || user.status !== 'ACTIVE') return NextResponse.json({ error: 'المستخدم غير موجود أو غير نشط.' }, { status: 404 });
    if (contactEmail && contactEmail.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json({ error: 'البريد الإلكتروني للتواصل يجب أن يطابق بريد حساب المستخدم.' }, { status: 400 });
    }
    const countryCode = residence && /^[A-Za-z]{2}$/.test(residence) ? residence.toUpperCase() : null;
    const item = await prisma.$transaction(async (transaction) => {
      const seller = await transaction.seller.create({
        data: {
          userId,
          displayName: storeName,
          slug,
          description,
          sellerType: typeof body.businessType === 'string' ? body.businessType.trim().slice(0, 60) || 'INDIVIDUAL' : 'INDIVIDUAL',
          countryCode,
          status,
          isVerified: status === 'ACTIVE',
        },
        select: { id: true, userId: true },
      });
      await transaction.store.create({
        data: {
          sellerId: seller.id,
          name: storeName,
          slug,
          description,
          logoUrl: logo,
          defaultLanguage: 'ar',
          isActive: status === 'ACTIVE',
        },
      });
      const verification = await transaction.sellerVerification.create({
        data: {
          sellerId: seller.id,
          status: status === 'ACTIVE' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'PENDING',
          submittedAt: new Date(),
          ...(status === 'ACTIVE' || status === 'REJECTED'
            ? { reviewerId: admin.id, reviewedAt: new Date() }
            : {}),
        },
        select: { id: true },
      });
      if (typeof body.identityDocumentFileId === 'string' && body.identityDocumentFileId.trim()) {
        await transaction.sellerDocument.create({
          data: {
            sellerId: seller.id,
            verificationId: verification.id,
            type: 'IDENTITY',
            storageKey: body.identityDocumentFileId.trim(),
          },
        });
      }
      await transaction.user.update({
        where: { id: userId },
        data: {
          ...(contactName ? { userName: contactName } : {}),
          ...(phoneNumber ? { phone: phoneNumber } : {}),
        },
      });
      if (status === 'ACTIVE') await assignPlatformRole(transaction, userId, 'SELLER');
      return transaction.seller.findUniqueOrThrow({ where: { id: seller.id }, select: storeSelect });
    });
    return NextResponse.json({
      item: { ...serializeStore(item), _count: { ...serializeStore(item)._count, vendorOrders: 0 } },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'للمستخدم متجر بالفعل أو أن رابط المتجر مستخدم.' }, { status: 409 });
    }
    console.error('Unable to create control panel store:', error);
    return NextResponse.json({ error: 'تعذر إنشاء المتجر.' }, { status: 500 });
  }
}
