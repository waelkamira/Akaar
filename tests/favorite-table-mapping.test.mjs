import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const schema = await readFile(new URL('../prisma/schema.prisma', import.meta.url), 'utf8');
const activeMigration = await readFile(
  new URL('../prisma/migrations/20261102000000_init/migration.sql', import.meta.url),
  'utf8',
);
const archivedMigration = await readFile(
  new URL('../prisma/migrations_legacy_backup/20261102000000_map_favorites_table/migration.sql', import.meta.url),
  'utf8',
);
const favoriteIdsRoute = await readFile(
  new URL('../app/api/favorite/ids/route.js', import.meta.url),
  'utf8',
);
const favoriteRoute = await readFile(
  new URL('../app/api/favorite/route.js', import.meta.url),
  'utf8',
);
const favoriteCheckRoute = await readFile(
  new URL('../app/api/favorite/check/route.js', import.meta.url),
  'utf8',
);
const favoritePage = await readFile(
  new URL('../app/(shop)/favorite/page.tsx', import.meta.url),
  'utf8',
);
const favoriteRepository = await readFile(
  new URL('../lib/favorites/repository.ts', import.meta.url),
  'utf8',
);

test('maps Prisma favorites to the legacy-compatible lowercase table', () => {
  const favoriteModel = schema.match(/model Favorite \{[\s\S]*?\n\}/)?.[0];
  assert.ok(favoriteModel, 'Favorite model exists');
  assert.match(favoriteModel, /@@map\("favorites"\)/);
});

test('clean installs create the canonical lowercase favorites table', () => {
  assert.match(activeMigration, /CREATE TABLE "favorites"/);
  assert.doesNotMatch(activeMigration, /ALTER TABLE public\."Favorite" RENAME TO favorites/);
});

test('the archived legacy migration safely renames an unambiguous favorite table', () => {
  assert.match(archivedMigration, /ALTER TABLE public\."Favorite" RENAME TO favorites/);
  assert.match(archivedMigration, /Both public\.favorites and public\."Favorite" exist/);
});

test('favorite ID lookup uses the existing lowercase favorites table', () => {
  assert.match(favoriteIdsRoute, /FROM public\.favorites AS favorite/);
  assert.doesNotMatch(favoriteIdsRoute, /prisma\.favorite\.findMany/);
});

test('favorite toggle uses an atomic upsert against the lowercase favorites table', () => {
  const postStart = favoriteRoute.indexOf('export async function POST(req)');
  const deleteStart = favoriteRoute.indexOf('export async function DELETE(req)');
  assert.ok(postStart >= 0 && deleteStart > postStart, 'favorite POST handler exists');
  const postHandler = favoriteRoute.slice(postStart, deleteStart);
  assert.match(postHandler, /INSERT INTO public\.favorites/);
  assert.match(postHandler, /FROM public\.products AS product/);
  assert.match(postHandler, /EXISTS \(SELECT 1 FROM public\.users/);
  assert.match(postHandler, /ON CONFLICT \("userId", "productId"\)/);
  assert.match(postHandler, /RETURNING "isDeleted"/);
  assert.doesNotMatch(postHandler, /prisma\.(?:favorite|user|product)\./);
});

test('favorites page delegates to a repository that queries the lowercase favorites table', () => {
  assert.match(favoritePage, /listFavoriteProducts/);
  assert.doesNotMatch(favoritePage, /@\/lib\/db\/prisma|prisma\./);
  assert.match(favoriteRepository, /FROM public\.favorites AS favorite/);
  assert.match(favoriteRoute, /ORDER BY favorite\."createdAt" DESC/);
  assert.doesNotMatch(favoriteRoute, /prisma\.favorite\./);
  assert.match(favoriteCheckRoute, /FROM public\.favorites AS favorite/);
  assert.doesNotMatch(favoriteCheckRoute, /prisma\.favorite\./);
});
