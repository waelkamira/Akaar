ALTER TABLE "stores"
  ADD COLUMN "contactEmail" VARCHAR(320),
  ADD COLUMN "contactPhone" VARCHAR(32);

CREATE TABLE "store_pages" (
  "id" UUID NOT NULL,
  "storeId" UUID NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "store_pages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "store_pages_storeId_slug_key" ON "store_pages"("storeId", "slug");
CREATE INDEX "store_pages_storeId_isPublished_idx" ON "store_pages"("storeId", "isPublished");

ALTER TABLE "store_pages"
  ADD CONSTRAINT "store_pages_storeId_fkey"
  FOREIGN KEY ("storeId") REFERENCES "stores"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
