-- Reconcile migration-generated PostgreSQL metadata with prisma/schema.prisma.
-- These changes preserve all rows and normalize names/defaults only.

ALTER TABLE "Order"
  ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "marketplace_settings"
  ALTER COLUMN "updatedAt" DROP DEFAULT;

ALTER TABLE public.favorites
  RENAME CONSTRAINT "Favorite_pkey" TO "favorites_pkey";
ALTER TABLE public.favorites
  RENAME CONSTRAINT "Favorite_productId_fkey" TO "favorites_productId_fkey";
ALTER TABLE public.favorites
  RENAME CONSTRAINT "Favorite_userId_fkey" TO "favorites_userId_fkey";

ALTER TABLE public.reviews
  RENAME CONSTRAINT "Review_pkey" TO "reviews_pkey";
ALTER TABLE public.reviews
  RENAME CONSTRAINT "Review_productId_fkey" TO "reviews_productId_fkey";
ALTER TABLE public.reviews
  RENAME CONSTRAINT "Review_userId_fkey" TO "reviews_userId_fkey";

ALTER INDEX IF EXISTS "Favorite_productId_idx"
  RENAME TO "favorites_productId_idx";
ALTER INDEX IF EXISTS "Favorite_userId_isDeleted_idx"
  RENAME TO "favorites_userId_isDeleted_idx";
ALTER INDEX IF EXISTS "Favorite_userId_productId_key"
  RENAME TO "favorites_userId_productId_key";
ALTER INDEX IF EXISTS "Review_productId_rating_idx"
  RENAME TO "reviews_productId_rating_idx";
ALTER INDEX IF EXISTS "Review_userId_idx"
  RENAME TO "reviews_userId_idx";
