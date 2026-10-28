CREATE TYPE "ProductApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "VendorOrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

ALTER TABLE "products"
  ADD COLUMN "approvalStatus" "ProductApprovalStatus" NOT NULL DEFAULT 'APPROVED';

CREATE INDEX "products_approvalStatus_isActive_createdAt_idx"
  ON "products"("approvalStatus", "isActive", "createdAt");
CREATE INDEX "products_approvalStatus_isDeleted_createdAt_idx"
  ON "products"("approvalStatus", "isDeleted", "createdAt");
CREATE INDEX "products_sellerId_approvalStatus_isActive_createdAt_idx"
  ON "products"("sellerId", "approvalStatus", "isActive", "createdAt");

ALTER TABLE "OrderItem"
  ADD COLUMN "vendorOrderId" TEXT;

ALTER TABLE "Payment"
  ADD COLUMN "paidAt" TIMESTAMP(3);

ALTER TABLE "Order"
  ADD COLUMN "customerName" TEXT,
  ADD COLUMN "phoneNumber" TEXT,
  ADD COLUMN "shippingCity" TEXT,
  ADD COLUMN "shippingAddress" TEXT;

CREATE INDEX "OrderItem_vendorOrderId_idx" ON "OrderItem"("vendorOrderId");
CREATE INDEX "Payment_status_paidAt_idx" ON "Payment"("status", "paidAt");

CREATE TABLE "VendorOrder" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "sellerId" TEXT NOT NULL,
  "status" "VendorOrderStatus" NOT NULL DEFAULT 'PENDING',
  "trackingNumber" TEXT,
  "shippedAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VendorOrder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VendorOrder_orderId_sellerId_key"
  ON "VendorOrder"("orderId", "sellerId");
CREATE INDEX "VendorOrder_sellerId_status_createdAt_idx"
  ON "VendorOrder"("sellerId", "status", "createdAt");
CREATE INDEX "VendorOrder_orderId_idx" ON "VendorOrder"("orderId");

ALTER TABLE "VendorOrder"
  ADD CONSTRAINT "VendorOrder_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VendorOrder"
  ADD CONSTRAINT "VendorOrder_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "sellers"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_vendorOrderId_fkey"
  FOREIGN KEY ("vendorOrderId") REFERENCES "VendorOrder"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "marketplace_settings" (
  "key" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "marketplace_settings_pkey" PRIMARY KEY ("key")
);

UPDATE "products" AS product
SET "sellerId" = seller."id"
FROM "sellers" AS seller
WHERE product."sellerId" IS NULL AND product."userId" = seller."userId";
