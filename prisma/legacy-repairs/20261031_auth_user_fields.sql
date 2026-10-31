BEGIN;

DO $repair$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RAISE EXCEPTION 'Expected legacy table public.users was not found.';
  END IF;

  IF EXISTS (
    SELECT required.column_name
    FROM unnest(ARRAY['id', 'userName', 'email', 'googleId', 'password', 'roleId', 'userImage']) AS required(column_name)
    WHERE NOT EXISTS (
      SELECT 1
      FROM information_schema.columns AS existing
      WHERE existing.table_schema = 'public'
        AND existing.table_name = 'users'
        AND existing.column_name = required.column_name
    )
  ) THEN
    RAISE EXCEPTION 'public.users does not match the inspected legacy user schema.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_type AS type
    JOIN pg_namespace AS namespace ON namespace.oid = type.typnamespace
    WHERE namespace.nspname = 'public'
      AND type.typname = 'UserRole'
  ) THEN
    CREATE TYPE public."UserRole" AS ENUM ('GUEST', 'CUSTOMER', 'SELLER', 'ADMIN');
  ELSIF (
    SELECT COUNT(*)
    FROM pg_enum AS value
    JOIN pg_type AS type ON type.oid = value.enumtypid
    JOIN pg_namespace AS namespace ON namespace.oid = type.typnamespace
    WHERE namespace.nspname = 'public'
      AND type.typname = 'UserRole'
      AND value.enumlabel IN ('GUEST', 'CUSTOMER', 'SELLER', 'ADMIN')
  ) <> 4 THEN
    RAISE EXCEPTION 'public."UserRole" exists but is missing required values.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_type AS type
    JOIN pg_namespace AS namespace ON namespace.oid = type.typnamespace
    WHERE namespace.nspname = 'public'
      AND type.typname = 'UserStatus'
  ) THEN
    CREATE TYPE public."UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
  ELSIF (
    SELECT COUNT(*)
    FROM pg_enum AS value
    JOIN pg_type AS type ON type.oid = value.enumtypid
    JOIN pg_namespace AS namespace ON namespace.oid = type.typnamespace
    WHERE namespace.nspname = 'public'
      AND type.typname = 'UserStatus'
      AND value.enumlabel IN ('ACTIVE', 'SUSPENDED', 'DELETED')
  ) <> 3 THEN
    RAISE EXCEPTION 'public."UserStatus" exists but is missing required values.';
  END IF;
END
$repair$;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS "role" public."UserRole" NOT NULL DEFAULT 'CUSTOMER',
  ADD COLUMN IF NOT EXISTS "status" public."UserStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.users
  ALTER COLUMN "updatedAt" DROP DEFAULT;

CREATE INDEX IF NOT EXISTS "users_role_idx" ON public.users("role");
CREATE INDEX IF NOT EXISTS "users_status_idx" ON public.users("status");

DO $repair$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'role'
      AND (udt_name <> 'UserRole' OR is_nullable <> 'NO')
  ) OR EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'status'
      AND (udt_name <> 'UserStatus' OR is_nullable <> 'NO')
  ) OR EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name IN ('createdAt', 'updatedAt')
      AND (data_type <> 'timestamp without time zone' OR is_nullable <> 'NO')
  ) THEN
    RAISE EXCEPTION 'Auth column validation failed; transaction will be rolled back.';
  END IF;
END
$repair$;

COMMIT;
