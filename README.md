# Akaar Marketplace Platform Roadmap

This repository is the foundation for a multi-seller marketplace and e-commerce platform. The project is large enough that it must be executed in a strict dependency order. Building features out of sequence will create rework, broken data relationships, and unstable integrations.

This README is the execution plan for the project. It is intentionally structured as a phased roadmap so that each stage is completed, validated, and only then used by the next stage.

## Project execution principles

1. Build in dependency order, not by feature popularity.
2. Treat Prisma as the source of truth for the operational schema.
3. Never bypass the repository/service/validation layers.
4. Do not expose business logic directly from UI code.
5. Validate each stage with real database operations, not mock success flows.
6. Every stage must pass both isolated tests and end-to-end workflow validation.
7. No phase is complete until it can be used by the next phase without manual fixes.

## Architecture foundation

Before building pages or product flows, the platform must be structured correctly.

### Required system structure
- app/: routes and screens
- components/: reusable UI atoms and layouts
- features/: feature-specific modules and state
- lib/: shared utilities and platform services
- server/: server actions, APIs, and server-side logic
- prisma/: schema, migrations, and database setup
- hooks/: React hooks and custom logic
- types/: shared contracts and DTOs
- tests/: automated test coverage
- config/: environment and platform configuration
- docs/: architecture and decision records

### Required backend architecture
- Single Prisma client instance
- Repository layer for database access
- Service layer for business logic
- Validation layer for input and domain rules
- Authorization layer for permissions and policy enforcement
- Unified error handling
- Transaction support for multi-step workflows
- Idempotency protections for financial, order, and inventory operations

### Critical constraints
- UI components must not directly query Prisma.
- Never treat `schema.prisma` as disposable or replaceable without review.
- The project must use the final merged schema after reviewing global marketplace requirements.
- The old category ID design and legacy database assumptions must be reviewed before migration.
- Do not delete production data or run destructive database commands against real data.
- Use an independent test database before any schema or migration work.

---

## Phase sequence overview

The roadmap below is intentionally sequential. The first phase creates the stable foundation; each later phase depends on earlier ones.

| Phase | Name | Depends on | Why it matters |
|---|---|---|---|
| 0 | Architecture and project restructuring | None | Prevents future rework |
| 1 | Authentication and authorization | 0 | Secures all user and seller flows |
| 2 | Globalization and localization | 1 | Makes commerce usable across markets |
| 3 | Addresses | 1,2 | Needed for shipping and checkout |
| 4 | Sellers and marketplace onboarding | 1,2,3 | Turns the platform into a marketplace |
| 5 | Catalog and products | 4 | Powers discovery and storefront |
| 6 | Search and filtering | 5 | Makes products discoverable |
| 7 | Storefront UX | 5,6 | Delivers the customer buying experience |
| 8 | Cart and guest checkout | 3,5,7 | Starts the buying flow |
| 9 | Orders | 3,5,8 | Creates the transactional core |
| 10 | Payments | 9 | Confirms money movement |
| 11 | Inventory and warehouses | 5,9 | Ensures stock accuracy |
| 12 | Procurement | 11 | Restocks inventory |
| 13 | Accounting and commissions | 9,10,11 | Handles settlement and profit flows |
| 14 | Taxes and customs | 9,13 | Handles compliance |
| 15 | Shipping and tracking | 9,11 | Enables fulfillment |
| 16 | Returns | 9,10,15 | Handles post-purchase flow |
| 17 | Promotions and loyalty | 5,9 | Supports conversion and retention |
| 18 | Reviews and support | 5,9,17 | Improves trust and service |
| 19 | Invoices | 9,10,13 | Keeps transactional history |
| 20 | Notifications, CMS, and settings | 1,9,19 | Supports operations and compliance |
| 21 | Integrations and webhooks | 9,10,20 | Connects external systems |
| 22 | Background jobs | 9,20,21 | Makes platform reliable at scale |
| 23 | Analytics and reports | 9,10,11,13 | Gives operational visibility |
| 24 | Real estate module | Independent | Optional specialized business line |

## Roadmap execution status

Only mark a phase complete after its acceptance criteria and verification pass. Record completed phases using the exact form `<number> done`.

