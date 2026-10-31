BEGIN;

DO $repair$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['site_pages', 'daily_site_visits', 'newsletter_subscribers'] LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      RAISE EXCEPTION 'public.% already exists; inspect it before applying this repair.', table_name;
    END IF;
  END LOOP;
END
$repair$;

CREATE TABLE public.site_pages (
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "site_pages_pkey" PRIMARY KEY ("slug")
);

CREATE TABLE public.daily_site_visits (
  "day" DATE NOT NULL,
  "path" TEXT NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "daily_site_visits_pkey" PRIMARY KEY ("day", "path")
);

CREATE TABLE public.newsletter_subscribers (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "confirmationTokenHash" TEXT,
  "unsubscribeTokenHash" TEXT,
  "confirmedAt" TIMESTAMP(3),
  "unsubscribedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON public.newsletter_subscribers("email");
CREATE UNIQUE INDEX "newsletter_subscribers_confirmationTokenHash_key" ON public.newsletter_subscribers("confirmationTokenHash");
CREATE UNIQUE INDEX "newsletter_subscribers_unsubscribeTokenHash_key" ON public.newsletter_subscribers("unsubscribeTokenHash");
CREATE INDEX "newsletter_subscribers_confirmedAt_unsubscribedAt_idx" ON public.newsletter_subscribers("confirmedAt", "unsubscribedAt");

INSERT INTO public.site_pages ("slug", "title", "content", "updatedAt") VALUES
  ('home', 'مرحبًا بك في عقار', E'اكتشف المنتجات، قارن التفاصيل، وتواصل مع البائع المناسب عبر تجربة تسوق عربية واضحة وسهلة.', CURRENT_TIMESTAMP),
  ('about', 'من نحن', E'عقار منصة للإعلانات المبوبة تساعد المستخدمين على استكشاف العروض والتواصل مع أصحابها.\n\nنوفر أدوات لتصفح الإعلانات حسب الفئة والبحث عنها، مع صفحات تعرض تفاصيل الإعلان ومعلومات التواصل التي يضيفها صاحبه.\n\nتُعرض الإعلانات من قبل مستخدمي المنصة. يرجى مراجعة التفاصيل والتواصل مع صاحب الإعلان مباشرة قبل الاتفاق على أي عملية بيع أو شراء.', CURRENT_TIMESTAMP),
  ('terms', 'الشروط والأحكام', E'باستخدام منصة عقار، فإنك توافق على الالتزام بهذه الشروط عند تصفح الإعلانات أو نشرها.\n\nاستخدم المنصة لأغراض مشروعة فقط. أنت مسؤول عن دقة المعلومات التي تقدمها وعن الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك.\n\nالمستخدم الذي ينشر إعلانًا مسؤول عن محتواه ودقته. المنصة تعرض الإعلانات وتيسر التواصل، ولا تضمن حالة المنتجات أو توفرها ولا تكون طرفًا في الاتفاقات التي تتم بين المستخدمين.\n\nلا تنشر محتوى مضللًا أو غير قانوني أو ينتهك حقوق الآخرين.', CURRENT_TIMESTAMP),
  ('privacy', 'سياسة الخصوصية', E'توضح هذه الصفحة بإيجاز أنواع المعلومات التي قد تعالجها منصة عقار عند استخدامك للخدمة.\n\nقد نعالج بيانات الحساب ومعلومات الإعلان وبيانات التواصل التي تقدمها عند التسجيل أو استخدام ميزات المنصة.\n\nتحتفظ سجلات المشاهدة باليوم والمسار العام وعدد المشاهدات المجمع فقط، دون حفظ عناوين IP أو معرفات الزوار.\n\nاشتراك النشرة اختياري ويتطلب تأكيد البريد، ويمكن إلغاؤه في أي وقت.\n\nقد تحفظ بعض ميزات الموقع بيانات محلية في متصفحك، مثل عناصر السلة أو التفضيلات، لتسهيل استمرار تجربتك بين الزيارات.', CURRENT_TIMESTAMP),
  ('help', 'المساعدة والدعم', E'للمساعدة بشأن الحسابات أو المنتجات أو المتاجر، تواصل مع فريق الدعم من خلال صفحة التواصل.', CURRENT_TIMESTAMP),
  ('contact', 'معلومات التواصل', E'تواصل مع فريق الدعم من خلال صفحة التواصل والدعم على الموقع.', CURRENT_TIMESTAMP);

DO $repair$
BEGIN
  IF (SELECT COUNT(*) FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('site_pages', 'daily_site_visits', 'newsletter_subscribers')) <> 3 THEN
    RAISE EXCEPTION 'Site content/analytics table validation failed; transaction will be rolled back.';
  END IF;
END
$repair$;

COMMIT;
