export function parseStoreMessageInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;

  const sellerId = typeof input.sellerId === 'string' ? input.sellerId.trim() : '';
  const body = parseStoreMessageBody(input);
  if (!sellerId || sellerId.length > 128 || !body) return null;

  return { sellerId, body };
}

export function parseStoreMessageBody(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;

  const body = typeof input.body === 'string' ? input.body.trim() : '';
  if (!body || body.length > 4000) return null;
  return body;
}
