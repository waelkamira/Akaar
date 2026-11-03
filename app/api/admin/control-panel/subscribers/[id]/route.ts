import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { deleteNewsletterSubscriber } from '@/lib/newsletter/repository.mjs';

export async function DELETE(_request: Request, context: RouteContext<'/api/admin/control-panel/subscribers/[id]'>) {
  const admin = await getControlPanelAdmin('control_panel.marketing.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await context.params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرّف المشترك غير صالح.' }, { status: 400 });
  try {
    const deleted = await deleteNewsletterSubscriber(id);
    if (!deleted) return NextResponse.json({ error: 'المشترك غير موجود.' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Unable to delete newsletter subscriber:', error);
    return NextResponse.json({ error: 'تعذر حذف المشترك.' }, { status: 500 });
  }
}
