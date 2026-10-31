import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

export async function DELETE(_request: Request, context: RouteContext<'/api/admin/control-panel/subscribers/[id]'>) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await context.params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرّف المشترك غير صالح.' }, { status: 400 });
  try {
    const result = await prisma.newsletterSubscriber.deleteMany({ where: { id } });
    if (!result.count) return NextResponse.json({ error: 'المشترك غير موجود.' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Unable to delete newsletter subscriber:', error);
    return NextResponse.json({ error: 'تعذر حذف المشترك.' }, { status: 500 });
  }
}
