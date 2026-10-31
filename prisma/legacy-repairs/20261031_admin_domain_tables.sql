BEGIN;

DO $repair$
DECLARE
  missing_column TEXT;
  required_table TEXT;
BEGIN
  IF to_regclass('public.users') IS NULL OR to_regclass('public.products') IS NULL THEN
    RAISE EXCEPTION 'Expected legacy public.users and public.products tables were not found.';
  END IF;

  FOREACH required_table IN ARRAY ARRAY[
    'sellers',
    'stores',
    'properties',
    'property_wishlist',
    'booking_requests'
  ] LOOP
    IF to_regclass(format('public.%I', required_table)) IS NOT NULL THEN
      RAISE EXCEPTION 'public.% already exists; inspect it before applying this repair.', required_table;
    END IF;
  END LOOP;

  FOREACH missing_column IN ARRAY ARRAY['id'] LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = missing_column
        AND data_type = 'text'
        AND is_nullable = 'NO'
    ) THEN
      RAISE EXCEPTION 'public.users.% does not match the inspected legacy schema.', missing_column;
    END IF;
  END LOOP;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'sellerId'
      AND data_type = 'text'
      AND is_nullable = 'YES'
  ) THEN
    RAISE EXCEPTION 'public.products.sellerId does not match the inspected legacy schema.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.products WHERE "sellerId" IS NOT NULL) THEN
    RAISE EXCEPTION 'public.products contains seller references; reconcile them before applying this repair.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_type AS type
    JOIN pg_namespace AS namespace ON namespace.oid = type.typnamespace
    WHERE namespace.nspname = 'public'
      AND type.typname IN ('SellerStatus', 'PropertyStatus', 'PropertyType', 'BookingRequestStatus')
  ) THEN
    RAISE EXCEPTION 'A seller/property enum already exists; inspect it before applying this repair.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.products'::regclass
      AND conname = 'products_sellerId_fkey'
  ) THEN
    RAISE EXCEPTION 'public.products already has products_sellerId_fkey; inspect it before applying this repair.';
  END IF;
END
$repair$;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE public."SellerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');
CREATE TYPE public."PropertyStatus" AS ENUM ('AVAILABLE', 'SOLD', 'RENTED');
CREATE TYPE public."PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'LAND');
CREATE TYPE public."BookingRequestStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