- **0 done** — Added repository boundaries for server-rendered page data; ESLint prevents App Router UI, components, and features from importing Prisma directly. The canonical schema validates and generates Prisma Client; the isolated database migration is up to date; seed reruns preserve fixture counts; production build passes; lint exits 0 (84 existing warnings); unit tests pass (147 passed, 3 skipped). Migration safety documentation and existing error boundaries are in place.
- `1` — in progress (depends on 0); credentials sign-in now records successful and failed login attempts and updates the successful-login timestamp. Verification, recovery, 2FA, revocable sessions, consent, and scoped staff permissions remain incomplete.
- `2` — pending (depends on 1)
- `3` — pending (depends on 1 and 2)
- `4` — pending (depends on 1, 2, and 3)
- `5` — pending (depends on 4)
- `6` — pending (depends on 5)
- `7` — pending (depends on 5 and 6)
- `8` — pending (depends on 3, 5, and 7)
- `9` — pending (depends on 3, 5, and 8)
- `10` — pending (depends on 9)
- `11` — pending (depends on 5 and 9)
- `12` — pending (depends on 11)
- `13` — pending (depends on 9, 10, and 11)
- `14` — pending (depends on 9 and 13)
- `15` — pending (depends on 9 and 11)
- `16` — pending (depends on 9, 10, and 15)
- `17` — pending (depends on 5 and 9)
- `18` — pending (depends on 5, 9, and 17)
- `19` — pending (depends on 9, 10, and 13)
- `20` — pending (depends on 1, 9, and 19)
- `21` — pending (depends on 9, 10, and 20)
- `22` — pending (depends on 9, 20, and 21)
- `23` — pending (depends on 9, 10, 11, and 13)
- `24` — pending; independent optional module

---

## Phase 0: Architecture and project restructuring

### Goal
Normalize the codebase and make the system maintainable before building core product flows.

### Deliverables
- Stable project folder structure
- Service/repository separation
- Error boundaries and consistent error responses
- Prisma schema review and merge plan
- Migration strategy and test database setup
- Clear ownership boundaries between UI and business logic

### Acceptance criteria
- All new features follow the same folder and layer conventions.
- UI code does not access Prisma or domain services directly.
- The schema is reviewed before migration changes are made.
- The project has a clean path to production-safe schema evolution.

### Dependencies
- None

### Enables
- Authentication, catalog, orders, sellers, and every downstream system

---

## Phase 1: Authentication and authorization

### Goal
Create a secure identity and access-control platform for users, admins, sellers, staff, and buyers.

### Prisma models
- User
- UserSession
- OAuthAccount
- Role
- Permission
- RolePermission
- UserRoleAssignment
- TwoFactorAuthentication
- PasswordResetToken
- VerificationToken
- UserConsent
- LoginAttempt

### Functional scope
1. Login
2. Registration
3. Google Sign-In
4. Email verification
5. Password recovery
6. Password change
7. Two-factor authentication
8. User profile
9. Account settings
10. Session and device management
11. Consent and privacy tools
12. Admin user management
13. Role and permission management

### Requirements
- Hash passwords securely.
- Manage and revoke sessions.
- Enforce permission checks on the server.
- Distinguish platform admin, store manager, staff, and buyer roles.
- Log suspicious login activity.
- Prevent unauthorized API access.
- Support RBAC at platform and seller scopes.

### Acceptance criteria
- Users can sign in and register safely.
- Sessions are revocable and bounded.
- Permissions are enforced in server-side code.
- Role-based access works across both platform and seller contexts.

### Dependencies
- Phase 0

### Enables
- Seller onboarding, checkout, account management, addresses, marketplace operations

---

## Phase 2: Globalization and localization

### Goal
Support a global commerce platform with correct local pricing and region-aware behavior.

### Prisma models
- Currency
- ExchangeRate
- Country
- StateProvince
- City

### Functional scope
1. Currency management
2. Exchange rate management
3. Supported countries list
4. State/province data
5. City data
6. Geolocation-aware country selection
7. Currency selector
8. Display-price conversion
9. Language and timezone settings
10. Number and date formatting

### Requirements
- Multi-currency support
- Decimal-based financial storage
- Preserve exchange rate used at the time of order creation
- Support multiple countries/scopes without hardcoding
- Avoid JavaScript floating-point inaccuracy in financial calculations

