import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const boundedMutationRoutes = [
  ['app/api/seller/products/[id]/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/admin/settings/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/admin/sellers/[id]/approval/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/admin/products/[id]/approval/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/admin/users/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/messages/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/seller/store/route.ts', '32 * 1024', 32 * 1024],
  ['app/api/bookings/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/seller/orders/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/properties/route.ts', '64 * 1024', 64 * 1024],
  ['app/api/properties/[id]/route.ts', '64 * 1024', 64 * 1024],
  ['app/api/messages/[id]/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/admin/control-panel/messages/[id]/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/admin/users/[id]/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/seller/application/route.ts', '16 * 1024', 16 * 1024],
  ['app/api/admin/control-panel/stores/route.ts', '32 * 1024', 32 * 1024],
  ['app/api/admin/control-panel/messages/route.ts', '64 * 1024', 64 * 1024],
  ['app/api/admin/control-panel/stores/[id]/route.ts', '32 * 1024', 32 * 1024],
];

for (const [path, limitExpression, maxBytes] of boundedMutationRoutes) {
  test(`${path} uses the shared bounded JSON reader (${maxBytes} bytes)`, async () => {
    const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(source, /readJsonBody/);
    assert.ok(source.includes(`readJsonBody(request, ${limitExpression})`));
    assert.doesNotMatch(source, /request\.json\s*\(\s*\)/);
  });
}


async function listFilesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) return listFilesRecursively(fullPath);
    return [fullPath];
  }));
  return nested.flat();
}

test('API route handlers do not call request.json() without a body-size bound', async () => {
  const apiDirectory = new URL('../app/api/', import.meta.url);
  const files = await listFilesRecursively(apiDirectory.pathname);
  const unboundedRoutes = [];

  for (const file of files.filter((path) => /route\\.(?:js|ts)$/.test(path))) {
    const source = await readFile(file, 'utf8');
    if (/request\\.json\\s*\\(\\s*\\)/.test(source)) {
      unboundedRoutes.push(relative(apiDirectory.pathname, file).replaceAll('\\\\', '/'));
    }
  }

  assert.deepEqual(unboundedRoutes, [], `Unbounded JSON parsing remains in: ${unboundedRoutes.join(', ')}`);
});
