CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'SOLD', 'RENTED');
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'LAND');

CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(16,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "location" VARCHAR(240) NOT NULL,
    "country" VARCHAR(100),
    "city" VARCHAR(120),
    "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "type" "PropertyType" NOT NULL DEFAULT 'APARTMENT',
    "attributes" JSONB NOT NULL DEFAULT '{}'::JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "property_wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "property_wishlist_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "stores_vendorId_key" ON "stores"("vendorId");
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");
CREATE INDEX "stores_name_idx" ON "stores"("name");

CREATE INDEX "properties_status_createdAt_id_idx" ON "properties"("status", "createdAt", "id");
CREATE INDEX "properties_type_status_createdAt_id_idx" ON "properties"("type", "status", "createdAt", "id");
CREATE INDEX "properties_country_status_city_createdAt_idx" ON "properties"("country", "status", "city", "createdAt");
CREATE INDEX "properties_city_status_createdAt_idx" ON "properties"("city", "status", "createdAt");
CREATE INDEX "properties_price_idx" ON "properties"("price");
CREATE INDEX "properties_storeId_createdAt_idx" ON "properties"("storeId", "createdAt");
CREATE INDEX "properties_userId_status_createdAt_idx" ON "properties"("userId", "status", "createdAt");
CREATE INDEX "properties_isPublished_status_createdAt_idx" ON "properties"("isPublished", "status", "createdAt");
CREATE INDEX "properties_title_trgm_idx" ON "properties" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "properties_description_trgm_idx" ON "properties" USING GIN ("description" gin_trgm_ops);
CREATE INDEX "properties_location_trgm_idx" ON "properties" USING GIN ("location" gin_trgm_ops);
CREATE INDEX "properties_attributes_gin_idx" ON "properties" USING GIN ("attributes" jsonb_path_ops);

CREATE UNIQUE INDEX "property_wishlist_userId_propertyId_key" ON "property_wishlist"("userId", "propertyId");
CREATE INDEX "property_wishlist_userId_createdAt_idx" ON "property_wishlist"("userId", "createdAt");
CREATE INDEX "property_wishlist_propertyId_idx" ON "property_wishlist"("propertyId");

ALTER TABLE "stores"
ADD CONSTRAINT "stores_vendorId_fkey"
FOREIGN KEY ("vendorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "properties"
ADD CONSTRAINT "properties_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "properties"
ADD CONSTRAINT "properties_storeId_fkey"
FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "property_wishlist"
ADD CONSTRAINT "property_wishlist_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "property_wishlist"
ADD CONSTRAINT "property_wishlist_propertyId_fkey"
FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