### Acceptance criteria
- Product prices are displayed in a consistent local currency.
- Exchange-rate history is preserved for each order.
- Country and language selection work correctly across the platform.

### Dependencies
- Phase 1

### Enables
- Addresses, storefront, checkout, taxes, and order totals

---

## Phase 3: Addresses

### Goal
Support shipping, billing, and regional address data for a global customer base.

### Prisma models
- UserAddress

### Functional scope
- Address book
- Add/edit/delete address
- Default address selection
- Shipping and billing management
- International address handling
- Phone, postal code, and geolocation support

### Acceptance criteria
- Customers can manage addresses reliably.
- Orders can select valid shipping and billing data.
- Address data is consistent across checkout and order history.

### Dependencies
- Phase 1
- Phase 2

### Enables
- Seller onboarding, cart flows, checkout, order creation

---

## Phase 4: Sellers and marketplace onboarding

### Goal
Create the seller ecosystem and administrative marketplace controls.

### Prisma models
- Seller
- SellerVerification
- SellerDocument
- SellerTaxRegistration
- Store
- StoreTranslation
- SellerStaff

### Functional scope
1. Seller homepage
2. Sales analytics
3. Store management
4. Product management
5. Order management
6. Store reviews and customer chats
7. Staff management and permissions
8. KYC and document uploads
9. Tax registrations
10. Earnings, commissions, payouts, and payment methods
11. Financial reports
12. Admin review and approval

### Administrative capabilities
- Review onboarding requests
- Approve or reject sellers
- Suspend stores when needed
- Review verification documents and tax registration
- Manage seller staff access and permissions
- Monitor seller performance

### Acceptance criteria
- Sellers can register, verify, and manage stores.
- Admins can review and approve sellers.
- Store ownership and seller permissions are enforced.

### Dependencies
- Phase 1
- Phase 2
- Phase 3

### Enables
- Catalog management, product listing, seller dashboards, commission logic

---

## Phase 5: Catalog and products

### Goal
Build the product foundation and support multi-variant merchandising.

### Prisma models
- Category
- CategoryTranslation
- Brand
- BrandTranslation
- Product
- ProductCategory
- ProductTranslation
- ProductMedia
- AttributeDefinition
- AttributeTranslation
- ProductAttribute
- ProductAttributeValue
- ProductVariant
- VariantAttribute
- ProductIdentifier
- ProductPrice

### Functional scope
- Category tree management
- Product listing and all-products pages
- Featured, best-selling, new, and discounted products
- Product details and gallery
- Brand and category associations
- Dynamic attributes per category
- SKU, barcode, inventory, and price per variant
- Related and suggested products

### Variant requirements
Each variant must have its own SKU, price, inventory, and attributes.
Examples:
- storage size
- color
- clothing size
- weight or dimension

### Dynamic attribute requirements
- Category-specific attributes should not be hardcoded for every category.
- Example: phones use RAM/storage; clothing uses size/material.
- Link filters to `AttributeDefinition` and `ProductAttributeValue`.

### Acceptance criteria
- Products can be created and managed reliably.
- Variants are tracked and priced independently.
- Dynamic filters work for multiple category types.

### Dependencies
- Phase 4

### Enables
- Search, storefront, cart, checkout, and inventory

---

## Phase 6: Search and filtering

### Goal
Make it easy for users to discover the correct products and sellers.

### Prisma models
- Product
- ProductVariant
- Category
- Brand
- ProductPrice
- ProductAttribute
- SearchSynonym

### Functional scope
- Search bar and suggestions
- History and auto-complete
- Search by name, brand, category, and SKU
- Synonym support and typo tolerance
- Multi-language term handling
- Results page with counting and pagination
- Filters for price, category, brand, rating, discounts, availability, seller, origin, and attributes
- Sorting options: relevance, newest, price, rating, best-selling

### Requirements
- Filters must work together.
- Filter state must be shareable via URL.
- Pagination must preserve state.
- Search and filter logic must work across localized content.

### Acceptance criteria
- Search results are relevant and stable.
- Filter combinations work without state loss.
- Customers can navigate result pages without losing selected criteria.

### Dependencies
- Phase 5

### Enables
- Storefront UX, product discovery, and conversion flows

---

## Phase 7: Storefront UX and homepage

### Goal
Deliver the customer-facing storefront and marketing experience.

