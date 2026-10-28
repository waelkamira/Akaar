-- Normalize order persistence for a multi-item marketplace.
-- The owner confirmed there is no production database; this migration is part of
-- the greenfield schema setup. Unknown legacy status strings intentionally fail
-- the enum cast rather than being silently rewritten.

DROP INDEX "Order_fulfillmentStatus_idx";
DROP INDEX "Order_productId_idx";

ALTER TABLE "Order"
  DROP CONSTRAINT "Order_productId_fkey",
  DROP COLUMN "productId",
  DROP COLUMN "quantity",
  DROP COLUMN "fulfillmentStatus",
  ALTER COLUMN "status" TYPE "OrderStatus" USING UPPER("status")::"OrderStatus";

ALTER TABLE "Payment"
  ALTER COLUMN "status" TYPE "PaymentStatus" USING UPPER("status")::"PaymentStatus";

-- Product.stockQuantity is the single inventory source of truth in the current app.
-- The separate Inventory table had no application read/write path and duplicated stock.
DROP TABLE "Inventory";
