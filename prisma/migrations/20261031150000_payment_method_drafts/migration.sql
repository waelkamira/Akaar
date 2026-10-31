CREATE TABLE "payment_method_drafts" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "description" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payment_method_drafts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payment_method_drafts_provider_check"
    CHECK ("provider" IN ('PAYPAL', 'VISA', 'MASTERCARD', 'STRIPE', 'SHAM_CASH', 'OTHER'))
);

CREATE UNIQUE INDEX "payment_method_drafts_name_lower_key"
  ON "payment_method_drafts" (LOWER("name"));
