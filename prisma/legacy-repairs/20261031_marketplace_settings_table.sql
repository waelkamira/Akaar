BEGIN;

DO $repair$
BEGIN
  IF to_regclass('public.marketplace_settings') IS NOT NULL THEN
    RAISE EXCEPTION 'public.marketplace_settings already exists; inspect it before applying this repair.';
  END IF;
END
$repair$;

CREATE TABLE public.marketplace_settings (
  "key" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "marketplace_settings_pkey" PRIMARY KEY ("key")
);

DO $repair$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'marketplace_settings'
      AND column_name = 'enabled'
      AND data_type = 'boolean'
      AND is_nullable = 'NO'
  ) THEN
    RAISE EXCEPTION 'Marketplace settings validation failed; transaction will be rolled back.';
  END IF;
END
$repair$;

COMMIT;
