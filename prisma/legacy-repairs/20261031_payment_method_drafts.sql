BEGIN;

DO $repair$
BEGIN
  IF to_regclass('public.payment_method_drafts') IS NOT NULL THEN
    RAISE EXCEPTION 'public.payment_method_drafts already exists; inspect it before applying this repair.';
  END IF;
END
$repair$;

CREATE TABLE public.payment_method_drafts (
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
  ON public.payment_method_drafts (LOWER("name"));

DO $repair$
BEGIN
  IF to_regclass('public.payment_method_drafts') IS NULL
     OR NOT EXISTS (
       SELECT 1 FROM pg_indexes
       WHERE schemaname = 'public'
         AND indexname = 'payment_method_drafts_name_lower_key'
     ) THEN
    RAISE EXCEPTION 'Payment-method draft table validation failed; transaction will be rolled back.';
  END IF;
END
$repair$;

COMMIT;
