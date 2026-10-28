import { NextResponse } from 'next/server';
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

  const data: { storeName?: string; slug?: string; description?: string | null; logo?: string | null } = {};
  if (body.storeName !== undefined) {
    if (typeof body.storeName !== 'string' || !body.storeName.trim() || body.storeName.trim().length > 100) {
      return NextResponse.json({ error: 'اسم المتجر غير صالح.' }, { status: 400 });
    }
    data.storeName = body.storeName.trim();
  }
  if (body.slug !== undefined) {
    if (typeof body.slug !== 'string') return NextResponse.json({ error: 'رابط المتجر غير صالح.' }, { status: 400 });
    const slug = body.slug.trim().toLowerCase();
    if (!/^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u.test(slug) || slug.length > 80) {
      return NextResponse.json({ error: 'استخدم أحرفًا وأرقامًا وافصل بينها بشرطة.' }, { status: 400 });
    }
    data.slug = slug;
  }
  if (body.description !== undefined) {
    if (body.description !== null && (typeof body.description !== 'string' || body.description.length > 2000)) {
      return NextResponse.json({ error: 'وصف المتجر غير صالح.' }, { status: 400 });
    }
    data.description = typeof body.description === 'string' ? body.description.trim() || null : null;
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
    data.logo = typeof body.logo === 'string' ? body.logo : null;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'لا توجد تغييرات للحفظ.' }, { status: 400 });
  }

  try {
    const updated = await prisma.$transaction(async (transaction) => {
      const updatedSeller = await transaction.seller.update({
        where: { id: seller.id },
        data,
        select: {
          id: true,
          userId: true,
          storeName: true,
          slug: true,
          description: true,
          logo: true,
        },
      });
      await transaction.store.upsert({
        where: { vendorId: updatedSeller.userId },
        update: {
          name: updatedSeller.storeName,
          slug: updatedSeller.slug,
          description: updatedSeller.description,
          logoUrl: updatedSeller.logo,
        },
        create: {
          vendorId: updatedSeller.userId,
          name: updatedSeller.storeName,
          slug: updatedSeller.slug,
          description: updatedSeller.description,
          logoUrl: updatedSeller.logo,
        },
      });
      return updatedSeller;
    });
    return NextResponse.json({ seller: updated });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'رابط المتجر مستخدم بالفعل.' }, { status: 409 });
    }
    console.error('Unable to update seller store:', error);
    return NextResponse.json({ error: 'تعذر حفظ إعدادات المتجر.' }, { status: 500 });
  }
}
