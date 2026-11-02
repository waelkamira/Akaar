/**
 * UI inventory mapped to the operational Prisma schema.
 * These are presentation/domain relationships, not a replacement for Prisma relations.
 */
export const databaseUiDomains = [
  {
    id: "identity",
    title: "الحسابات والهوية",
    models: ["User", "Role", "RoleAssignment", "PasswordReset", "GuestSession"],
    routes: ["/login", "/register", "/profile", "/profile/security"],
    relationships: ["User → RoleAssignment → Role", "User → PasswordReset", "GuestSession → Cart"],
  },
  {
    id: "catalog",
    title: "الكتالوج والبحث",
    models: ["Category", "Product", "ProductImage", "ProductMedia", "ProductTranslation", "ProductPriceHistory", "Discount"],
    routes: ["/", "/search", "/categories/[id]", "/posts/[id]"],
    relationships: ["Category → Product", "User → Product", "Seller → Product", "Product → ProductImage/ProductMedia", "Product → Discount/PriceHistory"],
  },
  {
    id: "seller",
    title: "البائعون والمتاجر",
    models: ["Seller", "Store", "VendorOrder"],
    routes: ["/seller/dashboard", "/seller/products", "/seller/orders", "/seller/analytics", "/stores/[slug]"],
    relationships: ["User 1:1 Seller", "User 1:1 Store", "Seller → Product", "Seller → VendorOrder"],
  },
  {
    id: "commerce",
    title: "السلة والطلبات والدفع",
    models: ["Cart", "CartItem", "Order", "OrderItem", "Payment", "MarketplaceSetting"],
    routes: ["/cart", "/checkout", "/orders", "/orders/[id]"],
    relationships: ["User/GuestSession → Cart → CartItem → Product", "User → Order → OrderItem → Product", "Order → Payment", "MarketplaceSetting → payment/commission configuration"],
  },
  {
    id: "engagement",
    title: "التفاعل وخدمة العملاء",
    models: ["Favorite", "Wishlist", "Review", "StoreReview", "Conversation", "Message", "Notification", "Report"],
    routes: ["/favorite", "/wishlist", "/messages", "/notifications", "/support"],
    relationships: ["User ↔ Product via Favorite/Wishlist", "User → Review → Product", "User → StoreReview → Store/Seller", "Conversation → Message", "User → Notification/Report"],
  },
  {
    id: "admin",
    title: "الإدارة والحوكمة",
    models: ["User", "Seller", "Product", "Order", "Payment", "Report", "MarketplaceSetting"],
    routes: ["/admin/control-panel", "/admin/catalog", "/admin/properties", "/admin/users", "/admin/sellers", "/admin/orders", "/admin/settings"],
    relationships: ["Admin manages users, sellers, product approval, reports, payments and marketplace settings"],
  },
  {
    id: "property",
    title: "العقارات",
    models: ["Property", "BookingRequest", "Store"],
    routes: ["/properties", "/properties/[id]", "/properties/new", "/admin/properties", "/api/bookings"],
    relationships: ["User → Property", "Store → Property", "Property → BookingRequest → User"],
  },
];

export const databaseUiSharedElements = [
  "GlobalHeader", "GlobalSearch", "CategoryNavigation", "Breadcrumbs", "ProductCard",
  "ProductGallery", "PriceDisplay", "StockBadge", "SellerBadge", "RatingSummary",
  "FilterSidebar", "SortControl", "Pagination", "EmptyState", "ErrorState", "LoadingState",
  "QuantityStepper", "CartSummary", "OrderStatusTimeline", "AddressForm", "PaymentMethodSelector",
  "DataTable", "StatusBadge", "ConfirmDialog", "ImageUploader", "FormField", "AccessDenied",
];
