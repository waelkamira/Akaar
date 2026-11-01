import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const boundedMutationRoutes = [
  ['app/api/seller/products/[id]/route.ts', 16 * 1024],
  ['app/api/admin/settings/route.ts', 16 * 1024],
  ['app/api/admin/sellers/[id]/approval/route.ts', 16 * 1024],
  ['app/api/admin/products/[id]/approval/route.ts', 16 * 1024],
  ['app/api/admin/users/route.ts', 16 * 1024],
  ['app/api/messages/route.ts', 16 * 1024],
  ['app/api/seller/store/route.ts', 32 * 1024],
  ['app/api/bookings/route.ts', 16 * 1024],
  ['app/api/seller/orders/route.ts', 16 * 1024],
  ['app/api/properties/route.ts', 64 * 1024],
  ['app/api/properties/[id]/route.ts', 64 * 1024],
  ['app/api/messages/[id]/route.ts', 16 * 1024],
  ['app/api/admin/control-panel/messages/[id]/route.ts', 16 * 1024],
  ['app/api/admin/users/[id]/route.ts', 16 * 1024],
  ['app/api/seller/application/route.ts', 16 * 1024],
  ['app/api/admin/control-panel/stores/route.ts', 32 * 1024],
  ['app/api/admin/control-panel/messages/route.ts', 64 * 1024],
  ['app/api/admin/control-panel/stores/[id]/route.ts', 32 * 1024],
];

for (const [path, maxBytes] of boundedMutationRoutes) {
  test(`${path} uses the shared bounded JSON reader (${maxBytes} bytes)`, async () => {
    const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(source, /readJsonBody/);
    assert.ok(source.includes(`readJsonBody(request, ${maxBytes})`));
    assert.doesNotMatch(source, /request\.json\s*\(\s*\)/);
  });
}
