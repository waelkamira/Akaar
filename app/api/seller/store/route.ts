import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

export async function GET() {
  const { seller } = await getActiveSeller('seller.store.manage');
  if (!seller) return NextResponse.json({ error: 'متجر البائع غير مفعّل.' }, { status: 403 });

  try {
    const store = await prisma.store.findFirst({
      where: { sellerId: seller.id, isActive: true },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        contactEmail: true,
        contactPhone: true,
        pages: {
          select: { id: true, slug: true, title: true, content: true, isPublished: true, updatedAt: true },
          orderBy: { updatedAt: 'desc' },
        },
      },
    });
    return NextResponse.json({ store, seller: { id: seller.id, status: seller.status, isVerified: seller.isVerified } });
  } catch (error) {
    console.error('Unable to load seller store settings:', error);
    return NextResponse.json({ error: 'تعذر تحميل إعدادات المتجر.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { seller } = await getActiveSeller('seller.store.manage');
  if (!seller) return NextResponse.json({ error: 'متجر البائع غير مفعّل.' }, { status: 403 });

  const parsedBody = await readJsonBody(request, 32 * 1024);
  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  }
  const payload: unknown = parsedBody.value;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as {
    action?: unknown;
    pageId?: unknown;
    pageSlug?: unknown;
    pageTitle?: unknown;
    pageContent?: unknown;
    isPublished?: unknown;
    storeName?: unknown;
    slug?: unknown;
    description?: unknown;
    logo?: unknown;
    contactEmail?: unknown;
    contactPhone?: unknown;
  };

  if (body.action === 'page-create' || body.action === 'page-update' || body.action === 'page-delete') {
    try {
      const currentStore = await prisma.store.findFirst({
        where: { sellerId: seller.id, isActive: true },
        select: { id: true },
      });
      if (!currentStore) return NextResponse.json({ error: 'أنشئ متجرًا نشطًا أولًا.' }, { status: 409 });

      if (body.action === 'page-delete') {
        if (typeof body.pageId !== 'string' || !body.pageId) {
          return NextResponse.json({ error: 'الصفحة غير محددة.' }, { status: 400 });
        }
        const deleted = await prisma.storePage.deleteMany({
          where: { id: body.pageId, storeId: currentStore.id },
        });
        if (!deleted.count) return NextResponse.json({ error: 'الصفحة غير موجودة في متجرك.' }, { status: 404 });
        return NextResponse.json({ pageId: body.pageId, deleted: true });
      }

      const title = body.pageTitle;
      const slugInput = body.pageSlug;
      const content = body.pageContent;
      if (
        typeof title !== 'string' || !title.trim() || title.trim().length > 120 ||
        typeof slugInput !== 'string' || !/^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u.test(slugInput.trim()) ||
        slugInput.trim().length > 100 ||
        typeof content !== 'string' || !content.trim() || content.length > 20000 ||
        typeof body.isPublished !== 'boolean'
      ) {
        return NextResponse.json({ error: 'تحقق من عنوان الصفحة ورابطها ومحتواها.' }, { status: 400 });
      }
      const pageData = {
        title: title.trim(),
        slug: slugInput.trim().toLowerCase(),
        content: content.trim(),
        isPublished: body.isPublished,
      };
      if (body.action === 'page-create') {
        const page = await prisma.storePage.create({
          data: { storeId: currentStore.id, ...pageData },
          select: { id: true, slug: true, title: true, content: true, isPublished: true },
        });
        return NextResponse.json({ page }, { status: 201 });
      }
      if (typeof body.pageId !== 'string' || !body.pageId) {
        return NextResponse.json({ error: 'الصفحة غير محددة.' }, { status: 400 });
      }
      const page = await prisma.storePage.updateMany({
        where: { id: body.pageId, storeId: currentStore.id },
        data: pageData,
      });
      if (!page.count) return NextResponse.json({ error: 'الصفحة غير موجودة في متجرك.' }, { status: 404 });
      return NextResponse.json({ pageId: body.pageId, ...pageData });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return NextResponse.json({ error: 'رابط الصفحة مستخدم في متجرك بالفعل.' }, { status: 409 });
      }
      console.error('Unable to update seller store page:', error);
      return NextResponse.json({ error: 'تعذر حفظ صفحة المتجر.' }, { status: 500 });
    }
  }

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
  if (body.contactEmail !== undefined) {
    if (
      body.contactEmail !== null &&
      (typeof body.contactEmail !== 'string' ||
        body.contactEmail.trim().length > 320 ||
        (body.contactEmail.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contactEmail.trim())))
    ) {
      return NextResponse.json({ error: 'البريد الإلكتروني للمتجر غير صالح.' }, { status: 400 });
    }
    storeData.contactEmail = typeof body.contactEmail === 'string' ? body.contactEmail.trim() || null : null;
  }
  if (body.contactPhone !== undefined) {
    if (
      body.contactPhone !== null &&
      (typeof body.contactPhone !== 'string' ||
        body.contactPhone.trim().length > 32 ||
        (body.contactPhone.trim() !== '' && !/^\+?[0-9\s().-]{7,32}$/.test(body.contactPhone.trim())))
    ) {
      return NextResponse.json({ error: 'رقم هاتف المتجر غير صالح.' }, { status: 400 });
    }
    storeData.contactPhone = typeof body.contactPhone === 'string' ? body.contactPhone.trim() || null : null;
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
            select: { name: true, slug: true, description: true, logoUrl: true, contactEmail: true, contactPhone: true },
          })
        : await transaction.store.create({
            data: {
              sellerId: seller.id,
              name: typeof storeData.name === 'string' ? storeData.name : currentSeller.displayName,
              slug: typeof storeData.slug === 'string' ? storeData.slug : currentSeller.slug,
              description: typeof storeData.description === 'string' ? storeData.description : currentSeller.description,
              logoUrl: typeof storeData.logoUrl === 'string' ? storeData.logoUrl : null,
              contactEmail: typeof storeData.contactEmail === 'string' ? storeData.contactEmail : null,
              contactPhone: typeof storeData.contactPhone === 'string' ? storeData.contactPhone : null,
              defaultLanguage: 'ar',
              isActive: true,
            },
            select: { name: true, slug: true, description: true, logoUrl: true, contactEmail: true, contactPhone: true },
          });
      return {
        id: currentSeller.id,
        storeName: store.name,
        slug: store.slug,
        description: store.description,
        logo: store.logoUrl,
        contactEmail: store.contactEmail,
        contactPhone: store.contactPhone,
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
