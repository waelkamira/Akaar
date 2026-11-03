-- Normalize order persistence for a multi-item marketplace.
-- Refuse to discard legacy order and inventory rows; unknown legacy status strings
-- intentionally fail the enum cast rather than being silently rewritten.

DO $migration$
BEGIN
  IF EXISTS (SELECT 1 FROM "Order") THEN
    RAISE EXCEPTION 'Order contains rows; migrate legacy order items before continuing.';
  END IF;
  IF EXISTS (SELECT 1 FROM "Inventory") THEN
    RAISE EXCEPTION 'Inventory contains rows; migrate inventory into products before continuing.';
  END IF;
END
$migration$;

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
