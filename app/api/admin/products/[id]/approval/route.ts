import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

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
  const body = payload as { status?: unknown };

  if (body.status !== 'APPROVED' && body.status !== 'REJECTED') {
    return NextResponse.json({ error: 'حالة الموافقة غير صالحة.' }, { status: 400 });
  }

  try {
    const result = await prisma.product.updateMany({
      where: { id, approvalStatus: 'PENDING', isDeleted: false },
      data: {
        approvalStatus: body.status,
        isActive: body.status === 'APPROVED',
      },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: 'المنتج غير موجود أو تمت مراجعته مسبقًا.' }, { status: 404 });
    }

    return NextResponse.json({ id, status: body.status });
  } catch (error) {
    console.error('Unable to moderate product:', error);
    return NextResponse.json({ error: 'تعذرت مراجعة المنتج.' }, { status: 500 });
  }
}