### Functional scope
- Announcement bar
- Premium header and navigation
- Logo and brand area
- Country/currency selector
- Search bar
- Account, wishlist, and cart entry points
- Category menu and hero sections
- Featured banners and offers
- Product card layouts and quality imagery
- New arrivals and best sellers
- Daily deals and limited-time campaigns
- Brands and featured stores
- Newsletter and footer sections
- Dedicated pages for all products, categories, brands, stores, offers, and search

### Requirements
- Luxury e-commerce aesthetic
- Mobile-first and desktop-friendly layout
- Arabic/English plus RTL/LTR support
- Unified design system
- Skeleton loading and smooth transitions
- Rebuild the visual structure without losing existing functionality

### Acceptance criteria
- The storefront is polished, responsive, and working across languages.
- Users can navigate the product ecosystem without friction.
- The homepage is connected to real product data, not dummy data.

### Dependencies
- Phase 5
- Phase 6

### Enables
- Cart, checkout, and conversion flows

---

## Phase 8: Cart and guest checkout

### Goal
Allow customers to collect products before purchase and complete a guest checkout where needed.

### Prisma models
- GuestSession
- Cart
- CartItem

### Functional scope
- Cart page and cart drawer
- Add to cart
- Update quantity
- Remove item
- Total calculation
- Guest checkout
- Checkout continuation after login
- Cart merge for authenticated users

### Requirements
- Inventory validation
- Price validation at purchase time
- Prevent duplicate identical cart entries
- Prevent unavailable quantities
- Preserve cart state across devices for authenticated users
- Support multi-vendor carts
- Correct currency handling

### Acceptance criteria
- Customers can add, modify, and proceed with a valid cart.
- Inventory and price safeguards prevent invalid purchases.
- Guest carts merge correctly after login.

### Dependencies
- Phase 3
- Phase 5
- Phase 7

### Enables
- Orders and checkout completion

---

## Phase 9: Checkout and orders

### Goal
Turn a cart into a valid commercial transaction.

### Prisma models
- Order
- OrderAddress
- VendorOrder
- OrderItem
- OrderStatusHistory

### Functional scope
- Checkout page
- Address selection
- Shipping method selection
- Order review
- Confirmation and success page
- Order history and details
- Order tracking
- Cancellation logic when allowed

### Important rules
- Customer checkout from 3 sellers must create one customer order and vendor-specific suborders.
- Product snapshotting is required for price, name, seller, image, and attributes so later modifications do not break historical invoices or records.

### Order statuses
- New
- Accepted
- Processing
- Shipped
- Completed
- Cancelled

### Acceptance criteria
- Orders are created with correct addresses, totals, and seller-level breakdowns.
- Order history and status transitions work reliably.
- Historical order details remain stable even if product information changes.

### Dependencies
- Phase 3
- Phase 5
- Phase 8

### Enables
- Payment, inventory reservation, shipping, commission logic, invoicing

---

## Phase 10: Payments

### Goal
Handle payment processing safely and reliably.

### Prisma models
- PaymentProvider
- Payment
- PaymentAttempt
- Refund
- PaymentReconciliation
- Dispute
- DisputeEvidence

### Functional scope
- Payment methods
- Provider setup
- Payment page
- Payment history
- Failed and pending attempts
- Refund requests and management
- Payment disputes and evidence
- Reconciliation

### Requirements
- Provider-independent adapter pattern
- Support success/failure/pending states
- Verify status using provider webhooks
- Prevent duplicate payments
- Support full/partial refunds
- Log every financial change
- Never mark an order as paid just because a user returned to a success page

### Acceptance criteria
- Payment cannot be falsely marked as successful.
- Refunds and disputes are traceable.
- Provider events are verified, not assumed.

### Dependencies
- Phase 9

### Enables
- Inventory deduction, accounting, payouts, tax finalization, and reconciliation

---

## Phase 11: Inventory and warehouses

### Goal
Ensure product availability and safe stock movement.

### Prisma models
- Warehouse
- Inventory
- InventoryMovement
- InventoryReservation
- StockTransfer
- StockTransferItem

### Functional scope
- Warehouse management
- View inventory by product and variant
- Inventory movement logging
- Reservation and release
- Low-stock alerts
- Stock transfer between warehouses
- Receiving inventory
- Reports

