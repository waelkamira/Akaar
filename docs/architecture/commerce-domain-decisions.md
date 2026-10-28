# Commerce domain decisions

This document records decisions for the greenfield Prisma schema. There is no production database, so the canonical schema and migrations can be corrected before first deployment.

## Orders are multi-item

- `Order` represents the purchase as a whole: customer, total, status, discount, shipping method, and timestamps.
- `OrderItem` is the only source of product-level order lines. Each item stores the product reference, quantity, unit price, and line total.
- Do not keep a second `Order.productId` or `Order.quantity`; those fields force an order to look like a single-product purchase and can disagree with `OrderItem[]`.
- The order-history API and page read products only through `items`.
- Checkout must create the order and its items transactionally, snapshot unit prices, validate positive quantities, and atomically reserve/decrement stock. The checkout writer is not implemented yet; this change does not claim checkout is complete.

## Status source of truth

- `Order.status` uses the existing `OrderStatus` enum.
- `Payment.status` uses the existing `PaymentStatus` enum.
- The duplicate `Order.fulfillmentStatus` field is removed. It created two order status values without an implemented transition policy.
- Before implementing checkout/payment, define allowed state transitions in application code and ensure payment state cannot be inferred solely from order state.

## Inventory source of truth

- `Product.stockQuantity` is the current application source of truth for on-hand stock; product create/update and storefront code already use this field.
- The separate `Inventory` model had no application read/write path and duplicated stock quantity, so it is removed for now.
- If multi-warehouse or reservation-ledger inventory is later required, introduce a deliberate inventory service/model and migrate all stock reads/writes together rather than keeping two independent quantities.

## Money and currency — still an explicit pre-checkout decision

The current schema stores most prices as integers but stores shipping costs and return refund amounts as floating-point values. This needs to be resolved before checkout/payment is implemented. Decide the supported ISO 4217 currencies and whether amounts are stored in minor units (recommended) or decimal amounts, then apply the same precision and currency policy to products, order totals, line items, payment amounts, shipping, refunds, and price history. This PR intentionally does not guess the marketplace's currency policy or silently reinterpret existing price values.
