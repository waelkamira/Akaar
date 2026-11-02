# Database ↔ Backend ↔ Frontend Integration Map

> **Baseline:** `main` at `6b9836a03b10b0ef0059854d77f120f17a11dc38` (2026-11-02).
> **Canonical schema:** `prisma/schema.prisma`.
> **Method:** static inventory of the schema, repository tree and README execution log. A route/page path proves that a feature surface exists, not that every field, permission, state transition or user journey is fully integrated. Rows marked **verify** require source-level tracing and tests before being called complete.

## Status definitions

- **Integrated surface:** a matching page/API is present in the repository inventory; detailed behavior still requires tests.
- **Partial / indirect:** only part of the lifecycle is surfaced, or the model is accessed as part of another feature.
- **Gap candidate:** no dedicated UI/API was evident in the current inventory; confirm with a repository-wide reference search before implementing.
- **Backend / internal:** persistence or infrastructure model; does not necessarily need a customer-facing CRUD page.

## Model inventory

| Prisma model | Related models (key relations) | API / backend evidence | Frontend evidence | Initial assessment |
|---|---|---|---|---|
| User | Seller, Store, Product, Order, Payment, Review, Favorite, Cart, Notification, messages, Property | `/api/user`, `/api/auth`, `/api/admin/users`, `/api/register` | `/profile`, `/profile/settings`, `/admin/users`, account/auth pages | Integrated surface — verify role/status and account lifecycle |
| Seller | User, Product, VendorOrder, StoreReview, StoreConversation | `/api/seller/*`, `/api/admin/sellers/*` | `/seller/*`, `/admin/control-panel/stores`, public `/shop/[slug]` | Integrated surface — verify seller onboarding and moderation end-to-end |
| Store | User, Property | `/api/shop/[slug]`, admin store APIs | `/shop/[slug]`, `/stores/[slug]`, admin stores | Partial — seller Store and property Store are separate concepts; verify intended ownership model |
| GuestSession | Cart | `/api/cart` | `/cart` | Backend / indirect — guest cart session; no standalone page needed |
| Product | User, Seller, Category, images, prices, reviews, cart, orders | `/api/posts`, `/api/product`, `/api/search`, `/api/seller/products`, admin product APIs | `/post/[id]`, `/posts`, `/search`, `/seller/products`, admin products | Integrated surface — verify lifecycle, visibility and stock consistency |
| Property | User, Store, PropertyWishlist, BookingRequest | `/api/properties/*`, `/api/admin/properties/*` | `/properties`, `/properties/[id]`, seller property creation, admin properties | Integrated surface — verify seller/store association and booking flow |
| PropertyWishlist | User, Property | `/api/properties/wishlist`, `/api/properties/[id]/wishlist` | `/property-wishlist` | Integrated surface |
| BookingRequest | User, Property | `/api/bookings` | `/properties/[id]/book`, `/my-bookings` | Integrated surface — verify admin/seller review lifecycle |
| Favorite | User, Product | `/api/favorite/*` | `/favorite`, `/wishlist` | Integrated surface — verify legacy route duplication and soft-delete semantics |
| ProductImage | Product | Product media is also represented by `Product.images` | Product gallery/media components | **Gap / design decision** — model exists, but verify whether create/edit/read flows persist this model or only the string array; avoid two sources of truth |
| Role | User, Permission | User role checks exist; dedicated Role CRUD not evident | No dedicated role-management page evident | **Gap candidate** — current authorization may use enum `User.role`; decide whether dynamic RBAC is required |
| Permission | Role | Dedicated permission-management API not evident | No dedicated permission-management UI evident | **Gap candidate** — related to whether dynamic RBAC will replace/extend enum roles |
| Category | Product, parent/children | `/api/categories/*` | `/categories`, search/category filters, category selectors | Integrated surface — verify hierarchical category CRUD and inactive-category behavior |
| Country | City, Supplier | `/api/admin/countries` | `/admin/locations` | Integrated admin surface — **not yet proven connected to checkout/shipping** |
| City | Country, Supplier | `/api/admin/cities` | `/admin/locations`, city selectors | Integrated admin surface — **not yet proven connected to checkout/shipping** |
| Supplier | Country, City | `/api/admin/suppliers` | `/admin/suppliers` | Partial — supplier directory exists; no purchasing, supplier-product, receiving or stock movement workflow evident |
| ProductTranslation | Product | `/api/admin/product-translations`, `/api/search`, product detail API | `/admin/product-translations`, product/search surfaces | Partial — translation management and search/detail support exist; global locale, fallback, SEO and all page strings need completion |
| ProductPriceHistory | Product | No dedicated price-history API evident | No price-history UI evident | **Gap candidate** — no visible price audit/history workflow |
| Review | User, Product | `/api/reviews` | `/my-reviews`, product review widget, admin product reviews | Integrated surface — verify verified-purchase enforcement and moderation |
| StoreReview | User, Seller | `/api/reviews` | Store review form/widget, admin store reviews | Integrated surface — verify verified-purchase enforcement and moderation |
| Cart | User, GuestSession, CartItem | `/api/cart` | `/cart` | Integrated surface |
| CartItem | Cart, Product | `/api/cart` | Cart client | Backend / indirect — correctly managed inside cart UI |
| Order | User, Discount, ShippingMethod, Payment, Shipping, Return, OrderItem, VendorOrder | `/api/orders`, Stripe webhook, admin orders | `/orders`, order invoice, admin orders | Integrated surface — verify checkout, cancellation, totals and multi-vendor consistency |
| OrderItem | Order, Product, VendorOrder | `/api/orders`, seller orders | Order detail/invoice, seller orders | Backend / indirect — line-item UI is part of order views |
| VendorOrder | Order, Seller, OrderItem | `/api/seller/orders` | `/seller/orders` | Partial — seller fulfillment exists; verify split fulfillment, shipment tracking and cross-vendor order states |
| Payment | Order, User | `/api/payments/*`, Stripe webhook, admin payment APIs | Admin payments; checkout/payment surfaces | Partial — verify payment-method lifecycle, refunds, provider retries and production readiness |
| Discount | Product, Order | `/api/admin/discounts`, `/api/orders` | `/admin/discounts`, cart/checkout promo field | Partial — discount is linked to one product; verify Stripe parity and global promotion requirements |
| Shipping | Order | No complete shipment lifecycle API identified beyond order/seller flows | No distinct shipment management/tracking page identified | **Gap candidate / partial** — separate from ShippingMethod; verify whether shipping rows are written and updated |
| Return | Order | `/api/returns`, `/api/admin/returns` | `/returns`, `/admin/returns` | Integrated request/review surface — actual payment refund execution is separate and not implied by approval |
| Notification | User | `/api/notifications` | `/notifications`, notification inbox | Integrated surface |
| StoreConversation | User, Seller, StoreMessage | `/api/messages` | `/messages`, account inbox, admin messages | Integrated surface |
| StoreMessage | StoreConversation, User | `/api/messages` | Conversation thread | Backend / indirect — displayed within conversation UI |
| MarketplaceSetting | — | `/api/admin/settings` | `/admin/settings` | Integrated admin surface — verify each setting is consumed by runtime features |
| PaymentMethodDraft | — | Payment-method API presence needs source tracing | Payment method UI/API relationship needs source tracing | **Verify** — likely internal/draft data; do not assume it is a customer payment-method vault |
| SitePage | — | `/api/site-pages`, admin site-page APIs | `/pages/[slug]`, admin site pages | Integrated surface |
| DailySiteVisit | — | `/api/analytics/page-view`, analytics/dashboard APIs | Admin dashboard/analytics | Partial — event capture and summary may exist; detailed reporting/retention needs verification |
| NewsletterSubscriber | — | `/api/newsletter`, confirm endpoint | Newsletter signup, confirmation and unsubscribe pages; admin subscribers | Integrated surface |
| Report | User | No dedicated report submission/review API identified | No report/abuse UI identified | **Gap candidate** — no evident report intake or moderation workflow |
| Recommendation | User, Product | No recommendation-serving API identified | No recommendations surface tied to this model identified | **Gap candidate** — model exists, but homepage/product recommendations may be static or use other logic |
| ShippingMethod | Order | `/api/admin/shipping-methods`; referenced by orders | `/admin/shipping-methods`, checkout selection needs verification | Partial — CRUD exists; country/city coverage, currency, delivery estimates and checkout pricing are not modeled fully |
| PasswordResetToken | User | Password API exists; token flow requires exact source trace | Login/profile password surfaces; no confirmed reset journey | **Verify / gap candidate** — confirm secure request, email delivery, expiry, one-time use and reset UI |
| VerificationToken | — | No confirmed email-verification token flow identified | No confirmed verification journey identified | **Gap candidate** — confirm whether another auth provider mechanism handles verification |

