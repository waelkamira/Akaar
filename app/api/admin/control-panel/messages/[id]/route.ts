import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف الرسالة غير صالح.' }, { status: 400 });

  const parsedBody = await readJsonBody(request, 16 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = payload as Record<string, unknown>;
  const data: { message?: string; type?: string } = {};
  if ('message' in body) {
    if (typeof body.message !== 'string' || !body.message.trim() || body.message.trim().length > 4000) {
      return NextResponse.json({ error: 'نص الرسالة غير صالح.' }, { status: 400 });
    }
    data.message = body.message.trim();
  }
  if ('type' in body) {
    if (typeof body.type !== 'string' || !body.type.trim() || body.type.trim().length > 60) {
      return NextResponse.json({ error: 'نوع الرسالة غير صالح.' }, { status: 400 });
    }
    data.type = body.type.trim();
  }
  if (!Object.keys(data).length) return NextResponse.json({ error: 'لا توجد تغييرات للحفظ.' }, { status: 400 });

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data,
      select: { id: true, userId: true, type: true, message: true, isRead: true, createdAt: true },
    });
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Unable to update control panel message:', error);
    return NextResponse.json({ error: 'تعذر تحديث الرسالة.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف الرسالة غير صالح.' }, { status: 400 });
  try {
    const result = await prisma.notification.deleteMany({ where: { id } });
    if (!result.count) return NextResponse.json({ error: 'الرسالة غير موجودة.' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Unable to delete control panel message:', error);
    return NextResponse.json({ error: 'تعذر حذف الرسالة.' }, { status: 500 });
  }
}