CREATE TABLE public.sellers (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "storeName" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "logo" TEXT,
  "contactName" TEXT,
  "contactEmail" TEXT,
  "phoneNumber" TEXT,
  "residence" TEXT,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "businessType" TEXT,
  "sellingCategories" TEXT,
  "intendedProducts" TEXT,
  "identityDocumentFileId" TEXT,
  "facebookUrl" TEXT,
  "youtubeUrl" TEXT,
  "twitterUrl" TEXT,
  "status" public."SellerStatus" NOT NULL DEFAULT 'PENDING',
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sellers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sellers_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES public.users("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.stores (
  "id" TEXT NOT NULL,
  "vendorId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "logoUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "stores_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "stores_vendorId_fkey"
    FOREIGN KEY ("vendorId") REFERENCES public.users("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.properties (
  "id" TEXT NOT NULL,
  "title" VARCHAR(180) NOT NULL,
  "description" TEXT,
  "price" DECIMAL(16, 2) NOT NULL,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
  "location" VARCHAR(240) NOT NULL,
  "country" VARCHAR(100),
  "city" VARCHAR(120),
  "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "status" public."PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
  "type" public."PropertyType" NOT NULL DEFAULT 'APARTMENT',
  "attributes" JSONB NOT NULL DEFAULT '{}'::JSONB,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  "storeId" TEXT NOT NULL,
  CONSTRAINT "properties_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "properties_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES public.users("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "properties_storeId_fkey"
    FOREIGN KEY ("storeId") REFERENCES public.stores("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.property_wishlist (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "property_wishlist_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "property_wishlist_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES public.users("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "property_wishlist_propertyId_fkey"
    FOREIGN KEY ("propertyId") REFERENCES public.properties("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.booking_requests (
  "id" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "quotedPrice" DECIMAL(16, 2) NOT NULL,
  "feeAmount" DECIMAL(10, 2) NOT NULL,
  "feeCurrency" VARCHAR(3) NOT NULL DEFAULT 'USD',
  "status" public."BookingRequestStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "booking_requests_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES public.users("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "booking_requests_propertyId_fkey"
    FOREIGN KEY ("propertyId") REFERENCES public.properties("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "sellers_userId_key" ON public.sellers("userId");
CREATE UNIQUE INDEX "sellers_slug_key" ON public.sellers("slug");
CREATE INDEX "sellers_status_idx" ON public.sellers("status");
CREATE INDEX "sellers_isVerified_idx" ON public.sellers("isVerified");
CREATE INDEX "sellers_storeName_idx" ON public.sellers("storeName");
CREATE UNIQUE INDEX "stores_vendorId_key" ON public.stores("vendorId");
CREATE UNIQUE INDEX "stores_slug_key" ON public.stores("slug");
CREATE INDEX "stores_name_idx" ON public.stores("name");

CREATE INDEX "properties_status_createdAt_id_idx" ON public.properties("status", "createdAt", "id");
CREATE INDEX "properties_type_status_createdAt_id_idx" ON public.properties("type", "status", "createdAt", "id");
CREATE INDEX "properties_country_status_city_createdAt_idx" ON public.properties("country", "status", "city", "createdAt");
CREATE INDEX "properties_city_status_createdAt_idx" ON public.properties("city", "status", "createdAt");
CREATE INDEX "properties_price_idx" ON public.properties("price");
CREATE INDEX "properties_storeId_createdAt_idx" ON public.properties("storeId", "createdAt");
CREATE INDEX "properties_userId_status_createdAt_idx" ON public.properties("userId", "status", "createdAt");
CREATE INDEX "properties_isPublished_status_createdAt_idx" ON public.properties("isPublished", "status", "createdAt");
CREATE INDEX "properties_title_trgm_idx" ON public.properties USING GIN ("title" gin_trgm_ops);
CREATE INDEX "properties_description_trgm_idx" ON public.properties USING GIN ("description" gin_trgm_ops);
CREATE INDEX "properties_location_trgm_idx" ON public.properties USING GIN ("location" gin_trgm_ops);
CREATE INDEX "properties_attributes_gin_idx" ON public.properties USING GIN ("attributes" jsonb_path_ops);

CREATE UNIQUE INDEX "property_wishlist_userId_propertyId_key" ON public.property_wishlist("userId", "propertyId");
CREATE INDEX "property_wishlist_userId_createdAt_idx" ON public.property_wishlist("userId", "createdAt");
CREATE INDEX "property_wishlist_propertyId_idx" ON public.property_wishlist("propertyId");

CREATE UNIQUE INDEX "booking_requests_idempotencyKey_key" ON public.booking_requests("idempotencyKey");
CREATE INDEX "booking_requests_userId_status_createdAt_idx" ON public.booking_requests("userId", "status", "createdAt");
CREATE INDEX "booking_requests_propertyId_status_createdAt_idx" ON public.booking_requests("propertyId", "status", "createdAt");

ALTER TABLE public.products
  ADD CONSTRAINT "products_sellerId_fkey"
    FOREIGN KEY ("sellerId") REFERENCES public.sellers("id") ON DELETE SET NULL ON UPDATE CASCADE;

DO $repair$
BEGIN
  IF (SELECT COUNT(*) FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('sellers', 'stores', 'properties', 'property_wishlist', 'booking_requests')) <> 5 THEN
    RAISE EXCEPTION 'Seller/property table validation failed; transaction will be rolled back.';
  END IF;

  IF (SELECT COUNT(*) FROM public.sellers) <> 0
    OR (SELECT COUNT(*) FROM public.stores) <> 0
    OR (SELECT COUNT(*) FROM public.properties) <> 0 THEN
    RAISE EXCEPTION 'New seller/property tables were unexpectedly populated.';
  END IF;
END
$repair$;

COMMIT;