### Requirements
- Increase/decrease stock correctly
- Reserve stock on order
- Release reserved stock on expiration or cancellation
- Deduct on successful sale per policy
- Maintain an audit trail
- Prevent double-selling during concurrent orders

### Acceptance criteria
- Inventory is accurate at all times.
- Orders reserve stock correctly.
- Concurrent sales do not over-deduct inventory.

### Dependencies
- Phase 5
- Phase 9

### Enables
- Procurement, shipping, order completion, and financial reporting

---

## Phase 12: Procurement

### Goal
Replenish inventory via suppliers while keeping auditability.

### Prisma models
- Supplier
- SupplierProduct
- PurchaseOrder
- PurchaseOrderItem
- GoodsReceipt
- GoodsReceiptItem

### Functional scope
- Supplier management
- Purchase order creation
- Goods receipt logging
- Receiving workflows
- Procurement reports

### Requirements
- Received goods must be linked to inventory after verification.
- Every procurement movement must maintain an audit trail.

### Acceptance criteria
- Purchases replenish stock in a controlled and traceable way.
- Procurement actions are linked to warehouse inventory outcomes.

### Dependencies
- Phase 11

### Enables
- Accurate replenishment and operational performance reporting

---

## Phase 13: Accounting and commissions

### Goal
Build the financial backbone for the marketplace.

### Prisma models
- LedgerAccount
- JournalEntry
- JournalLine
- SellerLedgerEntry
- CommissionRule
- CommissionTransaction
- PayoutMethod
- Payout

### Functional scope
- General financial dashboard
- Chart of accounts
- Journal entries and journal lines
- Commission rules and calculations
- Seller payouts and payout requests
- Transaction logs
- Financial reporting

### Requirements
- Total sales, commissions, net profit, balances, and payout states must be calculated from real data.
- Use double-entry accounting.
- Never edit posted entries directly; use reversing entries for corrections.

### Acceptance criteria
- Financial records are consistent.
- Seller commissions are calculated correctly.
- Payouts are linked to real ledger entries and payment history.

### Dependencies
- Phase 9
- Phase 10
- Phase 11

### Enables
- Taxes, payouts, and financial visibility

---

## Phase 14: Taxes and customs

### Goal
Calculate taxes and customs obligations correctly for regional and seller-specific commerce.

### Prisma models
- TaxRegion
- TaxRate
- TaxLine
- CustomsDeclaration
- CustomsDeclarationItem

### Functional scope
- Tax region and tax rate configuration
- Country-specific rules
- Order-level tax calculation
- Tax invoice management
- Customs declaration tracking

### Requirements
- Use taxes based on country, region, product type, and active policy at the time of order creation.
- Do not use a single flat global tax rate.

### Acceptance criteria
- Tax totals are consistent with the order context.
- Customs-related flows are documented and traceable.

### Dependencies
- Phase 9
- Phase 13

### Enables
- Finalized order financial accuracy and compliance

---

## Phase 15: Shipping and tracking

### Goal
Fulfill customer orders across one or many shipments and sellers.

### Prisma models
- ShippingCarrier
- ShippingService
- ShippingZone
- ShippingRate
- Shipment
- Package
- PackageItem
- ShipmentItem
- ShipmentTrackingEvent

### Functional scope
- Carrier and shipping service setup
- Zone and rate calculation
- Create shipment and packages
- Add tracking numbers
- Shipment status updates
- Delivery tracking

### Requirements
- Support split shipments within one order.
- Support orders that include multiple sellers and products.

### Acceptance criteria
- Orders can be shipped in a valid, trackable way.
- Tracking updates are tied to shipments, not guesswork.

### Dependencies
- Phase 9
- Phase 11

### Enables
- Delivery completion, return workflows, and commission finalization

---

## Phase 16: Returns

### Goal
Handle returns and refund workflows correctly and safely.

### Prisma models
- ReturnRequest
- ReturnItem

### Functional scope
- Return request creation
- Reason selection
- Evidence upload
- Return status tracking
- Seller review and admin review
- Return receipt confirmation
- Refund linking

### Requirements
- Validate returned quantity against purchased and previously returned quantities.

### Acceptance criteria
- Returns do not exceed actual orders or prior returns.
- Refunds are linked to valid return data.

### Dependencies
- Phase 9
- Phase 10
- Phase 15

