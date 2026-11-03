export async function sendStoreMessage(input, dependencies) {
  return dependencies.withTransaction(async (transaction) => {
    const conversation = await dependencies.getOrCreateConversation(transaction, {
      customerId: input.senderId,
      sellerId: input.sellerId,
    });
    const message = await dependencies.insertMessage(transaction, {
      conversationId: conversation.id,
      senderId: input.senderId,
      recipientId: input.recipientId,
      body: input.body,
    });
    return { conversationId: conversation.id, message };
  });
}

export async function loadStoreConversations(userId, dependencies) {
  if (!(await dependencies.isAvailable())) return { available: false };

  const conversations = await dependencies.listForUser(userId);
  return { available: true, conversations };
}

export async function loadStoreConversation(conversationId, userId, dependencies) {
  if (!(await dependencies.isAvailable())) return { status: 'unavailable' };

  const conversation = await dependencies.findForParticipant(conversationId, userId);
  if (!conversation) return { status: 'not-found' };

  const messages = await dependencies.listMessages(conversation.id);
  const isStoreOwner = conversation.sellerUserId === userId;
  return {
    status: 'ok',
    conversation: {
      id: conversation.id,
      otherPartyName: isStoreOwner ? conversation.customerName : conversation.storeName,
      isStoreOwner,
    },
    messages,
  };
}

export async function sendConversationMessage(conversationId, userId, body, dependencies) {
  if (!(await dependencies.isAvailable())) return { status: 'unavailable' };

  const result = await dependencies.withTransaction(async (transaction) => {
    const conversation = await dependencies.findForParticipant(transaction, conversationId, userId);
    if (!conversation) return null;

    const recipientId = conversation.customerId === userId
      ? conversation.sellerUserId
      : conversation.customerId;
    const message = await dependencies.insertMessage(transaction, {
      conversationId: conversation.id,
      senderId: userId,
      recipientId,
      body,
    });
    return { message };
  });
  return result ? { status: 'ok', ...result } : { status: 'not-found' };
}

export async function markConversationRead(conversationId, userId, dependencies) {
  if (!(await dependencies.isAvailable())) return { status: 'unavailable' };

  const marked = await dependencies.withTransaction(async (transaction) => {
    const conversation = await dependencies.findForParticipant(transaction, conversationId, userId);
    if (!conversation) return false;
    await dependencies.markRead(transaction, conversation.id, userId);
    return true;
  });
  return { status: marked ? 'ok' : 'not-found' };
}
