import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف الإعلان غير صالح.' }, { status: 400 });

  try {
    const deleted = await prisma.property.deleteMany({ where: { id } });
    if (!deleted.count) return NextResponse.json({ error: 'الإعلان غير موجود.' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'الإعلان غير موجود.' }, { status: 404 });
    }
    console.error('Admin property deletion failed:', error);
    return NextResponse.json({ error: 'تعذر حذف الإعلان العقاري.' }, { status: 500 });
  }
}
