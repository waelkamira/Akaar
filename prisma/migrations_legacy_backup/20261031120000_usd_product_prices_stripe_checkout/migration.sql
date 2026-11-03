ALTER TABLE "products" ADD COLUMN "usdPriceCents" INTEGER;

ALTER TABLE "Payment"
  ADD COLUMN "currency" VARCHAR(3) NOT NULL DEFAULT 'SYP',
  ADD COLUMN "providerReference" TEXT;

CREATE UNIQUE INDEX "Payment_providerReference_key" ON "Payment"("providerReference");
