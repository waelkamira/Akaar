import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isStoreMessagingAvailable } from '@/lib/messages/table-availability';
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
    if (result.status === 'not-found') return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
    return NextResponse.json({ conversation: result.conversation, messages: result.messages }, { headers: { 'Cache-Control': 'private, no-store' } });
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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = parseStoreMessageBody(payload);
  if (!body) return NextResponse.json({ error: 'اكتب رسالة لا تتجاوز 4000 حرف.' }, { status: 400 });

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
