import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isMarketplaceEnabled } from '@/lib/marketplace/settings';
import { prisma } from '@/lib/db/prisma';

function makeSlug(value: string) {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  const base = slug || 'shop';
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول للتقديم كبائع.' }, { status: 401 });
  if (!(await isMarketplaceEnabled('sellerApplicationsEnabled'))) {
    return NextResponse.json({ error: 'طلبات البائعين متوقفة حاليًا.' }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as { storeName?: unknown; description?: unknown };

  const storeName = typeof body.storeName === 'string' ? body.storeName.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  if (!storeName || storeName.length > 100 || description.length > 2000) {
    return NextResponse.json({ error: 'اسم المتجر أو الوصف غير صالح.' }, { status: 400 });
  }

  try {
    const existing = await prisma.seller.findUnique({ where: { userId: user.id } });
    if (existing) {
      return NextResponse.json({ error: 'لديك طلب بائع أو متجر مسجل بالفعل.' }, { status: 409 });
    }

    const seller = await prisma.seller.create({
      data: {
        userId: user.id,
        storeName,
        description: description || null,
        slug: makeSlug(storeName),
        status: 'PENDING',
        isVerified: false,
      },
      select: { id: true, storeName: true, slug: true, status: true },
    });

    return NextResponse.json({ seller }, { status: 201 });
  } catch (error) {
    console.error('Unable to create seller application:', error);
    return NextResponse.json({ error: 'تعذر إرسال طلب البائع.' }, { status: 500 });
  }
}
