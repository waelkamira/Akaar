CREATE TABLE "store_conversations" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "store_conversations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "store_conversations_customerId_fkey"
      FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "store_conversations_sellerId_fkey"
      FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "store_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "store_messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "store_messages_conversationId_fkey"
      FOREIGN KEY ("conversationId") REFERENCES "store_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "store_messages_senderId_fkey"
      FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "store_conversations_customerId_sellerId_key"
  ON "store_conversations"("customerId", "sellerId");
CREATE INDEX "store_conversations_sellerId_updatedAt_idx"
  ON "store_conversations"("sellerId", "updatedAt");
CREATE INDEX "store_messages_conversationId_createdAt_idx"
  ON "store_messages"("conversationId", "createdAt");
CREATE INDEX "store_messages_conversationId_senderId_readAt_idx"
  ON "store_messages"("conversationId", "senderId", "readAt");
