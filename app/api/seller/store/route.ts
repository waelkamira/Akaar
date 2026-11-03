import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { prisma } from '@/lib/db/prisma';

export async function PATCH(request: Request) {
  const { seller } = await getActiveSeller();
  if (!seller) return NextResponse.json({ error: 'متجر البائع غير مفعّل.' }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as { storeName?: unknown; slug?: unknown; description?: unknown; logo?: unknown };
  const sellerData: Prisma.SellerUpdateInput = {};
  const storeData: Prisma.StoreUpdateInput = {};

  if (body.storeName !== undefined) {
    if (typeof body.storeName !== 'string' || !body.storeName.trim() || body.storeName.trim().length > 160) {
      return NextResponse.json({ error: 'اسم المتجر غير صالح.' }, { status: 400 });
    }
    sellerData.displayName = body.storeName.trim();
    storeData.name = body.storeName.trim();
  }
  if (body.slug !== undefined) {
    if (typeof body.slug !== 'string') return NextResponse.json({ error: 'رابط المتجر غير صالح.' }, { status: 400 });
    const slug = body.slug.trim().toLowerCase();
    if (!/^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u.test(slug) || slug.length > 100) {
      return NextResponse.json({ error: 'استخدم أحرفًا وأرقامًا وافصل بينها بشرطة.' }, { status: 400 });
    }
    sellerData.slug = slug;
    storeData.slug = slug;
  }
  if (body.description !== undefined) {
    if (body.description !== null && (typeof body.description !== 'string' || body.description.length > 10000)) {
      return NextResponse.json({ error: 'وصف المتجر غير صالح.' }, { status: 400 });
    }
    const description = typeof body.description === 'string' ? body.description.trim() || null : null;
    sellerData.description = description;
    storeData.description = description;
  }
  if (body.logo !== undefined) {
    if (body.logo !== null && (typeof body.logo !== 'string' || body.logo.length > 2048)) {
      return NextResponse.json({ error: 'رابط الشعار غير صالح.' }, { status: 400 });
    }
    if (typeof body.logo === 'string') {
      try {
        const url = new URL(body.logo);
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported protocol');
      } catch {
        return NextResponse.json({ error: 'أدخل رابط شعار HTTP أو HTTPS صالحًا.' }, { status: 400 });
      }
    }
    storeData.logoUrl = typeof body.logo === 'string' ? body.logo : null;
  }
  if (!Object.keys(sellerData).length && !Object.keys(storeData).length) {
    return NextResponse.json({ error: 'لا توجد تغييرات للحفظ.' }, { status: 400 });
  }

  try {
    const updated = await prisma.$transaction(async (transaction) => {
      const currentSeller = Object.keys(sellerData).length
        ? await transaction.seller.update({
            where: { id: seller.id },
            data: sellerData,
            select: { id: true, displayName: true, slug: true, description: true },
          })
        : await transaction.seller.findUniqueOrThrow({
            where: { id: seller.id },
            select: { id: true, displayName: true, slug: true, description: true },
          });
      const currentStore = await transaction.store.findFirst({
        where: { sellerId: seller.id, isActive: true },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: { id: true },
      });
      const store = currentStore
        ? await transaction.store.update({
            where: { id: currentStore.id },
            data: storeData,
            select: { name: true, slug: true, description: true, logoUrl: true },
          })
        : await transaction.store.create({
            data: {
              sellerId: seller.id,
              name: typeof storeData.name === 'string' ? storeData.name : currentSeller.displayName,
              slug: typeof storeData.slug === 'string' ? storeData.slug : currentSeller.slug,
              description: typeof storeData.description === 'string' ? storeData.description : currentSeller.description,
              logoUrl: typeof storeData.logoUrl === 'string' ? storeData.logoUrl : null,
              defaultLanguage: 'ar',
              isActive: true,
            },
            select: { name: true, slug: true, description: true, logoUrl: true },
          });
      return {
        id: currentSeller.id,
        storeName: store.name,
        slug: store.slug,
        description: store.description,
        logo: store.logoUrl,
      };
    });
    return NextResponse.json({ seller: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'رابط المتجر مستخدم بالفعل.' }, { status: 409 });
    }
    console.error('Unable to update seller store:', error);
    return NextResponse.json({ error: 'تعذر حفظ إعدادات المتجر.' }, { status: 500 });
  }
}
