ALTER TABLE "reviews"
  ADD COLUMN "sellerReply" TEXT,
  ADD COLUMN "sellerRepliedAt" TIMESTAMP(3);

ALTER TABLE "store_reviews"
  ADD COLUMN "sellerReply" TEXT,
  ADD COLUMN "sellerRepliedAt" TIMESTAMP(3);
