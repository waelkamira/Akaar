# Commerce domain model review

Status: **design review only; no schema changes made in this document**.

This review is based on the current canonical `prisma/schema.prisma` and the currently inspected order-history API. The application is still under development and has no production database, so the schema can be redesigned; application/API consumers and migration tests must still be updated together.

## Decisions required before implementing checkout and payments

### 1. One order header, multiple order lines

Current `Order` has `productId` and `quantity` while also relating to `OrderItem[]`. This models a single-product order and a multi-product order at the same time. `GET /api/orders` currently returns both shapes.

**Recommended target:** treat `Order` as the checkout header and `OrderItem[]` as the sole source of purchased products and quantities. The header should own customer, overall order state, totals, currency, shipping selection/address snapshot, and timestamps. Each order line should store product relation plus immutable purchase-time snapshots (at least product title/SKU where applicable, unit price, quantity, line total, and seller identity for a multi-seller marketplace). Remove header `productId`/`quantity` only after all UI/API consumers have switched to the line-item contract.

### 2. Separate order, fulfillment, and payment state machines

The current schema declares `OrderStatus` and `PaymentStatus` enums, but `Order.status` and `Payment.status` are strings, while `Order.fulfillmentStatus` uses `OrderStatus`. That makes the enum name misleading and permits arbitrary status strings in the actual status fields.

**Recommended target:**
- Define an `OrderStatus` enum for the commercial order lifecycle (for example, pending payment, confirmed, cancelled, completed, refunded).
- Define a separate `FulfillmentStatus` enum for unfulfilled, processing, partially shipped, shipped, delivered, and returned states, if those transitions are supported.
- Use `PaymentStatus` for payment attempts, and allow multiple payment attempts per order without confusing a failed attempt with a failed order.
- Document permitted transitions and enforce them in service functions, not only in UI controls.

Finalize the actual enum values against the planned payment providers and returns workflow before writing the migration.

### 3. Specify money and currency semantics

Current prices and order totals use integer fields, while `ShippingMethod.cost` and `Return.refundAmount` use floating point. The schema does not clearly define whether integers represent whole currency units or minor units, and it does not consistently record currency.

**Recommended target:** choose one explicit policy before checkout is implemented. For a multi-currency marketplace, store an ISO 4217 currency code and amounts in integer minor units consistently across product price, order header, order items, payment attempts, shipping, refunds, and price history. Add database constraints for non-negative amounts where appropriate. Update formatters and tests to use currency-aware formatting; do not silently reinterpret existing values when changing units.

### 4. Choose one inventory source of truth

`Product.stockQuantity` and the one-to-one `Inventory.quantity` both appear to represent on-hand stock. Two independently writable fields can diverge.

**Recommended target:** if the initial product model has one stock pool, keep one canonical quantity and remove the duplicate model/field. If warehouse/location inventory is a near-term requirement, make inventory records authoritative and have all availability and checkout operations use transactional inventory updates; do not also maintain a separately writable stock counter without a defined synchronization mechanism. Add concurrency tests for two checkouts competing for the last unit.

### 5. Preserve historical order facts

A relation to `Product` does not preserve the product title, seller name, or price as they were at purchase time. A product can change after an order is placed. Order lines should therefore snapshot the relevant display and financial facts; historical order totals must not be recomputed from the current product record.

### 6. Align product media representations

The schema has both `Product.images String[]` and a normalized `ProductImage[]` relation. Choose which is canonical for writes. If normalized media is selected, define primary-image and ordering invariants and keep the array only as a temporary compatibility representation, then remove it after all readers are migrated. If the array is selected for the first release, avoid writing two sources of truth.

## Implementation sequence

1. Search all API routes, server actions, UI components, and tests for order, payment, inventory, and media field usage.
2. Agree the money/currency contract and order state transitions.
3. Update the canonical Prisma schema and generate the initial migration for the greenfield project.
4. Update all consumers in the same change; do not leave `GET /api/orders` returning two competing representations.
5. Test migration deployment on an empty PostgreSQL database, Prisma Client generation, checkout/order-history integration, currency formatting, stock concurrency, and CI build.
6. Keep payment-provider credentials and live payment processing out of CI; use mocked provider adapters for unit/integration tests.

## Scope note

This review does not claim that checkout, payments, inventory reservation, refunds, or production deployment have been implemented or tested. It records design decisions required before implementing them.
