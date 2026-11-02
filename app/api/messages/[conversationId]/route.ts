import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isStoreMessagingAvailable } from '@/lib/messages/table-availability';
import { insertStoreMessage } from '@/lib/messages/store-messaging';

type Context = { params: Promise<{ conversationId: string }> };

export async function GET(_request: Request, { params }: Context) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض المحادثة.' }, { status: 401 });
  if (!(await isStoreMessagingAvailable())) return NextResponse.json({ error: 'نظام الرسائل غير متاح حاليًا.' }, { status: 503 });
  const { conversationId } = await params;
  try {
    const conversation = await prisma.storeConversation.findFirst({
      where: { id: conversationId, OR: [{ customerId: user.id }, { seller: { userId: user.id } }] },
      select: { id: true, customerId: true, seller: { select: { userId: true, storeName: true } } },
    });
    if (!conversation) return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
    const messages = await prisma.storeMessage.findMany({
      where: { conversationId },
      select: { id: true, senderId: true, body: true, createdAt: true, readAt: true },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
    await prisma.storeMessage.updateMany({
      where: { conversationId, senderId: { not: user.id }, readAt: null },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ messages, currentUserId: user.id, storeName: conversation.seller.storeName }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load conversation:', error);
    return NextResponse.json({ error: 'تعذر تحميل المحادثة.' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Context) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لإرسال رسالة.' }, { status: 401 });
  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الرسالة غير صالحة.' }, { status: 400 });
  const body = typeof parsed.value.body === 'string' ? parsed.value.body.trim() : '';
  if (!body || body.length > 4000) return NextResponse.json({ error: 'اكتب رسالة لا تتجاوز 4000 حرف.' }, { status: 400 });
  if (!(await isStoreMessagingAvailable())) return NextResponse.json({ error: 'نظام الرسائل غير متاح حاليًا.' }, { status: 503 });
  const { conversationId } = await params;
  try {
    const conversation = await prisma.storeConversation.findFirst({
      where: { id: conversationId, OR: [{ customerId: user.id }, { seller: { userId: user.id } }] },
      select: { id: true, customerId: true, seller: { select: { userId: true } } },
    });
    if (!conversation) return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
    const recipientId = conversation.customerId === user.id ? conversation.seller.userId : conversation.customerId;
    const result = await prisma.$transaction(async (transaction) => insertStoreMessage(transaction, {
      conversationId,
      senderId: user.id,
      recipientId,
      body,
    }));
    return NextResponse.json({ message: result }, { status: 201 });
  } catch (error) {
    console.error('Unable to send conversation reply:', error);
    return NextResponse.json({ error: 'تعذر إرسال الرسالة.' }, { status: 500 });
  }
}
