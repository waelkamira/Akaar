import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { isStoreMessagingAvailable } from '@/lib/messages/table-availability';
import { insertStoreMessage } from '@/lib/messages/store-messaging';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض الرسائل.' }, { status: 401 });

  try {
    if (!(await isStoreMessagingAvailable())) {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }

    const conversations = await prisma.$queryRaw<Array<{
      id: string;
      sellerId: string;
      otherPartyName: string;
      isStoreOwner: boolean;
      lastMessage: string | null;
      lastMessageAt: Date | null;
      unreadCount: number;
    }>>`
      SELECT
        c."id",
        c."sellerId",
        CASE WHEN c."customerId" = ${user.id}
          THEN s."storeName"
          ELSE COALESCE(customer."userName", 'مستخدم')
        END AS "otherPartyName",
        (s."userId" = ${user.id}) AS "isStoreOwner",
        (
          SELECT m."body"
          FROM public.store_messages m
          WHERE m."conversationId" = c."id"
          ORDER BY m."createdAt" DESC
          LIMIT 1
        ) AS "lastMessage",
        (
          SELECT m."createdAt"
          FROM public.store_messages m
          WHERE m."conversationId" = c."id"
          ORDER BY m."createdAt" DESC
          LIMIT 1
        ) AS "lastMessageAt",
        (
          SELECT COUNT(*)::int
          FROM public.store_messages m
          WHERE m."conversationId" = c."id"
            AND m."senderId" <> ${user.id}
            AND m."readAt" IS NULL
        ) AS "unreadCount"
      FROM public.store_conversations c
      JOIN public.sellers s ON s."id" = c."sellerId"
      JOIN public.users customer ON customer."id" = c."customerId"
      WHERE c."customerId" = ${user.id} OR s."userId" = ${user.id}
      ORDER BY c."updatedAt" DESC
      LIMIT 100
    `;

    return NextResponse.json({ conversations }, { headers: { 'Cache-Control': 'private, no-store' } });
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
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const bodyInput = payload as Record<string, unknown>;

  const sellerId = typeof bodyInput.sellerId === 'string' ? bodyInput.sellerId.trim() : '';
  const body = typeof bodyInput.body === 'string' ? bodyInput.body.trim() : '';
  if (!sellerId || sellerId.length > 128 || !body || body.length > 4000) {
    return NextResponse.json({ error: 'حدد متجرًا واكتب رسالة لا تتجاوز 4000 حرف.' }, { status: 400 });
  }

  try {
    if (!(await isStoreMessagingAvailable())) {
      return NextResponse.json({ error: 'نظام الرسائل غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }

    const seller = await prisma.seller.findFirst({
      where: { id: sellerId, status: 'ACTIVE', isVerified: true },
      select: { id: true, userId: true },
    });
    if (!seller) return NextResponse.json({ error: 'المتجر غير موجود أو غير متاح.' }, { status: 404 });
    if (seller.userId === user.id) return NextResponse.json({ error: 'لا يمكنك مراسلة متجرك.' }, { status: 403 });

    const result = await prisma.$transaction(async (transaction) => {
      const [conversation] = await transaction.$queryRaw<Array<{ id: string }>>`
        INSERT INTO public.store_conversations ("id", "customerId", "sellerId", "createdAt", "updatedAt")
        VALUES (${randomUUID()}, ${user.id}, ${seller.id}, NOW(), NOW())
        ON CONFLICT ("customerId", "sellerId")
        DO UPDATE SET "updatedAt" = NOW()
        RETURNING "id"
      `;
      const message = await insertStoreMessage(transaction, {
        conversationId: conversation.id,
        senderId: user.id,
        recipientId: seller.userId,
        body,
      });
      return { conversationId: conversation.id, message };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Unable to start store conversation:', error);
    return NextResponse.json({ error: 'تعذر إرسال الرسالة.' }, { status: 500 });
  }
}