## Confirmed cross-model integration risks

1. **Product media duplication:** `Product.images String[]` and `ProductImage` can represent the same data. Select one canonical write/read path or explicitly document the migration strategy.
2. **RBAC ambiguity:** `User.role UserRole` and `User.roleId → Role` coexist. Define whether permissions are enum-based, database-driven, or hybrid; never let the UI decide authorization.
3. **Location-to-checkout gap:** Country/City/Supplier administration exists, but the current Order stores shipping city/address as text and ShippingMethod lacks geographic coverage/currency/delivery terms. Admin location CRUD alone does not make global shipping operational.
4. **Supplier-to-inventory gap:** Supplier has no purchase-order, supplier-product, goods-receipt or stock-movement relations. Product stock quantity alone is not a complete inventory ledger.
5. **Shipping lifecycle:** ShippingMethod is a selectable service/configuration; Shipping is a shipment record. They need distinct responsibilities and a clear connection to VendorOrder for multi-seller fulfillment.
6. **Returns vs refunds:** Return approval is not proof of a provider refund. Keep payment refund state and provider references explicit.
7. **Localization:** ProductTranslation does not by itself translate navigation, categories, CMS, metadata, currencies, or route locale. A language selector alone is not full i18n.

## First implementation priorities after the mapping is source-verified

1. Resolve Product / ProductImage canonical media storage.
2. Decide and implement a coherent authorization model (enum roles vs Role/Permission).
3. Connect country/city selection to address capture, shipping eligibility and checkout quotes.
4. Design supplier purchasing and inventory movements before adding inventory UI.
5. Complete shipment tracking at the vendor-fulfillment level.
6. Add reporting/moderation only after defining abuse categories, evidence, and admin workflow.
7. Add product price history and recommendation serving only when their business rules and data sources are defined.
8. Verify password reset and email verification journeys before creating duplicate auth systems.

## Required next verification pass

- Trace every Prisma model reference through server actions, route handlers, services, and UI components; record exact file paths and CRUD operations (read/create/update/delete).
- Inspect the full contents of each referenced route/page; a matching filename is not sufficient evidence of integration.
- Check authorization and ownership at the server boundary for every mutation.
- Add model-specific API/integration tests using an isolated PostgreSQL test database.
- Update each row to **verified**, **partial**, or **missing** only after the source trace and tests.
- Do not run migrations, `db push`, or destructive database commands as part of this documentation pass.
