-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VariantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'PARTIALLY_SHIPPED', 'SHIPPED', 'PARTIALLY_DELIVERED', 'DELIVERED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VendorOrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'PROCESSING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIALLY_REFUNDED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentAttemptStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('SALE', 'COMMISSION', 'REFUND', 'ADJUSTMENT', 'PAYOUT', 'FEE', 'TAX', 'CHARGEBACK');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('DRAFT', 'POSTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'LABEL_CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('RECEIPT', 'SALE', 'RESERVATION', 'RELEASE', 'RETURN', 'ADJUSTMENT', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'RELEASED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('SHIPPING', 'BILLING', 'BOTH');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'CLOSED');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE', 'OTHER');

-- CreateEnum
CREATE TYPE "BookingRequestStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'DISABLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('IDENTITY', 'PASSPORT', 'BUSINESS_LICENSE', 'TAX_CERTIFICATE', 'BANK_STATEMENT', 'ADDRESS_PROOF', 'OTHER');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('VAT', 'GST', 'SALES_TAX', 'WITHHOLDING', 'CUSTOMS', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "userName" VARCHAR(100),
    "passwordHash" TEXT,
    "imageUrl" TEXT,
    "phone" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "user_role_assignments" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "scopeType" TEXT NOT NULL DEFAULT 'PLATFORM',
    "scopeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "two_factor_authentication" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "secret" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "two_factor_authentication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_consents" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "consentType" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "code" VARCHAR(3) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT,
    "minorUnits" INTEGER NOT NULL DEFAULT 2,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" UUID NOT NULL,
    "baseCurrency" VARCHAR(3) NOT NULL,
    "quoteCurrency" VARCHAR(3) NOT NULL,
    "rate" DECIMAL(24,12) NOT NULL,
    "source" TEXT,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "code" VARCHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "phoneCode" TEXT,
    "currencyCode" VARCHAR(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "state_provinces" (
    "id" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "state_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "stateId" UUID,
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'SHIPPING',
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "state" TEXT,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "displayName" TEXT NOT NULL,
    "legalName" TEXT,
    "slug" TEXT NOT NULL,
    "sellerType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "description" TEXT,
    "status" "SellerStatus" NOT NULL DEFAULT 'PENDING',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "countryCode" VARCHAR(2),
    "registrationNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_verifications" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerId" UUID,
    "notes" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_documents" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "verificationId" UUID,
    "type" "DocumentType" NOT NULL,
    "storageKey" TEXT NOT NULL,
    "checksum" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_tax_registrations" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "taxType" "TaxType" NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_tax_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_translations" (
    "id" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "store_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_staff" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "seller_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "parentId" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_translations" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_translations" (
    "id" UUID NOT NULL,
    "brandId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "brand_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "brandId" UUID,
    "title" VARCHAR(300) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "productId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "product_translations" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "product_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'IMAGE',
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_definitions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "isVariant" BOOLEAN NOT NULL DEFAULT false,
    "isFilterable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attribute_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_translations" (
    "id" UUID NOT NULL,
    "attributeId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "attribute_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "attributeId" UUID NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute_values" (
    "id" UUID NOT NULL,
    "attributeId" UUID NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "product_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "title" TEXT,
    "status" "VariantStatus" NOT NULL DEFAULT 'ACTIVE',
    "weight" DECIMAL(12,3),
    "weightUnit" TEXT,
    "dimensions" JSONB,
    "hsCode" TEXT,
    "countryOfOrigin" VARCHAR(2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_attributes" (
    "variantId" UUID NOT NULL,
    "attributeId" UUID NOT NULL,
    "valueId" UUID NOT NULL,

    CONSTRAINT "variant_attributes_pkey" PRIMARY KEY ("variantId","attributeId")
);

-- CreateTable
CREATE TABLE "product_identifiers" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "product_identifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_prices" (
    "id" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "compareAt" DECIMAL(19,4),
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "sellerId" UUID,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "onHand" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "type" "InventoryMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "idempotencyKey" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_reservations" (
    "id" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "orderItemId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" TEXT,

    CONSTRAINT "inventory_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfers" (
    "id" UUID NOT NULL,
    "sourceWarehouseId" UUID NOT NULL,
    "targetWarehouseId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfer_items" (
    "id" UUID NOT NULL,
    "transferId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "stock_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "countryCode" VARCHAR(2),
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_products" (
    "id" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "supplierSku" TEXT,
    "cost" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "leadTimeDays" INTEGER,

    CONSTRAINT "supplier_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" VARCHAR(3) NOT NULL,
    "totalAmount" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" UUID NOT NULL,
    "purchaseOrderId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "quantityOrdered" INTEGER NOT NULL,
    "quantityReceived" INTEGER NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(19,4) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_receipts" (
    "id" UUID NOT NULL,
    "purchaseOrderId" UUID NOT NULL,
    "reference" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goods_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_receipt_items" (
    "id" UUID NOT NULL,
    "receiptId" UUID NOT NULL,
    "purchaseItemId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "goods_receipt_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_sessions" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "guestSessionId" UUID,
    "currency" VARCHAR(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" UUID NOT NULL,
    "cartId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" UUID,
    "guestSessionId" UUID,
    "guestEmail" TEXT,
    "guestPhone" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "currency" VARCHAR(3) NOT NULL,
    "subtotal" DECIMAL(19,4) NOT NULL,
    "discountTotal" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "taxTotal" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "shippingTotal" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(19,4) NOT NULL,
    "exchangeRate" DECIMAL(24,12),
    "exchangeSource" TEXT,
    "idempotencyKey" TEXT,
    "placedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_addresses" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "type" "AddressType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "state" TEXT,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_orders" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "status" "VendorOrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DECIMAL(19,4) NOT NULL,
    "taxTotal" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "shippingTotal" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "vendorOrderId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "productName" TEXT NOT NULL,
    "variantName" TEXT,
    "sku" TEXT NOT NULL,
    "imageSnapshot" TEXT,
    "sellerName" TEXT,
    "attributesSnapshot" JSONB,
    "hsCode" TEXT,
    "countryOfOrigin" TEXT,
    "quantity" INTEGER NOT NULL,
    "quantityShipped" INTEGER NOT NULL DEFAULT 0,
    "quantityReturned" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(19,4) NOT NULL,
    "originalUnitPrice" DECIMAL(19,4),
    "discountAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "shippingAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "totalPrice" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_providers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL,
    "providerReference" TEXT,
    "idempotencyKey" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_attempts" (
    "id" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "providerReference" TEXT,
    "status" "PaymentAttemptStatus" NOT NULL DEFAULT 'PENDING',
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "providerReference" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_reconciliations" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "internalId" TEXT,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "matched" BOOLEAN NOT NULL DEFAULT false,
    "difference" DECIMAL(19,4),
    "reconciledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_reconciliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "paymentId" UUID,
    "userId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "amount" DECIMAL(19,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispute_evidence" (
    "id" UUID NOT NULL,
    "disputeId" UUID NOT NULL,
    "storageKey" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispute_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_accounts" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "sellerId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" UUID NOT NULL,
    "entryNumber" TEXT NOT NULL,
    "description" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "status" "JournalStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" VARCHAR(3) NOT NULL,
    "postedAt" TIMESTAMP(3),
    "reversedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_lines" (
    "id" UUID NOT NULL,
    "journalEntryId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "debit" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "credit" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "journal_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_ledger_entries" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "vendorOrderId" UUID,
    "type" "LedgerEntryType" NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "reference" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_rules" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" DECIMAL(7,4) NOT NULL,
    "fixedFee" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3),
    "sellerId" UUID,
    "categoryId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),

    CONSTRAINT "commission_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_transactions" (
    "id" UUID NOT NULL,
    "vendorOrderId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "ruleId" UUID,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commission_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_methods" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "accountToken" TEXT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payout_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "payoutMethodId" UUID NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "providerRef" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_regions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "stateCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tax_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_rates" (
    "id" UUID NOT NULL,
    "regionId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "taxType" "TaxType" NOT NULL,
    "percentage" DECIMAL(7,4) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tax_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_lines" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "orderItemId" UUID,
    "name" TEXT NOT NULL,
    "taxType" "TaxType" NOT NULL,
    "rate" DECIMAL(7,4) NOT NULL,
    "taxableBase" DECIMAL(19,4) NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,

    CONSTRAINT "tax_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customs_declarations" (
    "id" UUID NOT NULL,
    "shipmentId" UUID NOT NULL,
    "declarationNumber" TEXT,
    "incoterm" TEXT,
    "customsValue" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "duties" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "taxes" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "documentKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customs_declarations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customs_declaration_items" (
    "id" UUID NOT NULL,
    "declarationId" UUID NOT NULL,
    "orderItemId" UUID NOT NULL,
    "hsCode" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "customsValue" DECIMAL(19,4) NOT NULL,

    CONSTRAINT "customs_declaration_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_carriers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "shipping_carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_services" (
    "id" UUID NOT NULL,
    "carrierId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "shipping_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_zones" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "countries" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "shipping_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_rates" (
    "id" UUID NOT NULL,
    "zoneId" UUID NOT NULL,
    "serviceCode" TEXT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "baseCost" DECIMAL(19,4) NOT NULL,
    "perKgCost" DECIMAL(19,4) NOT NULL DEFAULT 0,

    CONSTRAINT "shipping_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "vendorOrderId" UUID NOT NULL,
    "carrierId" UUID,
    "serviceId" UUID,
    "trackingNumber" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "shippingCost" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" UUID NOT NULL,
    "shipmentId" UUID NOT NULL,
    "trackingNumber" TEXT,
    "weight" DECIMAL(12,3),
    "length" DECIMAL(12,3),
    "width" DECIMAL(12,3),
    "height" DECIMAL(12,3),
    "dimensionUnit" TEXT,
    "weightUnit" TEXT,
    "labelKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_items" (
    "id" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "orderItemId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "package_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_items" (
    "id" UUID NOT NULL,
    "shipmentId" UUID NOT NULL,
    "orderItemId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "shipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_tracking_events" (
    "id" UUID NOT NULL,
    "shipmentId" UUID NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_requests" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_items" (
    "id" UUID NOT NULL,
    "returnRequestId" UUID NOT NULL,
    "orderItemId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "refundAmount" DECIMAL(19,4) NOT NULL,

    CONSTRAINT "return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL,
    "promotionId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(19,4) NOT NULL,
    "maxUses" INTEGER,
    "maxUsesPerUser" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemptions" (
    "id" UUID NOT NULL,
    "couponId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_products" (
    "promotionId" UUID NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "promotion_products_pkey" PRIMARY KEY ("promotionId","productId")
);

-- CreateTable
CREATE TABLE "promotion_categories" (
    "promotionId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "promotion_categories_pkey" PRIMARY KEY ("promotionId","categoryId")
);

-- CreateTable
CREATE TABLE "promotion_sellers" (
    "promotionId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,

    CONSTRAINT "promotion_sellers_pkey" PRIMARY KEY ("promotionId","sellerId")
);

-- CreateTable
CREATE TABLE "loyalty_programs" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pointsPerUnit" DECIMAL(10,4) NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "programId" UUID NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" UUID NOT NULL,
    "codeHash" TEXT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "balance" DECIMAL(19,4) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_card_transactions" (
    "id" UUID NOT NULL,
    "giftCardId" UUID NOT NULL,
    "orderId" UUID,
    "amount" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gift_card_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "orderItemId" UUID,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_media" (
    "id" UUID NOT NULL,
    "reviewId" UUID NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'IMAGE',

    CONSTRAINT "review_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_reviews" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_questions" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_answers" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_messages" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_conversations" (
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_messages" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "orderId" UUID NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "subtotal" DECIMAL(19,4) NOT NULL,
    "taxTotal" DECIMAL(19,4) NOT NULL,
    "total" DECIMAL(19,4) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(19,4) NOT NULL,
    "total" DECIMAL(19,4) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_notes" (
    "id" UUID NOT NULL,
    "invoiceId" UUID NOT NULL,
    "noteNumber" TEXT NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "location" TEXT NOT NULL,
    "countryCode" VARCHAR(2),
    "city" TEXT,
    "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "type" "PropertyType" NOT NULL DEFAULT 'APARTMENT',
    "attributes" JSONB NOT NULL DEFAULT '{}',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_media" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'IMAGE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "property_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_translations" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "property_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_wishlists" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_requests" (
    "id" UUID NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "quotedPrice" DECIMAL(19,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "feeAmount" DECIMAL(19,4) NOT NULL DEFAULT 0,
    "status" "BookingRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_pages" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_page_translations" (
    "id" UUID NOT NULL,
    "pageId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "site_page_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_deliveries" (
    "id" UUID NOT NULL,
    "webhookId" UUID NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "responseCode" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "config" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "background_jobs" (
    "id" UUID NOT NULL,
    "queue" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "background_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_site_visits" (
    "day" DATE NOT NULL,
    "path" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_site_visits_pkey" PRIMARY KEY ("day","path")
);

-- CreateTable
CREATE TABLE "search_synonyms" (
    "id" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "synonyms" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "confirmationTokenHash" TEXT,
    "unsubscribeTokenHash" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE INDEX "users_status_createdAt_idx" ON "users"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_tokenHash_key" ON "user_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "user_sessions_userId_expiresAt_idx" ON "user_sessions"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "oauth_accounts_userId_idx" ON "oauth_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_providerAccountId_key" ON "oauth_accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "user_role_assignments_scopeType_scopeId_idx" ON "user_role_assignments"("scopeType", "scopeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_assignments_userId_roleId_scopeType_scopeId_key" ON "user_role_assignments"("userId", "roleId", "scopeType", "scopeId");

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_authentication_userId_key" ON "two_factor_authentication"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_tokenHash_key" ON "password_reset_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_expiresAt_idx" ON "password_reset_tokens"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_tokenHash_key" ON "verification_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "verification_tokens_identifier_expiresAt_idx" ON "verification_tokens"("identifier", "expiresAt");

-- CreateIndex
CREATE INDEX "user_consents_userId_consentType_idx" ON "user_consents"("userId", "consentType");

-- CreateIndex
CREATE INDEX "login_attempts_email_createdAt_idx" ON "login_attempts"("email", "createdAt");

-- CreateIndex
CREATE INDEX "login_attempts_ipAddress_createdAt_idx" ON "login_attempts"("ipAddress", "createdAt");

-- CreateIndex
CREATE INDEX "exchange_rates_baseCurrency_quoteCurrency_effectiveAt_idx" ON "exchange_rates"("baseCurrency", "quoteCurrency", "effectiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "state_provinces_countryCode_name_key" ON "state_provinces"("countryCode", "name");

-- CreateIndex
CREATE INDEX "cities_countryCode_name_idx" ON "cities"("countryCode", "name");

-- CreateIndex
CREATE INDEX "user_addresses_userId_isDefault_idx" ON "user_addresses"("userId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_userId_key" ON "sellers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_slug_key" ON "sellers"("slug");

-- CreateIndex
CREATE INDEX "sellers_status_createdAt_idx" ON "sellers"("status", "createdAt");

-- CreateIndex
CREATE INDEX "sellers_countryCode_status_idx" ON "sellers"("countryCode", "status");

-- CreateIndex
CREATE INDEX "seller_verifications_sellerId_status_idx" ON "seller_verifications"("sellerId", "status");

-- CreateIndex
CREATE INDEX "seller_documents_sellerId_type_idx" ON "seller_documents"("sellerId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "seller_tax_registrations_sellerId_countryCode_taxType_taxNu_key" ON "seller_tax_registrations"("sellerId", "countryCode", "taxType", "taxNumber");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_sellerId_isActive_idx" ON "stores"("sellerId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "store_translations_storeId_language_key" ON "store_translations"("storeId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "seller_staff_sellerId_userId_key" ON "seller_staff"("sellerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_isActive_idx" ON "categories"("parentId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_categoryId_language_key" ON "category_translations"("categoryId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "brand_translations_brandId_language_key" ON "brand_translations"("brandId", "language");

-- CreateIndex
CREATE INDEX "products_storeId_status_createdAt_idx" ON "products"("storeId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_status_isActive_createdAt_idx" ON "products"("status", "isActive", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "products_storeId_slug_key" ON "products"("storeId", "slug");

-- CreateIndex
CREATE INDEX "product_categories_categoryId_idx" ON "product_categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "product_translations_productId_language_key" ON "product_translations"("productId", "language");

-- CreateIndex
CREATE INDEX "product_media_productId_sortOrder_idx" ON "product_media"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_definitions_code_key" ON "attribute_definitions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_translations_attributeId_language_key" ON "attribute_translations"("attributeId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_productId_attributeId_key" ON "product_attributes"("productId", "attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_attributeId_value_key" ON "product_attribute_values"("attributeId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variants_productId_status_idx" ON "product_variants"("productId", "status");

-- CreateIndex
CREATE INDEX "product_identifiers_productId_idx" ON "product_identifiers"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_identifiers_type_value_key" ON "product_identifiers"("type", "value");

-- CreateIndex
CREATE INDEX "product_prices_variantId_currency_validFrom_idx" ON "product_prices"("variantId", "currency", "validFrom");

-- CreateIndex
CREATE UNIQUE INDEX "product_prices_variantId_currency_validFrom_key" ON "product_prices"("variantId", "currency", "validFrom");

-- CreateIndex
CREATE INDEX "warehouses_countryCode_city_idx" ON "warehouses"("countryCode", "city");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_sellerId_code_key" ON "warehouses"("sellerId", "code");

-- CreateIndex
CREATE INDEX "inventory_warehouseId_idx" ON "inventory"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_variantId_warehouseId_key" ON "inventory"("variantId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_movements_idempotencyKey_key" ON "inventory_movements"("idempotencyKey");

-- CreateIndex
CREATE INDEX "inventory_movements_variantId_warehouseId_createdAt_idx" ON "inventory_movements"("variantId", "warehouseId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_movements_referenceType_referenceId_idx" ON "inventory_movements"("referenceType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_reservations_idempotencyKey_key" ON "inventory_reservations"("idempotencyKey");

-- CreateIndex
CREATE INDEX "inventory_reservations_expiresAt_status_idx" ON "inventory_reservations"("expiresAt", "status");

-- CreateIndex
CREATE INDEX "inventory_reservations_orderItemId_idx" ON "inventory_reservations"("orderItemId");

-- CreateIndex
CREATE INDEX "inventory_reservations_variantId_warehouseId_status_idx" ON "inventory_reservations"("variantId", "warehouseId", "status");

-- CreateIndex
CREATE INDEX "stock_transfers_sourceWarehouseId_status_idx" ON "stock_transfers"("sourceWarehouseId", "status");

-- CreateIndex
CREATE INDEX "stock_transfer_items_variantId_idx" ON "stock_transfer_items"("variantId");

-- CreateIndex
CREATE INDEX "suppliers_name_idx" ON "suppliers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_products_supplierId_variantId_key" ON "supplier_products"("supplierId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_orderNumber_key" ON "purchase_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "purchase_orders_supplierId_status_idx" ON "purchase_orders"("supplierId", "status");

-- CreateIndex
CREATE INDEX "purchase_order_items_variantId_idx" ON "purchase_order_items"("variantId");

-- CreateIndex
CREATE INDEX "goods_receipts_purchaseOrderId_idx" ON "goods_receipts"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "guest_sessions_tokenHash_key" ON "guest_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "guest_sessions_expiresAt_idx" ON "guest_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "carts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "carts_guestSessionId_key" ON "carts"("guestSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_variantId_key" ON "cart_items"("cartId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "orders_idempotencyKey_key" ON "orders"("idempotencyKey");

-- CreateIndex
CREATE INDEX "orders_userId_createdAt_idx" ON "orders"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "order_addresses_orderId_type_idx" ON "order_addresses"("orderId", "type");

-- CreateIndex
CREATE INDEX "vendor_orders_sellerId_status_createdAt_idx" ON "vendor_orders"("sellerId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_orders_orderId_sellerId_key" ON "vendor_orders"("orderId", "sellerId");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_vendorOrderId_idx" ON "order_items"("vendorOrderId");

-- CreateIndex
CREATE INDEX "order_items_variantId_idx" ON "order_items"("variantId");

-- CreateIndex
CREATE INDEX "order_status_history_orderId_createdAt_idx" ON "order_status_history"("orderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payment_providers_code_key" ON "payment_providers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerReference_key" ON "payments"("providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotencyKey_key" ON "payments"("idempotencyKey");

-- CreateIndex
CREATE INDEX "payments_orderId_status_idx" ON "payments"("orderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_attempts_idempotencyKey_key" ON "payment_attempts"("idempotencyKey");

-- CreateIndex
CREATE INDEX "payment_attempts_paymentId_createdAt_idx" ON "payment_attempts"("paymentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_providerReference_key" ON "refunds"("providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_idempotencyKey_key" ON "refunds"("idempotencyKey");

-- CreateIndex
CREATE INDEX "refunds_paymentId_status_idx" ON "refunds"("paymentId", "status");

-- CreateIndex
CREATE INDEX "payment_reconciliations_matched_createdAt_idx" ON "payment_reconciliations"("matched", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payment_reconciliations_provider_externalId_key" ON "payment_reconciliations"("provider", "externalId");

-- CreateIndex
CREATE INDEX "disputes_orderId_status_idx" ON "disputes"("orderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_accounts_code_key" ON "ledger_accounts"("code");

-- CreateIndex
CREATE INDEX "ledger_accounts_sellerId_currency_idx" ON "ledger_accounts"("sellerId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entries_entryNumber_key" ON "journal_entries"("entryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entries_reversedById_key" ON "journal_entries"("reversedById");

-- CreateIndex
CREATE INDEX "journal_entries_referenceType_referenceId_idx" ON "journal_entries"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "journal_entries_status_createdAt_idx" ON "journal_entries"("status", "createdAt");

-- CreateIndex
CREATE INDEX "journal_lines_accountId_idx" ON "journal_lines"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "seller_ledger_entries_idempotencyKey_key" ON "seller_ledger_entries"("idempotencyKey");

-- CreateIndex
CREATE INDEX "seller_ledger_entries_sellerId_currency_createdAt_idx" ON "seller_ledger_entries"("sellerId", "currency", "createdAt");

-- CreateIndex
CREATE INDEX "commission_rules_isActive_validFrom_idx" ON "commission_rules"("isActive", "validFrom");

-- CreateIndex
CREATE INDEX "commission_transactions_sellerId_createdAt_idx" ON "commission_transactions"("sellerId", "createdAt");

-- CreateIndex
CREATE INDEX "payout_methods_sellerId_isDefault_idx" ON "payout_methods"("sellerId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "payouts_idempotencyKey_key" ON "payouts"("idempotencyKey");

-- CreateIndex
CREATE INDEX "payouts_sellerId_status_requestedAt_idx" ON "payouts"("sellerId", "status", "requestedAt");

-- CreateIndex
CREATE INDEX "tax_regions_countryCode_stateCode_idx" ON "tax_regions"("countryCode", "stateCode");

-- CreateIndex
CREATE INDEX "tax_rates_regionId_isActive_validFrom_idx" ON "tax_rates"("regionId", "isActive", "validFrom");

-- CreateIndex
CREATE INDEX "tax_lines_orderId_idx" ON "tax_lines"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_carriers_code_key" ON "shipping_carriers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_services_carrierId_code_key" ON "shipping_services"("carrierId", "code");

-- CreateIndex
CREATE INDEX "shipping_rates_zoneId_idx" ON "shipping_rates"("zoneId");

-- CreateIndex
CREATE INDEX "shipments_vendorOrderId_status_idx" ON "shipments"("vendorOrderId", "status");

-- CreateIndex
CREATE INDEX "shipments_trackingNumber_idx" ON "shipments"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_items_shipmentId_orderItemId_key" ON "shipment_items"("shipmentId", "orderItemId");

-- CreateIndex
CREATE INDEX "shipment_tracking_events_shipmentId_occurredAt_idx" ON "shipment_tracking_events"("shipmentId", "occurredAt");

-- CreateIndex
CREATE INDEX "return_requests_orderId_status_idx" ON "return_requests"("orderId", "status");

-- CreateIndex
CREATE INDEX "return_items_orderItemId_idx" ON "return_items"("orderItemId");

-- CreateIndex
CREATE INDEX "promotions_isActive_startsAt_endsAt_idx" ON "promotions"("isActive", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_promotionId_idx" ON "coupons"("promotionId");

-- CreateIndex
CREATE INDEX "coupon_redemptions_couponId_userId_idx" ON "coupon_redemptions"("couponId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_redemptions_couponId_orderId_key" ON "coupon_redemptions"("couponId", "orderId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_userId_createdAt_idx" ON "loyalty_transactions"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_codeHash_key" ON "gift_cards"("codeHash");

-- CreateIndex
CREATE INDEX "gift_card_transactions_giftCardId_createdAt_idx" ON "gift_card_transactions"("giftCardId", "createdAt");

-- CreateIndex
CREATE INDEX "reviews_productId_rating_createdAt_idx" ON "reviews"("productId", "rating", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_productId_key" ON "reviews"("userId", "productId");

-- CreateIndex
CREATE INDEX "store_reviews_sellerId_rating_idx" ON "store_reviews"("sellerId", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "store_reviews_userId_sellerId_key" ON "store_reviews"("userId", "sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_productId_key" ON "favorites"("userId", "productId");

-- CreateIndex
CREATE INDEX "recommendations_userId_score_idx" ON "recommendations"("userId", "score");

-- CreateIndex
CREATE INDEX "product_questions_productId_createdAt_idx" ON "product_questions"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "support_tickets_userId_status_idx" ON "support_tickets"("userId", "status");

-- CreateIndex
CREATE INDEX "support_messages_ticketId_createdAt_idx" ON "support_messages"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "store_conversations_sellerId_updatedAt_idx" ON "store_conversations"("sellerId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "store_conversations_customerId_sellerId_key" ON "store_conversations"("customerId", "sellerId");

-- CreateIndex
CREATE INDEX "store_messages_conversationId_createdAt_idx" ON "store_messages"("conversationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_orderId_idx" ON "invoices"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "credit_notes_noteNumber_key" ON "credit_notes"("noteNumber");

-- CreateIndex
CREATE INDEX "credit_notes_invoiceId_idx" ON "credit_notes"("invoiceId");

-- CreateIndex
CREATE INDEX "properties_countryCode_status_city_idx" ON "properties"("countryCode", "status", "city");

-- CreateIndex
CREATE INDEX "properties_storeId_createdAt_idx" ON "properties"("storeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "property_translations_propertyId_language_key" ON "property_translations"("propertyId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "property_wishlists_userId_propertyId_key" ON "property_wishlists"("userId", "propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_requests_idempotencyKey_key" ON "booking_requests"("idempotencyKey");

-- CreateIndex
CREATE INDEX "booking_requests_userId_status_createdAt_idx" ON "booking_requests"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "booking_requests_propertyId_status_idx" ON "booking_requests"("propertyId", "status");

-- CreateIndex
CREATE INDEX "notifications_userId_readAt_createdAt_idx" ON "notifications"("userId", "readAt", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_createdAt_idx" ON "audit_logs"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "site_pages_slug_key" ON "site_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "site_page_translations_pageId_language_key" ON "site_page_translations"("pageId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "feature_flags"("key");

-- CreateIndex
CREATE INDEX "webhook_deliveries_webhookId_createdAt_idx" ON "webhook_deliveries"("webhookId", "createdAt");

-- CreateIndex
CREATE INDEX "webhook_deliveries_status_nextAttemptAt_idx" ON "webhook_deliveries"("status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "outbox_events_status_availableAt_idx" ON "outbox_events"("status", "availableAt");

-- CreateIndex
CREATE INDEX "outbox_events_aggregateType_aggregateId_idx" ON "outbox_events"("aggregateType", "aggregateId");

-- CreateIndex
CREATE INDEX "background_jobs_queue_status_availableAt_idx" ON "background_jobs"("queue", "status", "availableAt");

-- CreateIndex
CREATE INDEX "reports_userId_createdAt_idx" ON "reports"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "search_synonyms_language_term_key" ON "search_synonyms"("language", "term");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_confirmationTokenHash_key" ON "newsletter_subscribers"("confirmationTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_unsubscribeTokenHash_key" ON "newsletter_subscribers"("unsubscribeTokenHash");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_confirmedAt_unsubscribedAt_idx" ON "newsletter_subscribers"("confirmedAt", "unsubscribedAt");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_assignments" ADD CONSTRAINT "user_role_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_assignments" ADD CONSTRAINT "user_role_assignments_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "two_factor_authentication" ADD CONSTRAINT "two_factor_authentication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_baseCurrency_fkey" FOREIGN KEY ("baseCurrency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_quoteCurrency_fkey" FOREIGN KEY ("quoteCurrency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "currencies"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_provinces" ADD CONSTRAINT "state_provinces_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state_provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_verifications" ADD CONSTRAINT "seller_verifications_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_documents" ADD CONSTRAINT "seller_documents_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_documents" ADD CONSTRAINT "seller_documents_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "seller_verifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_tax_registrations" ADD CONSTRAINT "seller_tax_registrations_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_tax_registrations" ADD CONSTRAINT "seller_tax_registrations_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_translations" ADD CONSTRAINT "store_translations_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_staff" ADD CONSTRAINT "seller_staff_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_staff" ADD CONSTRAINT "seller_staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_staff" ADD CONSTRAINT "seller_staff_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_translations" ADD CONSTRAINT "brand_translations_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_translations" ADD CONSTRAINT "product_translations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_translations" ADD CONSTRAINT "attribute_translations_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attribute_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attribute_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attribute_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attribute_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "product_attribute_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_identifiers" ADD CONSTRAINT "product_identifiers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_currency_fkey" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_sourceWarehouseId_fkey" FOREIGN KEY ("sourceWarehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_targetWarehouseId_fkey" FOREIGN KEY ("targetWarehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "stock_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_products" ADD CONSTRAINT "supplier_products_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_products" ADD CONSTRAINT "supplier_products_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_products" ADD CONSTRAINT "supplier_products_currency_fkey" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "goods_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_purchaseItemId_fkey" FOREIGN KEY ("purchaseItemId") REFERENCES "purchase_order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_currency_fkey" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_addresses" ADD CONSTRAINT "order_addresses_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_orders" ADD CONSTRAINT "vendor_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_orders" ADD CONSTRAINT "vendor_orders_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_vendorOrderId_fkey" FOREIGN KEY ("vendorOrderId") REFERENCES "vendor_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_currency_fkey" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_provider_fkey" FOREIGN KEY ("provider") REFERENCES "payment_providers"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_currency_fkey" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "disputes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_reversedById_fkey" FOREIGN KEY ("reversedById") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ledger_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_ledger_entries" ADD CONSTRAINT "seller_ledger_entries_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_ledger_entries" ADD CONSTRAINT "seller_ledger_entries_vendorOrderId_fkey" FOREIGN KEY ("vendorOrderId") REFERENCES "vendor_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_transactions" ADD CONSTRAINT "commission_transactions_vendorOrderId_fkey" FOREIGN KEY ("vendorOrderId") REFERENCES "vendor_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_transactions" ADD CONSTRAINT "commission_transactions_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_transactions" ADD CONSTRAINT "commission_transactions_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "commission_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_methods" ADD CONSTRAINT "payout_methods_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_methods" ADD CONSTRAINT "payout_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_payoutMethodId_fkey" FOREIGN KEY ("payoutMethodId") REFERENCES "payout_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_regions" ADD CONSTRAINT "tax_regions_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_rates" ADD CONSTRAINT "tax_rates_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "tax_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_lines" ADD CONSTRAINT "tax_lines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_lines" ADD CONSTRAINT "tax_lines_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customs_declarations" ADD CONSTRAINT "customs_declarations_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customs_declaration_items" ADD CONSTRAINT "customs_declaration_items_declarationId_fkey" FOREIGN KEY ("declarationId") REFERENCES "customs_declarations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customs_declaration_items" ADD CONSTRAINT "customs_declaration_items_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_services" ADD CONSTRAINT "shipping_services_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "shipping_carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "shipping_zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_currency_fkey" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_vendorOrderId_fkey" FOREIGN KEY ("vendorOrderId") REFERENCES "vendor_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "shipping_carriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "shipping_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_tracking_events" ADD CONSTRAINT "shipment_tracking_events_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "return_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_categories" ADD CONSTRAINT "promotion_categories_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_categories" ADD CONSTRAINT "promotion_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_sellers" ADD CONSTRAINT "promotion_sellers_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_sellers" ADD CONSTRAINT "promotion_sellers_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_programId_fkey" FOREIGN KEY ("programId") REFERENCES "loyalty_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "gift_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_media" ADD CONSTRAINT "review_media_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_reviews" ADD CONSTRAINT "store_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_reviews" ADD CONSTRAINT "store_reviews_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_questions" ADD CONSTRAINT "product_questions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_questions" ADD CONSTRAINT "product_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_answers" ADD CONSTRAINT "product_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "product_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_answers" ADD CONSTRAINT "product_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_conversations" ADD CONSTRAINT "store_conversations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_conversations" ADD CONSTRAINT "store_conversations_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_messages" ADD CONSTRAINT "store_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "store_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_messages" ADD CONSTRAINT "store_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_media" ADD CONSTRAINT "property_media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_translations" ADD CONSTRAINT "property_translations_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_wishlists" ADD CONSTRAINT "property_wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_wishlists" ADD CONSTRAINT "property_wishlists_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_page_translations" ADD CONSTRAINT "site_page_translations_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "site_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "webhooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