### Enables
- Customer trust, support handling, and financial correction flows

---

## Phase 17: Promotions, coupons, and loyalty

### Goal
Create acquisition and retention mechanics while keeping validation server-side.

### Prisma models
- Promotion
- Coupon
- CouponRedemption
- PromotionProduct
- PromotionCategory
- PromotionSeller
- LoyaltyProgram
- LoyaltyTransaction
- GiftCard
- GiftCardTransaction

### Functional scope
- Offer pages and offer details
- Coupon input
- Gift card flow
- Loyalty programs and points history
- Product/category/seller promotions
- Usage limits

### Requirements
- Validate coupons and discounts on the server.
- Do not trust browser-side discount logic.

### Acceptance criteria
- Discounts do not bypass validation.
- Promotions are correctly attached to products, categories, or sellers.

### Dependencies
- Phase 5
- Phase 9

### Enables
- Conversion optimization and retention programs

---

## Phase 18: Reviews and support

### Goal
Build trust, service, and recommendation systems without mixing support with commerce chat.

### Prisma models
- Review
- ReviewMedia
- StoreReview
- Favorite
- Recommendation
- ProductQuestion
- ProductAnswer
- SupportTicket
- SupportMessage
- StoreConversation
- StoreMessage

### Functional scope
- Wishlist
- Product and store reviews
- Review media
- Q&A
- Product recommendations
- Help center
- User support tickets
- Support messaging
- Customer-seller chat

### Requirements
- Link reviews to actual purchases.
- Prevent duplicate reviews of the same product per schema rules.
- Keep customer-seller conversations separate from platform support tickets.

### Acceptance criteria
- Reviews are valid and connected to genuine purchase history.
- Support and chat flows remain separated and manageable.

### Dependencies
- Phase 5
- Phase 9
- Phase 17

### Enables
- Customer trust, retention, and support operations

---

## Phase 19: Invoices

### Goal
Provide reliable historical financial documents.

### Prisma models
- Invoice
- InvoiceItem
- CreditNote

### Functional scope
- My invoices
- Invoice detail pages
- PDF download
- Order invoices
- Credit notes
- Admin invoice management

### Requirements
- Preserve invoice history exactly.
- Do not mutate historical invoice records when products or sellers change later.

### Acceptance criteria
- Historical invoices remain stable and audit-ready.
- Credit notes and invoice records match real order data.

### Dependencies
- Phase 9
- Phase 10
- Phase 13

### Enables
- Finance operations and customer transparency

---

## Phase 20: Notifications, CMS, and settings

### Goal
Provide operational communication, content management, and platform config.

### Prisma models
- Notification
- AuditLog
- SitePage
- SitePageTranslation
- MarketplaceSetting
- FeatureFlag

### Functional scope
- Notification center
- Order, payment, shipping, and seller notifications
- About us, privacy, terms, and return policy pages
- CMS content management
- Platform settings and feature flags
- Admin audit logs

### Requirements
- Content must be manageable from the admin dashboard.
- Content must support translation.

### Acceptance criteria
- Customers receive relevant notifications.
- Admin settings are configurable and auditable.

### Dependencies
- Phase 1
- Phase 9
- Phase 19

### Enables
- Platform consistency and operational coverage

---

## Phase 21: Integrations and webhooks

### Goal
Connect external systems without exposing secrets or breaking operations.

### Prisma models
- Webhook
- WebhookDelivery
- Integration

### Functional scope
- Integration management
- Keys and credentials setup
- Webhook configuration
- Event selection
- Delivery logs
- Retry logic
- Signature verification
- Secret protection

### Requirements
- Never store integration secrets in plaintext.
- Never send secrets to the frontend.
- Verify webhook signatures before processing.

### Acceptance criteria
- Third-party integrations work securely and consistently.
- Failed external deliveries are traceable and retryable.

### Dependencies
- Phase 9
- Phase 10
- Phase 20

### Enables
- Reliable ecosystem integrations and scalable automation

---

## Phase 22: Background jobs

### Goal
Scale operations with reliable asynchronous processing.

### Prisma models
- OutboxEvent
- BackgroundJob

### Functional scope
- Background email sending
- Webhook processing
- Order status changes
- Inventory reservation expiration
- Notification dispatch
- Integration sync tasks
- Retry failed jobs

