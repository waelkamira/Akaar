import { randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';

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
      userId: input.recipientId,
      type: 'STORE_MESSAGE',
      message: 'لديك رسالة جديدة في محادثة المتجر.',
    },
  });
  return message;
}
