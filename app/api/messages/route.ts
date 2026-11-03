import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isStoreMessagingAvailable } from '@/lib/messages/table-availability';
import {
  findActiveMessagingSeller,
  getOrCreateStoreConversation,
  insertStoreMessage,
  listStoreConversations,
  withStoreMessageTransaction,
} from '@/lib/messages/store-messaging';
import { loadStoreConversations, sendStoreMessage } from '@/lib/messages/service.mjs';
import { parseStoreMessageInput } from '@/lib/messages/validation.mjs';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض الرسائل.' }, { status: 401 });

  try {
    const result = await loadStoreConversations(user.id, {
      isAvailable: isStoreMessagingAvailable,
      listForUser: listStoreConversations,
    });
    if (!result.available) {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }
    return NextResponse.json({ conversations: result.conversations }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load store conversations:', error);
    return NextResponse.json({ error: 'تعذر تحميل الرسائل.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لمراسلة المتجر.' }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const input = parseStoreMessageInput(payload);
  if (!input) {
    return NextResponse.json({ error: 'حدد متجرًا واكتب رسالة لا تتجاوز 4000 حرف.' }, { status: 400 });
  }
  const { sellerId, body } = input;

  try {
    if (!(await isStoreMessagingAvailable())) {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }

    const seller = await findActiveMessagingSeller(sellerId);
    if (!seller) return NextResponse.json({ error: 'المتجر غير موجود أو غير متاح.' }, { status: 404 });
    if (seller.userId === user.id) return NextResponse.json({ error: 'لا يمكنك مراسلة متجرك.' }, { status: 403 });

    const result = await sendStoreMessage({
      senderId: user.id,
      sellerId: seller.id,
      recipientId: seller.userId,
      body,
    }, {
      withTransaction: withStoreMessageTransaction,
      getOrCreateConversation: getOrCreateStoreConversation,
      insertMessage: insertStoreMessage,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Unable to start store conversation:', error);
    return NextResponse.json({ error: 'تعذر إرسال الرسالة.' }, { status: 500 });
  }
}