### Requirements
- Use transactional outbox patterns.
- Ensure events tied to a database transaction are not lost.
- Prevent duplicate event execution.

### Acceptance criteria
- Background jobs complete reliably.
- Event-driven tasks survive transaction boundaries.

### Dependencies
- Phase 9
- Phase 20
- Phase 21

### Enables
- Reliable platform operations at scale

---

## Phase 23: Analytics and reports

### Goal
Provide a trustworthy operational and financial view of the business.

### Prisma models
- Report
- DailySiteVisit
- SearchSynonym
- NewsletterSubscriber

### Functional scope
- Sales and order analytics
- AOV, revenue, seller performance, and category performance
- Search metrics
- Site visits
- Newsletter activity and subscriber management
- Reporting export

### Requirements
- Reports must use real data.
- No hardcoded or dummy values in production.

### Acceptance criteria
- Business reports accurately reflect real platform operations.
- Leaders can track growth and operational health from the system itself.

### Dependencies
- Phase 9
- Phase 10
- Phase 11
- Phase 13

### Enables
- Operational decision-making and performance tuning

---

## Phase 24: Real estate module

### Goal
If real estate remains in scope, treat it as a separate module rather than a core e-commerce flow.

### Prisma models
- Property
- PropertyMedia
- PropertyTranslation
- PropertyWishlist
- BookingRequest

### Functional scope
- Listings
- Details
- Images
- Categories
- Price and location search
- Wishlist
- Booking requests
- Seller property management
- Admin property management

### Requirements
- Keep it isolated from the commerce loop.
- Avoid entangling it with orders, inventory, cart, or marketplace flows unless business logic explicitly requires it.

### Acceptance criteria
- Real estate functionality can run independently without destabilizing the commerce platform.

### Dependencies
- Independent module

---

## Critical conflict resolution and migration discipline

The README calls out a critical conflict that must be resolved before execution:

- The global schema uses `UUID` for `Category.id`.
- The legacy project used numeric category IDs and other schema assumptions.
- These differences must be reviewed before migration.

### Mandatory rules
1. Treat `prisma/schema.prisma` as the final operational schema only after reviewing the merged global schema.
2. Do not use an alternate root schema file as the live source of truth.
3. Do not replace old category IDs or other legacy identifiers without database and UI dependency review.
4. Do not run destructive commands against the real database.
5. Use a dedicated test database before schema or migration work.
6. Prepare sequential, reviewable migrations.
7. Confirm every relation and foreign key matches the application code.

---

## Definition of done

A phase is not complete because pages exist. A phase is complete only when all of the following are true:

- All pages function without errors.
- All buttons trigger real working actions.
- All forms validate and persist data properly.
- All APIs work as intended.
- All operations use the actual database.
- Permissions are enforced on the server.
- No dummy data exists in production.
- No duplicate components or logic are left behind.
- Terminal output and browser console are clean.
- Automated tests pass.
- The UI works on mobile and desktop.
- Arabic/English and RTL/LTR are supported correctly.
- Performance is acceptable for expected scale.

---

## End-to-end workflow validation

Every phase must be checked in context, not only in isolation. The required workflow below is the minimum benchmark for production readiness:

Add Product → Create Variant → Set Price → Add Inventory → Show in Search → Add to Cart → Create Order → Payment → Reserve & Deduct Inventory → Create Shipment → Deliver Order → Calculate Seller Commission

This full flow must work with real data, correct permissions, real validations, and real database state.

---

## Recommended execution pattern

To keep the project reliable, execute in this order:

1. Architecture and schema review
2. Prisma and database foundation
3. Users and permissions
4. Currencies, countries, and addresses
5. Sellers and stores
6. Categories, products, and variants
7. Search and filtering
8. Homepage and storefront UX
9. Cart and guest checkout
10. Orders
11. Payments
12. Inventory and warehouses
13. Suppliers and procurement
14. Accounting and commissions
15. Taxes and customs
16. Shipping and tracking
17. Returns
18. Promotions and loyalty
19. Reviews and support
20. Invoices
21. Settings, notifications, and CMS
22. Integrations and webhooks
23. Background jobs
24. Reports and analytics
25. Real estate (only if explicitly required)

This plan keeps the system coherent, maintainable, and production-safe.
