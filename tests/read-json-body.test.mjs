import test from 'node:test';
import assert from 'node:assert/strict';
import { readJsonBody } from '../lib/api/read-json-body.mjs';

function requestWithBody(body) {
  return new Request('http://localhost/api/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

test('reads valid JSON within the configured byte limit', async () => {
  const result = await readJsonBody(requestWithBody('{"name":"Seller"}'), 128);
  assert.deepEqual(result, { ok: true, value: { name: 'Seller' } });
});

test('rejects malformed JSON and invalid UTF-8', async () => {
  assert.equal((await readJsonBody(requestWithBody('{broken'), 128)).status, 400);
  const invalidUtf8 = new Uint8Array([0xc3, 0x28]);
  const request = new Request('http://localhost/api/register', {
    method: 'POST',
    body: invalidUtf8,
  });
  assert.equal((await readJsonBody(request, 128)).status, 400);
});

test('rejects bodies exceeding the configured byte limit', async () => {
  const result = await readJsonBody(requestWithBody(JSON.stringify({ name: 'x'.repeat(200) })), 32);
  assert.deepEqual(result, {
    ok: false,
    status: 413,
    error: 'حجم بيانات الطلب أكبر من المسموح.',
  });
});

test('rejects requests without a body', async () => {
  const request = new Request('http://localhost/api/register', { method: 'POST' });
  assert.equal((await readJsonBody(request)).status, 400);
});

test('rejects invalid byte limits', async () => {
  await assert.rejects(() => readJsonBody(requestWithBody('{}'), 0), TypeError);
  await assert.rejects(() => readJsonBody(requestWithBody('{}'), Number.MAX_SAFE_INTEGER + 1), TypeError);
});
