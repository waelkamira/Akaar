DO $$
BEGIN
  IF to_regclass('public.reviews') IS NULL AND to_regclass('public."Review"') IS NOT NULL THEN
    ALTER TABLE public."Review" RENAME TO reviews;
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS "reviews_userId_productId_key"
  ON public.reviews("userId", "productId");

CREATE TABLE public.store_reviews (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "sellerId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "store_reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "store_reviews_rating_check" CHECK ("rating" BETWEEN 1 AND 5),
  CONSTRAINT "store_reviews_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES public.users("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "store_reviews_sellerId_fkey"
    FOREIGN KEY ("sellerId") REFERENCES public.sellers("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "store_reviews_userId_sellerId_key"
  ON public.store_reviews("userId", "sellerId");
CREATE INDEX "store_reviews_sellerId_rating_idx"
  ON public.store_reviews("sellerId", "rating");
CREATE INDEX "store_reviews_userId_idx"
  ON public.store_reviews("userId");
