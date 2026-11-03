import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isStoreMessagingAvailable } from '@/lib/messages/table-availability';
<<<<<<< HEAD
import { insertStoreMessage } from '@/lib/messages/store-messaging';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
=======
import {
  findParticipantConversation,
  insertStoreMessage,
  listConversationMessages,
  markConversationMessagesRead,
  withStoreMessageTransaction,
} from '@/lib/messages/store-messaging';
import {
  loadStoreConversation,
  markConversationRead,
  sendConversationMessage,
} from '@/lib/messages/service.mjs';
import { parseStoreMessageBody } from '@/lib/messages/validation.mjs';
>>>>>>> wael-work-in-progress

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض الرسائل.' }, { status: 401 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المحادثة غير صالح.' }, { status: 400 });

  try {
    const result = await loadStoreConversation(id, user.id, {
      isAvailable: isStoreMessagingAvailable,
      findForParticipant: findParticipantConversation,
      listMessages: listConversationMessages,
    });
    if (result.status === 'unavailable') {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }
<<<<<<< HEAD
    const conversation = await findParticipantConversation(prisma, id, user.id);
    if (!conversation) return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
    const isStoreOwner = conversation.sellerUserId === user.id;

    const messages = await prisma.$queryRaw<Array<{
      id: string;
      senderId: string;
      body: string;
      createdAt: Date;
      readAt: Date | null;
      senderName: string;
    }>>`
      SELECT recent."id", recent."senderId", recent."body", recent."createdAt", recent."readAt",
        COALESCE(sender."userName", 'مستخدم') AS "senderName"
      FROM (
        SELECT "id", "senderId", "body", "createdAt", "readAt"
        FROM public.store_messages
        WHERE "conversationId" = ${id}
        ORDER BY "createdAt" DESC
        LIMIT 100
      ) recent
      JOIN public.users sender ON sender."id" = recent."senderId"
      ORDER BY recent."createdAt" ASC
    `;
    return NextResponse.json({
      conversation: {
        id: conversation.id,
        otherPartyName: isStoreOwner ? conversation.customerName : conversation.storeName,
        isStoreOwner,
      },
      messages,
      currentUserId: user.id,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
=======
    if (result.status === 'not-found') return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
    return NextResponse.json({ conversation: result.conversation, messages: result.messages }, { headers: { 'Cache-Control': 'private, no-store' } });
>>>>>>> wael-work-in-progress
  } catch (error) {
    console.error('Unable to load store conversation:', error);
    return NextResponse.json({ error: 'تعذر تحميل المحادثة.' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لإرسال الرسائل.' }, { status: 401 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المحادثة غير صالح.' }, { status: 400 });

<<<<<<< HEAD
  const parsedBody = await readJsonBody(request, 16 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const bodyInput = payload as Record<string, unknown>;
  const body = typeof bodyInput.body === 'string' ? bodyInput.body.trim() : '';
  if (!body || body.length > 4000) return NextResponse.json({ error: 'اكتب رسالة لا تتجاوز 4000 حرف.' }, { status: 400 });
=======
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = parseStoreMessageBody(payload);
  if (!body) return NextResponse.json({ error: 'اكتب رسالة لا تتجاوز 4000 حرف.' }, { status: 400 });
>>>>>>> wael-work-in-progress

  try {
    const result = await sendConversationMessage(id, user.id, body, {
      isAvailable: isStoreMessagingAvailable,
      withTransaction: withStoreMessageTransaction,
      findForParticipant: findParticipantConversation,
      insertMessage: insertStoreMessage,
    });
    if (result.status === 'unavailable') {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }
    if (result.status === 'not-found') return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
    return NextResponse.json({ message: result.message }, { status: 201 });
  } catch (error) {
    console.error('Unable to send store message:', error);
    return NextResponse.json({ error: 'تعذر إرسال الرسالة.' }, { status: 500 });
  }
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض الرسائل.' }, { status: 401 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المحادثة غير صالح.' }, { status: 400 });

  try {
    const result = await markConversationRead(id, user.id, {
      isAvailable: isStoreMessagingAvailable,
      withTransaction: withStoreMessageTransaction,
      findForParticipant: findParticipantConversation,
      markRead: markConversationMessagesRead,
    });
    if (result.status === 'unavailable') {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }
    if (result.status === 'not-found') return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
    return NextResponse.json({ read: true });
  } catch (error) {
    console.error('Unable to mark store messages as read:', error);
    return NextResponse.json({ error: 'تعذر تحديث حالة الرسائل.' }, { status: 500 });
  }
}
