import assert from 'node:assert/strict';
import test from 'node:test';
import {
  loadStoreConversation,
  loadStoreConversations,
  markConversationRead,
  sendConversationMessage,
  sendStoreMessage,
} from '../lib/messages/service.mjs';

function createDependencies() {
  const calls = [];
  const transaction = { name: 'transaction' };
  return {
    calls,
    transaction,
    withTransaction: async (operation) => {
      calls.push(['transaction']);
      return operation(transaction);
    },
    getOrCreateConversation: async (client, input) => {
      calls.push(['conversation', client, input]);
      return { id: 'conversation-id' };
    },
    insertMessage: async (client, input) => {
      calls.push(['message', client, input]);
      return { id: 'message-id' };
    },
  };
}

test('creates the conversation and message in one transaction', async () => {
  const dependencies = createDependencies();
  const result = await sendStoreMessage({
    senderId: 'customer-id',
    sellerId: 'seller-id',
    recipientId: 'seller-owner-id',
    body: 'Hello',
  }, dependencies);

  assert.deepEqual(result, {
    conversationId: 'conversation-id',
    message: { id: 'message-id' },
  });
  assert.deepEqual(dependencies.calls, [
    ['transaction'],
    ['conversation', dependencies.transaction, {
      customerId: 'customer-id',
      sellerId: 'seller-id',
    }],
    ['message', dependencies.transaction, {
      conversationId: 'conversation-id',
      senderId: 'customer-id',
      recipientId: 'seller-owner-id',
      body: 'Hello',
    }],
  ]);
});

test('propagates message persistence failures so the transaction can roll back', async () => {
  const dependencies = createDependencies();
  const failure = new Error('message persistence failed');
  dependencies.insertMessage = async () => {
    throw failure;
  };

  await assert.rejects(sendStoreMessage({
    senderId: 'customer-id',
    sellerId: 'seller-id',
    recipientId: 'seller-owner-id',
    body: 'Hello',
  }, dependencies), failure);
});

test('does not query conversations when the messaging tables are unavailable', async () => {
  let listCalled = false;
  const result = await loadStoreConversations('customer-id', {
    async isAvailable() {
      return false;
    },
    async listForUser() {
      listCalled = true;
      return [];
    },
  });

  assert.deepEqual(result, { available: false });
  assert.equal(listCalled, false);
});

test('loads conversations only for the authenticated user ID', async () => {
  const conversations = [{ id: 'conversation-id' }];
  const requestedUsers = [];
  const result = await loadStoreConversations('customer-id', {
    async isAvailable() {
      return true;
    },
    async listForUser(userId) {
      requestedUsers.push(userId);
      return conversations;
    },
  });

  assert.deepEqual(result, { available: true, conversations });
  assert.deepEqual(requestedUsers, ['customer-id']);
});

test('propagates conversation read errors', async () => {
  const failure = new Error('conversation read failed');

  await assert.rejects(loadStoreConversations('customer-id', {
    async isAvailable() {
      return true;
    },
    async listForUser() {
      throw failure;
    },
  }), failure);
});

test('loads only an authorized conversation and derives the other party label', async () => {
  const requested = [];
  const result = await loadStoreConversation('conversation-id', 'seller-owner-id', {
    async isAvailable() {
      return true;
    },
    async findForParticipant(id, userId) {
      requested.push([id, userId]);
      return {
        id,
        customerId: 'customer-id',
        sellerUserId: 'seller-owner-id',
        storeName: 'Store',
        customerName: 'Customer',
      };
    },
    async listMessages(id) {
      requested.push(['messages', id]);
      return [{ id: 'message-id' }];
    },
  });

  assert.deepEqual(result, {
    status: 'ok',
    conversation: { id: 'conversation-id', otherPartyName: 'Customer', isStoreOwner: true },
    messages: [{ id: 'message-id' }],
  });
  assert.deepEqual(requested, [['conversation-id', 'seller-owner-id'], ['messages', 'conversation-id']]);
});

test('does not load messages for an unauthorized conversation', async () => {
  let listCalled = false;
  const result = await loadStoreConversation('conversation-id', 'other-user-id', {
    async isAvailable() {
      return true;
    },
    async findForParticipant() {
      return null;
    },
    async listMessages() {
      listCalled = true;
      return [];
    },
  });

  assert.deepEqual(result, { status: 'not-found' });
  assert.equal(listCalled, false);
});

test('sends replies to the other conversation participant within a transaction', async () => {
  const calls = [];
  const transaction = {};
  const result = await sendConversationMessage('conversation-id', 'customer-id', 'Reply', {
    async isAvailable() {
      return true;
    },
    async withTransaction(operation) {
      return operation(transaction);
    },
    async findForParticipant(client, id, userId) {
      calls.push(['conversation', client, id, userId]);
      return {
        id,
        customerId: 'customer-id',
        sellerUserId: 'store-owner-id',
      };
    },
    async insertMessage(client, input) {
      calls.push(['message', client, input]);
      return { id: 'reply-id' };
    },
  });

  assert.deepEqual(result, { status: 'ok', message: { id: 'reply-id' } });
  assert.deepEqual(calls, [
    ['conversation', transaction, 'conversation-id', 'customer-id'],
    ['message', transaction, {
      conversationId: 'conversation-id',
      senderId: 'customer-id',
      recipientId: 'store-owner-id',
      body: 'Reply',
    }],
  ]);
});

test('marks read only after confirming the user is a participant', async () => {
  const calls = [];
  const result = await markConversationRead('conversation-id', 'customer-id', {
    async isAvailable() {
      return true;
    },
    async withTransaction(operation) {
      return operation({});
    },
    async findForParticipant(transaction, id, userId) {
      calls.push(['conversation', id, userId]);
      return { id };
    },
    async markRead(transaction, id, userId) {
      calls.push(['mark-read', id, userId]);
    },
  });

  assert.deepEqual(result, { status: 'ok' });
  assert.deepEqual(calls, [
    ['conversation', 'conversation-id', 'customer-id'],
    ['mark-read', 'conversation-id', 'customer-id'],
  ]);
});
