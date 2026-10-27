-- Read-only inventory of the deployed/legacy schema versus the canonical prisma/schema.prisma.
-- Run with psql against a RESTORED COPY, preferably using a SELECT-only database role.
-- This script never alters data/schema and avoids referencing columns until they are found.
\echo '1) Expected canonical Prisma tables: presence/absence'
WITH expected(table_name) AS (
  VALUES
    ('users'), ('sellers'), ('guest_sessions'), ('products'),
    ('Favorite'), ('ProductImage'), ('Role'), ('Permission'), ('Category'),
    ('Country'), ('City'), ('Supplier'), ('Inventory'), ('ProductTranslation'),
    ('ProductPriceHistory'), ('Review'), ('Cart'), ('CartItem'), ('Order'),
    ('OrderItem'), ('Payment'), ('Discount'), ('Shipping'), ('Return'),
    ('Notification'), ('Report'), ('Recommendation'), ('ShippingMethod'),
    ('PasswordResetToken'), ('VerificationToken')
)
SELECT e.table_name,
       CASE WHEN t.table_name IS NULL THEN 'MISSING' ELSE 'present' END AS status
FROM expected e
LEFT JOIN information_schema.tables t
  ON t.table_schema = 'public'
 AND t.table_name = e.table_name
 AND t.table_type = 'BASE TABLE'
ORDER BY status DESC, e.table_name;

\echo '2) Critical compatibility columns: present/missing without querying their data'
WITH expected(table_name, column_name, reason) AS (
  VALUES
    ('users', 'role', 'canonical role enum'),
    ('users', 'status', 'account status'),
    ('users', 'createdAt', 'audit timestamp'),
    ('users', 'updatedAt', 'audit timestamp'),
    ('products', 'categoryId', 'category relation key'),
    ('products', 'categoryName', 'legacy category label'),
    ('products', 'images', 'legacy/current image array'),
    ('products', 'sellerId', 'seller relation'),
    ('products', 'isActive', 'public visibility'),
    ('products', 'isDeleted', 'soft deletion'),
    ('products', 'createdAt', 'audit timestamp'),
    ('products', 'updatedAt', 'audit timestamp'),
    ('Category', 'id', 'category primary key'),
    ('Category', 'name', 'category display name'),
    ('Category', 'slug', 'canonical unique slug'),
    ('Category', 'updatedAt', 'audit timestamp'),
    ('Category', 'parentId', 'hierarchical category relation'),
    ('Category', 'isActive', 'category visibility'),
    ('ProductImage', 'id', 'media primary key'),
    ('ProductImage', 'productId', 'media/product relation'),
    ('ProductImage', 'url', 'normalized media URL'),
    ('ProductImage', 'sortOrder', 'media ordering'),
    ('ProductImage', 'isPrimary', 'primary image flag'),
    ('ProductImage', 'image1', 'legacy image slot; preserve until reconciled'),
    ('ProductImage', 'image2', 'legacy image slot; preserve until reconciled'),
    ('ProductImage', 'image3', 'legacy image slot; preserve until reconciled'),
    ('ProductImage', 'image4', 'legacy image slot; preserve until reconciled'),
    ('ProductImage', 'image5', 'legacy image slot; preserve until reconciled'),
    ('sellers', 'userId', 'seller/user relation'),
    ('sellers', 'slug', 'canonical unique seller slug'),
    ('Cart', 'userId', 'cart ownership'),
    ('CartItem', 'cartId', 'cart item relation'),
    ('OrderItem', 'orderId', 'persisted order line relation'),
    ('PasswordResetToken', 'tokenHash', 'hashed reset token'),
    ('VerificationToken', 'token', 'verification token')
)
SELECT e.table_name, e.column_name, e.reason,
       CASE WHEN c.column_name IS NULL THEN 'MISSING' ELSE 'present' END AS status,
       c.data_type, c.is_nullable
FROM expected e
LEFT JOIN information_schema.columns c
  ON c.table_schema = 'public'
 AND c.table_name = e.table_name
 AND c.column_name = e.column_name
ORDER BY status DESC, e.table_name, e.column_name;

\echo '3) Legacy-only columns that may need explicit data mapping before removal'
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'ProductImage' AND column_name IN ('image1','image2','image3','image4','image5'))
    OR (table_name = 'products' AND column_name IN ('categoryId','categoryName','images'))
  )
ORDER BY table_name, ordinal_position;

\echo '4) Existing Prisma migration ledger (if present)'
SELECT table_name,
       CASE WHEN table_name IS NULL THEN 'MISSING' ELSE 'present' END AS status
FROM (VALUES ('_prisma_migrations')) expected(table_name)
LEFT JOIN information_schema.tables t
  ON t.table_schema = 'public'
 AND t.table_name = expected.table_name
 AND t.table_type = 'BASE TABLE';

\echo '5) Extra public tables not represented by canonical Prisma models (review; do not drop automatically)'
WITH expected(table_name) AS (
  VALUES
    ('users'), ('sellers'), ('guest_sessions'), ('products'),
    ('Favorite'), ('ProductImage'), ('Role'), ('Permission'), ('Category'),
    ('Country'), ('City'), ('Supplier'), ('Inventory'), ('ProductTranslation'),
    ('ProductPriceHistory'), ('Review'), ('Cart'), ('CartItem'), ('Order'),
    ('OrderItem'), ('Payment'), ('Discount'), ('Shipping'), ('Return'),
    ('Notification'), ('Report'), ('Recommendation'), ('ShippingMethod'),
    ('PasswordResetToken'), ('VerificationToken'), ('_prisma_migrations')
)
SELECT t.table_name
FROM information_schema.tables t
LEFT JOIN expected e ON e.table_name = t.table_name
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND e.table_name IS NULL
ORDER BY t.table_name;

\echo 'Inventory complete. Diagnostic only: no schema or data changes were made.'
