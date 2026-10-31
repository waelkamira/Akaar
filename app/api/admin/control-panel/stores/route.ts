import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination, isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

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
  status: true,
  isVerified: true,
  createdAt: true,
  user: { select: { email: true, userName: true } },
  _count: { select: { products: true, vendorOrders: true } },
} satisfies Prisma.SellerSelect;

const sellerStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'] as const;

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
  try {
    const [items, totalCount, users] = await Promise.all([
      prisma.seller.findMany({
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: storeSelect,
      }),
      prisma.seller.count(),
      prisma.user.findMany({
        where: { status: 'ACTIVE', seller: null },
        orderBy: { email: 'asc' },
        select: { id: true, email: true, userName: true },
      }),
    ]);

    return NextResponse.json({
      items,
      users,
      page,
      limit,
      totalCount,
      hasMore: skip + items.length < totalCount,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load control panel stores:', error);
    return NextResponse.json({ error: 'تعذر تحميل المتاجر.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
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
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'للمستخدم متجر بالفعل أو أن رابط المتجر مستخدم.' }, { status: 409 });
    }
    console.error('Unable to create control panel store:', error);
    return NextResponse.json({ error: 'تعذر إنشاء المتجر.' }, { status: 500 });
  }
}
