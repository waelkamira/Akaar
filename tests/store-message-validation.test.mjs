import assert from 'node:assert/strict';
import test from 'node:test';
import { parseStoreMessageBody, parseStoreMessageInput } from '../lib/messages/validation.mjs';

test('trims and returns valid store message fields', () => {
  assert.deepEqual(parseStoreMessageInput({
    sellerId: ' seller-id ',
    body: '  Hello from the customer.  ',
  }), {
    sellerId: 'seller-id',
    body: 'Hello from the customer.',
  });
});

test('rejects invalid object shapes and missing values', () => {
  for (const input of [null, [], 'message', {}, { sellerId: 'seller-id', body: '  ' }]) {
    assert.equal(parseStoreMessageInput(input), null);
  }
});

test('rejects values exceeding the route limits', () => {
  assert.equal(parseStoreMessageInput({ sellerId: 's'.repeat(129), body: 'Hello' }), null);
  assert.equal(parseStoreMessageInput({ sellerId: 'seller-id', body: 'x'.repeat(4001) }), null);
  assert.equal(parseStoreMessageBody({ body: 'x'.repeat(4001) }), null);
});

test('parses a bounded message body for replies', () => {
  assert.equal(parseStoreMessageBody({ body: '  Reply  ' }), 'Reply');
  assert.equal(parseStoreMessageBody({ body: '' }), null);
  assert.equal(parseStoreMessageBody([]), null);
});
