import { NextResponse } from 'next/server';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { prisma } from '@/lib/db/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, seller } = await getActiveSeller();
  if (!user || !seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  const { id } = await params;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as { stockQuantity?: unknown };

  const quantity = body.stockQuantity;
  if (!Number.isInteger(quantity) || (quantity as number) < 0 || (quantity as number) > 1_000_000) {
    return NextResponse.json({ error: 'قيمة المخزون غير صالحة.' }, { status: 400 });
  }

  try {
    const updated = await prisma.product.updateMany({
      where: {
        id,
        isDeleted: false,
        OR: [{ sellerId: seller.id }, { sellerId: null, userId: user.id }],
      },
      data: { stockQuantity: quantity as number },
    });
    if (!updated.count) return NextResponse.json({ error: 'المنتج غير موجود في متجرك.' }, { status: 404 });
    return NextResponse.json({ id, stockQuantity: quantity });
  } catch (error) {
    console.error('Unable to update product stock:', error);
    return NextResponse.json({ error: 'تعذر تحديث المخزون.' }, { status: 500 });
  }
}
