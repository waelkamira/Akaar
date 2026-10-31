BEGIN;

DO $repair$
DECLARE
  category_id_column_type TEXT;
BEGIN
  IF to_regclass('public.products') IS NULL OR to_regclass('public.categories') IS NULL THEN
    RAISE EXCEPTION 'Expected legacy tables public.products and public.categories were not found.';
  END IF;

  IF to_regclass('public."Category"') IS NOT NULL THEN
    RAISE EXCEPTION 'Canonical public."Category" already exists; inspect it before applying this repair.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.products) THEN
    RAISE EXCEPTION 'public.products contains rows; refusing to change categoryId or catalog schema.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.categories) THEN
    RAISE EXCEPTION 'Legacy public.categories contains rows; reconcile category data before applying this repair.';
  END IF;

  IF EXISTS (
    SELECT required.column_name
    FROM unnest(ARRAY['id', 'title', 'userId', 'categoryId', 'categoryName', 'images', 'createdAt', 'updatedAt']) AS required(column_name)
    WHERE NOT EXISTS (
      SELECT 1
      FROM information_schema.columns AS existing
      WHERE existing.table_schema = 'public'
        AND existing.table_name = 'products'
        AND existing.column_name = required.column_name
    )
  ) THEN
    RAISE EXCEPTION 'public.products does not match the inspected legacy product schema.';
  END IF;

  SELECT udt_name INTO category_id_column_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'products'
    AND column_name = 'categoryId';

  IF category_id_column_type <> 'text' THEN
    RAISE EXCEPTION 'Expected legacy products.categoryId to be text, found %.', category_id_column_type;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type
    WHERE typnamespace = 'public'::regnamespace
      AND typname = 'ProductApprovalStatus'
  ) THEN
    CREATE TYPE public."ProductApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  ELSIF (
    SELECT COUNT(*)
    FROM pg_enum AS value
    JOIN pg_type AS type ON type.oid = value.enumtypid
    WHERE type.typnamespace = 'public'::regnamespace
      AND type.typname = 'ProductApprovalStatus'
      AND value.enumlabel IN ('PENDING', 'APPROVED', 'REJECTED')
  ) <> 3 THEN
    RAISE EXCEPTION 'public."ProductApprovalStatus" exists but is missing required values.';
  END IF;
END
$repair$;

DO $repair$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.products'::regclass
      AND confrelid = 'public.categories'::regclass
      AND conname = 'products_categoryId_fkey'
      AND contype = 'f'
  ) THEN
    RAISE EXCEPTION 'Expected legacy products-to-categories foreign key was not found.';
  END IF;
END
$repair$;

ALTER TABLE public.products
  DROP CONSTRAINT "products_categoryId_fkey";

CREATE TABLE public."Category" (
  "id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "parentId" INTEGER,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Category_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES public."Category"("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Category_name_key" ON public."Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON public."Category"("slug");
CREATE INDEX "Category_name_idx" ON public."Category"("name");
CREATE INDEX "Category_parentId_idx" ON public."Category"("parentId");
CREATE INDEX "Category_isActive_idx" ON public."Category"("isActive");

INSERT INTO public."Category" ("id", "name", "slug", "description", "updatedAt") VALUES
  (1, 'عقارات', 'real-estate', 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار', CURRENT_TIMESTAMP),
  (2, 'سيارات', 'cars', 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات', CURRENT_TIMESTAMP),
  (3, 'هواتف', 'phones', 'هواتف ذكية، أجهزة لوحية، وملحقاتها', CURRENT_TIMESTAMP),
  (4, 'كمبيوتر', 'computers', 'أجهزة كمبيوتر، لابتوب، وملحقاتها', CURRENT_TIMESTAMP),
  (5, 'إلكترونيات', 'electronics', 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية', CURRENT_TIMESTAMP),
  (6, 'أثاث', 'furniture', 'أثاث غرف، مفروشات، وديكورات منزلية', CURRENT_TIMESTAMP),
  (7, 'مطبخ', 'kitchen', 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل', CURRENT_TIMESTAMP),
  (8, 'موضة', 'fashion', 'ملابس، أحذية، حقائب، واكسسوارات', CURRENT_TIMESTAMP),
  (9, 'جمال', 'beauty', 'مستحضرات تجميل، عطور، ومنتجات العناية', CURRENT_TIMESTAMP),
  (10, 'رياضة', 'sports', 'معدات رياضية، ملابس رياضية، وأدوات تمارين', CURRENT_TIMESTAMP),
  (11, 'ألعاب', 'games', 'ألعاب فيديو، ألعاب أطفال، وهوايات', CURRENT_TIMESTAMP),
  (12, 'أدوات', 'tools', 'أدوات يدوية، معدات، وأدوات مهنية', CURRENT_TIMESTAMP),
  (13, 'كتب', 'books', 'كتب، مجلات، وأدوات مكتبية', CURRENT_TIMESTAMP),
  (14, 'هدايا', 'gifts', 'هدايا، مناسبات خاصة، وتغليف', CURRENT_TIMESTAMP),
  (15, 'زراعة', 'agriculture', 'نباتات، بذور، معدات زراعية، ومستلزمات', CURRENT_TIMESTAMP),
  (16, 'دراجات', 'bikes', 'دراجات هوائية، دراجات نارية، وملحقاتها', CURRENT_TIMESTAMP),
  (17, 'صحة', 'health', 'مستلزمات طبية، أجهزة طبية، وأدوية', CURRENT_TIMESTAMP),
  (18, 'أحذية', 'shoes', 'أحذية رجالية، أحذية نسائية، وأحذية أطفال', CURRENT_TIMESTAMP),
  (19, 'حقائب', 'bags', 'حقائب يد، حقائب سفر، وحقائب مدرسية', CURRENT_TIMESTAMP),
  (20, 'مجوهرات', 'jewelry', 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات', CURRENT_TIMESTAMP),
  (21, 'طفلك', 'baby-supplies', 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية', CURRENT_TIMESTAMP),
  (22, 'وظائف', 'jobs', 'فرص عمل، وظائف شاغرة، وتوظيف', CURRENT_TIMESTAMP);

ALTER TABLE public.products
  ALTER COLUMN "categoryId" TYPE INTEGER USING "categoryId"::INTEGER,
  ADD COLUMN "sellerId" TEXT,
  ADD COLUMN "salesCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "approvalStatus" public."ProductApprovalStatus" NOT NULL DEFAULT 'APPROVED';

ALTER TABLE public.products
  ADD CONSTRAINT "products_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES public."Category"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "products_sellerId_idx" ON public.products("sellerId");
CREATE INDEX "products_salesCount_idx" ON public.products("salesCount");
CREATE INDEX "products_isActive_idx" ON public.products("isActive");
CREATE INDEX "products_approvalStatus_isActive_createdAt_idx"
  ON public.products("approvalStatus", "isActive", "createdAt");

DO $repair$
BEGIN
  IF (SELECT COUNT(*) FROM public."Category") <> 22 THEN
    RAISE EXCEPTION 'Expected 22 active catalog categories after repair.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'categoryId'
      AND data_type = 'integer'
  ) THEN
    RAISE EXCEPTION 'products.categoryId was not converted to integer.';
  END IF;
END
$repair$;

COMMIT;
