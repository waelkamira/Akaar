-- READ-ONLY preflight for the legacy Prisma shape in the initial migration.
-- Run against a RESTORED COPY first, using a role with SELECT-only privileges.
-- This script intentionally performs no UPDATE/ALTER/DELETE/INSERT.
-- It expects public."ProductImage"(image1..image5), public.products(categoryId, categoryName, images),
-- and public."Category"(id, name). If your deployed schema differs, stop and adapt this
-- report after inspecting information_schema; do not improvise a production migration.

\echo '1) Schema shape: required legacy tables and columns'
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'ProductImage' AND column_name IN ('id','productId','image1','image2','image3','image4','image5','isPrimary'))
    OR (table_name = 'products' AND column_name IN ('id','categoryId','categoryName','images'))
    OR (table_name = 'Category' AND column_name IN ('id','name','description'))
  )
ORDER BY table_name, ordinal_position;

\echo '2) ProductImage source rows and populated legacy slots'
SELECT
  COUNT(*) AS product_image_rows,
  COUNT(*) FILTER (WHERE NULLIF(BTRIM("image1"), '') IS NOT NULL) AS image1_populated,
  COUNT(*) FILTER (WHERE NULLIF(BTRIM("image2"), '') IS NOT NULL) AS image2_populated,
  COUNT(*) FILTER (WHERE NULLIF(BTRIM("image3"), '') IS NOT NULL) AS image3_populated,
  COUNT(*) FILTER (WHERE NULLIF(BTRIM("image4"), '') IS NOT NULL) AS image4_populated,
  COUNT(*) FILTER (WHERE NULLIF(BTRIM("image5"), '') IS NOT NULL) AS image5_populated,
  COUNT(*) FILTER (
    WHERE NULLIF(BTRIM("image1"), '') IS NULL
      AND NULLIF(BTRIM("image2"), '') IS NULL
      AND NULLIF(BTRIM("image3"), '') IS NULL
      AND NULLIF(BTRIM("image4"), '') IS NULL
      AND NULLIF(BTRIM("image5"), '') IS NULL
  ) AS rows_with_no_populated_slots
FROM public."ProductImage";

\echo '3) Legacy image slot totals by product (for reconciliation against new media rows)'
WITH legacy_slots AS (
  SELECT "productId", NULLIF(BTRIM("image1"), '') AS url, 1 AS slot FROM public."ProductImage"
  UNION ALL SELECT "productId", NULLIF(BTRIM("image2"), ''), 2 FROM public."ProductImage"
  UNION ALL SELECT "productId", NULLIF(BTRIM("image3"), ''), 3 FROM public."ProductImage"
  UNION ALL SELECT "productId", NULLIF(BTRIM("image4"), ''), 4 FROM public."ProductImage"
  UNION ALL SELECT "productId", NULLIF(BTRIM("image5"), ''), 5 FROM public."ProductImage"
)
SELECT
  COUNT(*) FILTER (WHERE url IS NOT NULL) AS expected_media_rows,
  COUNT(DISTINCT "productId") FILTER (WHERE url IS NOT NULL) AS products_with_legacy_media,
  COUNT(*) FILTER (WHERE url IS NOT NULL AND p.id IS NULL) AS orphaned_image_slots
FROM legacy_slots s
LEFT JOIN public.products p ON p.id = s."productId";

\echo '4) Product image-array inventory (array and legacy table may not match)'
SELECT
  COUNT(*) AS product_rows,
  COUNT(*) FILTER (WHERE COALESCE(cardinality(images), 0) > 0) AS products_with_images_array,
  COALESCE(SUM(cardinality(images)), 0) AS image_array_entries,
  COUNT(*) FILTER (WHERE categoryName IS NULL OR BTRIM(categoryName) = '') AS products_without_category_name
FROM public.products;

\echo '5) Category name ambiguity report (name-based mapping is only a candidate, not automatic approval)'
SELECT LOWER(BTRIM(name)) AS normalized_name, COUNT(*) AS category_rows,
       ARRAY_AGG(id::text ORDER BY id::text) AS legacy_category_ids
FROM public."Category"
GROUP BY LOWER(BTRIM(name))
HAVING COUNT(*) > 1
ORDER BY normalized_name;

\echo '6) Product category names with no exact legacy Category.name match'
SELECT p."categoryId", p."categoryName", COUNT(*) AS product_count
FROM public.products p
LEFT JOIN public."Category" c ON BTRIM(c.name) = BTRIM(p."categoryName")
WHERE c.id IS NULL
GROUP BY p."categoryId", p."categoryName"
ORDER BY product_count DESC, p."categoryId", p."categoryName";

\echo '7) Product category IDs associated with multiple category names'
SELECT "categoryId", COUNT(DISTINCT BTRIM("categoryName")) AS distinct_names,
       ARRAY_AGG(DISTINCT BTRIM("categoryName") ORDER BY BTRIM("categoryName")) AS category_names,
       COUNT(*) AS product_count
FROM public.products
GROUP BY "categoryId"
HAVING COUNT(DISTINCT BTRIM("categoryName")) > 1
ORDER BY product_count DESC, "categoryId";

\echo 'Preflight complete. These results are diagnostic only; review and approve explicit mappings before any migration.'
