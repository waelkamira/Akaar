import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { isStoreMessagingAvailable } from '@/lib/messages/table-availability';
import { insertStoreMessage } from '@/lib/messages/store-messaging';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

type RouteContext = { params: Promise<{ id: string }> };

async function findParticipantConversation(
  database: Pick<Prisma.TransactionClient, '$queryRaw'>,
  conversationId: string,
  userId: string,
) {
  const [conversation] = await database.$queryRaw<Array<{
    id: string;
    customerId: string;
    sellerUserId: string;
    storeName: string;
    customerName: string;
  }>>`
    SELECT c."id", c."customerId", s."userId" AS "sellerUserId", s."storeName",
      COALESCE(customer."userName", 'مستخدم') AS "customerName"
    FROM public.store_conversations c
    JOIN public.sellers s ON s."id" = c."sellerId"
    JOIN public.users customer ON customer."id" = c."customerId"
    WHERE c."id" = ${conversationId}
      AND (c."customerId" = ${userId} OR s."userId" = ${userId})
    LIMIT 1
  `;
  return conversation ?? null;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض الرسائل.' }, { status: 401 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المحادثة غير صالح.' }, { status: 400 });

  try {
    if (!(await isStoreMessagingAvailable())) {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }
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

  const parsedBody = await readJsonBody(request, 16 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const bodyInput = payload as Record<string, unknown>;
  const body = typeof bodyInput.body === 'string' ? bodyInput.body.trim() : '';
  if (!body || body.length > 4000) return NextResponse.json({ error: 'اكتب رسالة لا تتجاوز 4000 حرف.' }, { status: 400 });

  try {
    if (!(await isStoreMessagingAvailable())) {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }
    const result = await prisma.$transaction(async (transaction) => {
      const conversation = await findParticipantConversation(transaction, id, user.id);
      if (!conversation) return null;
      const recipientId = conversation.customerId === user.id
        ? conversation.sellerUserId
        : conversation.customerId;
      const message = await insertStoreMessage(transaction, {
        conversationId: conversation.id,
        senderId: user.id,
        recipientId,
        body,
      });
      return { message };
    });
    if (!result) return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
    return NextResponse.json(result, { status: 201 });
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
    if (!(await isStoreMessagingAvailable())) {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }
    const conversation = await findParticipantConversation(prisma, id, user.id);
    if (!conversation) return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });

    await prisma.$executeRaw`
      UPDATE public.store_messages
      SET "readAt" = NOW()
      WHERE "conversationId" = ${id}
        AND "senderId" <> ${user.id}
        AND "readAt" IS NULL
    `;
    return NextResponse.json({ read: true });
  } catch (error) {
    console.error('Unable to mark store messages as read:', error);
    return NextResponse.json({ error: 'تعذر تحديث حالة الرسائل.' }, { status: 500 });
  }
}
