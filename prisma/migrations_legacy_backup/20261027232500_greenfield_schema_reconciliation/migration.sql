-- Reconcile the legacy development schema with the canonical Prisma schema.
-- Refuse to discard legacy rows from tables whose representation changes.

DO $migration$
BEGIN
  IF EXISTS (SELECT 1 FROM "Category") THEN
    RAISE EXCEPTION 'Category contains rows; migrate category IDs explicitly before continuing.';
  END IF;
  IF EXISTS (SELECT 1 FROM "ProductImage") THEN
    RAISE EXCEPTION 'ProductImage contains rows; migrate legacy image columns before continuing.';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM (
      SELECT MIN("categoryName") AS name
      FROM "products"
      GROUP BY "categoryId"
    ) AS product_categories
    GROUP BY name
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Product category names are not unique; reconcile categories before continuing.';
  END IF;
END
$migration$;

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TYPE "UserRole" AS ENUM ('GUEST', 'CUSTOMER', 'SELLER', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

ALTER TABLE "Order" DROP CONSTRAINT "Order_productId_fkey";
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";
ALTER TABLE "products" DROP CONSTRAINT "products_userId_fkey";

DROP INDEX "City_name_key";
DROP INDEX "ProductTranslation_description_idx";

ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey";
ALTER TABLE "Category"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "parentId" INTEGER,
  ADD COLUMN "slug" TEXT NOT NULL,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL,
  DROP COLUMN "id",
  ADD COLUMN "id" INTEGER NOT NULL,
  ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
SELECT
  "categoryId",
  MIN("categoryName"),
  'category-' || "categoryId"::TEXT,
  CURRENT_TIMESTAMP
FROM "products"
GROUP BY "categoryId";

ALTER TABLE "Order"
  ADD COLUMN "fulfillmentStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING';

ALTER TABLE "ProductImage"
  DROP COLUMN "image1",
  DROP COLUMN "image2",
  DROP COLUMN "image3",
  DROP COLUMN "image4",
  DROP COLUMN "image5",
  ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "url" TEXT NOT NULL;

ALTER TABLE "products"
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "salesCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "sellerId" TEXT;

ALTER TABLE "users"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "emailVerified" TIMESTAMP(3),
  ADD COLUMN "lastLoginAt" TIMESTAMP(3),
  ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
  ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "users" ALTER COLUMN "updatedAt" DROP DEFAULT;

CREATE TABLE "sellers" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "storeName" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "logo" TEXT,
  "status" "SellerStatus" NOT NULL DEFAULT 'PENDING',
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "guest_sessions" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "guest_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Cart" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "guestSessionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CartItem" (
  "id" TEXT NOT NULL,
  "cartId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "totalPrice" INTEGER NOT NULL,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PasswordResetToken" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "sellers_userId_key" ON "sellers"("userId");
CREATE UNIQUE INDEX "sellers_slug_key" ON "sellers"("slug");
CREATE INDEX "sellers_status_idx" ON "sellers"("status");
CREATE INDEX "sellers_isVerified_idx" ON "sellers"("isVerified");
CREATE INDEX "sellers_storeName_idx" ON "sellers"("storeName");
CREATE UNIQUE INDEX "guest_sessions_token_key" ON "guest_sessions"("token");
CREATE INDEX "guest_sessions_expiresAt_idx" ON "guest_sessions"("expiresAt");
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");
CREATE UNIQUE INDEX "Cart_guestSessionId_key" ON "Cart"("guestSessionId");
CREATE INDEX "Cart_updatedAt_idx" ON "Cart"("updatedAt");
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");
CREATE INDEX "CartItem_productId_idx" ON "CartItem"("productId");
CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON "CartItem"("cartId", "productId");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE INDEX "VerificationToken_expires_idx" ON "VerificationToken"("expires");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
CREATE INDEX "Category_isActive_idx" ON "Category"("isActive");
CREATE INDEX "City_countryId_idx" ON "City"("countryId");
CREATE UNIQUE INDEX "City_name_countryId_key" ON "City"("name", "countryId");
CREATE INDEX "Discount_productId_idx" ON "Discount"("productId");
CREATE INDEX "Discount_validFrom_validTo_idx" ON "Discount"("validFrom", "validTo");
CREATE INDEX "Favorite_userId_isDeleted_idx" ON "Favorite"("userId", "isDeleted");
CREATE INDEX "Favorite_productId_idx" ON "Favorite"("productId");
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");
CREATE INDEX "Inventory_isAvailable_idx" ON "Inventory"("isAvailable");
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");
CREATE INDEX "Order_fulfillmentStatus_idx" ON "Order"("fulfillmentStatus");
CREATE INDEX "Order_productId_idx" ON "Order"("productId");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_discountId_idx" ON "Order"("discountId");
CREATE INDEX "Order_shippingMethodId_idx" ON "Order"("shippingMethodId");
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");
CREATE INDEX "ProductPriceHistory_productId_changedAt_idx" ON "ProductPriceHistory"("productId", "changedAt");
CREATE INDEX "ProductTranslation_productId_idx" ON "ProductTranslation"("productId");
CREATE INDEX "Recommendation_userId_score_idx" ON "Recommendation"("userId", "score");
CREATE INDEX "Recommendation_productId_idx" ON "Recommendation"("productId");
CREATE INDEX "Report_userId_idx" ON "Report"("userId");
CREATE INDEX "Report_type_idx" ON "Report"("type");
CREATE INDEX "Return_orderId_idx" ON "Return"("orderId");
CREATE INDEX "Review_productId_rating_idx" ON "Review"("productId", "rating");
CREATE INDEX "Review_userId_idx" ON "Review"("userId");
CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");
CREATE INDEX "Shipping_orderId_idx" ON "Shipping"("orderId");
CREATE INDEX "Shipping_trackingNumber_idx" ON "Shipping"("trackingNumber");
CREATE INDEX "ShippingMethod_name_idx" ON "ShippingMethod"("name");
CREATE INDEX "Supplier_countryId_idx" ON "Supplier"("countryId");
CREATE INDEX "Supplier_cityId_idx" ON "Supplier"("cityId");
CREATE INDEX "products_sellerId_idx" ON "products"("sellerId");
CREATE INDEX "products_salesCount_idx" ON "products"("salesCount");
CREATE INDEX "products_isActive_idx" ON "products"("isActive");
CREATE INDEX "products_title_btree_idx" ON "products"("title");
CREATE INDEX "products_title_trgm_idx" ON "products" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "products_category_name_trgm_idx" ON "products" USING GIN ("categoryName" gin_trgm_ops);
CREATE INDEX "products_user_name_trgm_idx" ON "products" USING GIN ("userName" gin_trgm_ops);
CREATE INDEX "products_description_trgm_idx" ON "products" USING GIN ("description" gin_trgm_ops);
CREATE INDEX "products_categoryId_basePrice_idx" ON "products"("categoryId", "basePrice");
CREATE INDEX "products_categoryId_createdAt_idx" ON "products"("categoryId", "createdAt");
CREATE INDEX "products_isDeleted_isActive_createdAt_idx" ON "products"("isDeleted", "isActive", "createdAt");
CREATE INDEX "products_isDeleted_isActive_basePrice_idx" ON "products"("isDeleted", "isActive", "basePrice");
CREATE INDEX "products_isDeleted_isActive_salesCount_idx" ON "products"("isDeleted", "isActive", "salesCount");
CREATE INDEX "products_categoryId_isDeleted_isActive_idx" ON "products"("categoryId", "isDeleted", "isActive");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

ALTER TABLE "sellers" ADD CONSTRAINT "sellers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
