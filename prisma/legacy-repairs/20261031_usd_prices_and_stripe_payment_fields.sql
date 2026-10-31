BEGIN;

DO $repair$
BEGIN
  IF to_regclass('public.products') IS NULL OR to_regclass('public."Payment"') IS NULL THEN
    RAISE EXCEPTION 'Both canonical public.products and public."Payment" tables must exist; reconcile the legacy order schema first.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'usdPriceCents'
  ) OR EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name IN ('currency', 'providerReference')
  ) THEN
    RAISE EXCEPTION 'One or more USD/Stripe columns already exist; inspect the schema before repair.';
  END IF;
END
$repair$;

ALTER TABLE public.products ADD COLUMN "usdPriceCents" INTEGER;
ALTER TABLE public."Payment"
  ADD COLUMN "currency" VARCHAR(3) NOT NULL DEFAULT 'SYP',
  ADD COLUMN "providerReference" TEXT;
CREATE UNIQUE INDEX "Payment_providerReference_key" ON public."Payment"("providerReference");

DO $repair$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products'
      AND column_name = 'usdPriceCents' AND data_type = 'integer'
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Payment'
      AND column_name = 'currency' AND character_maximum_length = 3
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Payment'
      AND column_name = 'providerReference'
  ) THEN
    RAISE EXCEPTION 'USD/Stripe column validation failed; transaction will be rolled back.';
  END IF;
END
$repair$;

COMMIT;
