import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

export const dynamic = 'force-dynamic';

async function readPayload(request: Request) {
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return { response: NextResponse.json({ error: parsed.error }, { status: parsed.status }) };
  if (!isPlainObject(parsed.value)) return { response: NextResponse.json({ error: 'بيانات الطلب غير صالحة.' }, { status: 400 }) };
  return { value: parsed.value as Record<string, unknown> };
}

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض الإشعارات.' }, { status: 401 });
  try {
    const [notifications, unreadCount] = await prisma.$transaction([
      prisma.notification.findMany({
        where: { userId: user.id },
        select: { id: true, type: true, message: true, isRead: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    ]);
    return NextResponse.json({ notifications, unreadCount }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load notifications:', error);
    return NextResponse.json({ error: 'تعذر تحميل الإشعارات.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لتحديث الإشعارات.' }, { status: 401 });
  const parsed = await readPayload(request);
  if (parsed.response) return parsed.response;
  const id = parsed.value.id;
  const markAll = parsed.value.markAll === true;
  if ((!markAll && (typeof id !== 'string' || !id.trim() || id.length > 128)) || (markAll && id !== undefined)) {
    return NextResponse.json({ error: 'حدد إشعارًا صالحًا أو اختر تعليم الكل كمقروء.' }, { status: 400 });
  }
  try {
    const result = markAll
      ? await prisma.notification.updateMany({ where: { userId: user.id, isRead: false }, data: { isRead: true } })
      : await prisma.notification.updateMany({ where: { id: id as string, userId: user.id, isRead: false }, data: { isRead: true } });
    return NextResponse.json({ updated: result.count, markedAll: markAll });
  } catch (error) {
    console.error('Unable to update notification read state:', error);
    return NextResponse.json({ error: 'تعذر تحديث حالة الإشعار.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لإدارة الإشعارات.' }, { status: 401 });
  const parsed = await readPayload(request);
  if (parsed.response) return parsed.response;
  const id = parsed.value.id;
  const deleteAll = parsed.value.deleteAll === true;
  if ((!deleteAll && (typeof id !== 'string' || !id.trim() || id.length > 128)) || (deleteAll && id !== undefined)) {
    return NextResponse.json({ error: 'حدد إشعارًا صالحًا أو اختر حذف الكل.' }, { status: 400 });
  }
  try {
    const result = deleteAll
      ? await prisma.notification.deleteMany({ where: { userId: user.id } })
      : await prisma.notification.deleteMany({ where: { id: id as string, userId: user.id } });
    return NextResponse.json({ deleted: result.count, deletedAll: deleteAll });
  } catch (error) {
    console.error('Unable to delete notifications:', error);
    return NextResponse.json({ error: 'تعذر حذف الإشعار.' }, { status: 500 });
  }
}
