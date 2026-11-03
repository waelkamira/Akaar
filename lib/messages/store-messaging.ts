import { randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

export type ParticipantConversation = {
  id: string;
  customerId: string;
  sellerUserId: string;
  storeName: string;
  customerName: string;
};

export async function withStoreMessageTransaction<T>(
  operation: (transaction: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(operation);
}

export async function findActiveMessagingSeller(sellerId: string) {
  return prisma.seller.findFirst({
    where: { id: sellerId, status: 'ACTIVE', isVerified: true },
    select: { id: true, userId: true },
  });
}

export async function findParticipantConversation(
  database: Pick<Prisma.TransactionClient, '$queryRaw'>,
  conversationId: string,
  userId: string,
) {
  const [conversation] = await database.$queryRaw<ParticipantConversation[]>`
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

export async function insertStoreMessage(
  transaction: Prisma.TransactionClient,
  input: { conversationId: string; senderId: string; recipientId: string; body: string },
) {
  const id = randomUUID();
  const [message] = await transaction.$queryRaw<Array<{ id: string; createdAt: Date }>>`
    INSERT INTO public.store_messages ("id", "conversationId", "senderId", "body", "createdAt")
    VALUES (${id}, ${input.conversationId}, ${input.senderId}, ${input.body}, NOW())
    RETURNING "id", "createdAt"
  `;
  await transaction.$executeRaw`
    UPDATE public.store_conversations
    SET "updatedAt" = NOW()
    WHERE "id" = ${input.conversationId}
  `;
  await transaction.notification.create({
    data: {
      user: { connect: { id: input.recipientId } },
      type: 'STORE_MESSAGE',
      title: 'رسالة جديدة من المتجر',
      message: 'لديك رسالة جديدة في محادثة المتجر.',
    },
  });
  return message;
}

export async function getOrCreateStoreConversation(
  transaction: Prisma.TransactionClient,
  input: { customerId: string; sellerId: string },
) {
  const [conversation] = await transaction.$queryRaw<Array<{ id: string }>>`
    INSERT INTO public.store_conversations ("id", "customerId", "sellerId", "createdAt", "updatedAt")
    VALUES (${randomUUID()}, ${input.customerId}, ${input.sellerId}, NOW(), NOW())
    ON CONFLICT ("customerId", "sellerId")
    DO UPDATE SET "updatedAt" = NOW()
    RETURNING "id"
  `;
  return conversation;
}

export async function listStoreConversations(userId: string) {
  return prisma.$queryRaw<Array<{
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
      CASE WHEN c."customerId" = ${userId}
        THEN s."storeName"
        ELSE COALESCE(customer."userName", 'مستخدم')
      END AS "otherPartyName",
      (s."userId" = ${userId}) AS "isStoreOwner",
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
          AND m."senderId" <> ${userId}
          AND m."readAt" IS NULL
      ) AS "unreadCount"
    FROM public.store_conversations c
    JOIN public.sellers s ON s."id" = c."sellerId"
    JOIN public.users customer ON customer."id" = c."customerId"
    WHERE c."customerId" = ${userId} OR s."userId" = ${userId}
    ORDER BY c."updatedAt" DESC
    LIMIT 100
  `;
}

export async function listConversationMessages(conversationId: string) {
  return prisma.$queryRaw<Array<{
    id: string;
    senderId: string;
    body: string;
    createdAt: Date;
    senderName: string;
  }>>`
    SELECT recent."id", recent."senderId", recent."body", recent."createdAt",
      COALESCE(sender."userName", 'مستخدم') AS "senderName"
    FROM (
      SELECT "id", "senderId", "body", "createdAt"
      FROM public.store_messages
      WHERE "conversationId" = ${conversationId}
      ORDER BY "createdAt" DESC
      LIMIT 100
    ) recent
    JOIN public.users sender ON sender."id" = recent."senderId"
    ORDER BY recent."createdAt" ASC
  `;
}

export async function markConversationMessagesRead(
  transaction: Prisma.TransactionClient,
  conversationId: string,
  userId: string,
) {
  return transaction.$executeRaw`
    UPDATE public.store_messages
    SET "readAt" = NOW()
    WHERE "conversationId" = ${conversationId}
      AND "senderId" <> ${userId}
      AND "readAt" IS NULL
  `;
}
