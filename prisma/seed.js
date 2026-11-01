/* eslint-disable @typescript-eslint/no-require-imports -- This seed script runs as CommonJS under Node. */
const { Prisma, PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { id: 1, name: 'عقارات', slug: 'real-estate', description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار' },
  { id: 2, name: 'سيارات', slug: 'cars', description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات' },
  { id: 3, name: 'هواتف', slug: 'phones', description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها' },
  { id: 4, name: 'كمبيوتر', slug: 'computers', description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها' },
  { id: 5, name: 'إلكترونيات', slug: 'electronics', description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية' },
  { id: 6, name: 'أثاث', slug: 'furniture', description: 'أثاث غرف، مفروشات، وديكورات منزلية' },
  { id: 7, name: 'مطبخ', slug: 'kitchen', description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل' },
  { id: 8, name: 'موضة', slug: 'fashion', description: 'ملابس، أحذية، حقائب، واكسسوارات' },
  { id: 9, name: 'جمال', slug: 'beauty', description: 'مستحضرات تجميل، عطور، ومنتجات العناية' },
  { id: 10, name: 'رياضة', slug: 'sports', description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين' },
  { id: 11, name: 'ألعاب', slug: 'games', description: 'ألعاب فيديو، ألعاب أطفال، وهوايات' },
  { id: 12, name: 'أدوات', slug: 'tools', description: 'أدوات يدوية، معدات، وأدوات مهنية' },
  { id: 13, name: 'كتب', slug: 'books', description: 'كتب، مجلات، وأدوات مكتبية' },
  { id: 14, name: 'هدايا', slug: 'gifts', description: 'هدايا، مناسبات خاصة، وتغليف' },
  { id: 15, name: 'زراعة', slug: 'agriculture', description: 'نباتات، بذور، معدات زراعية، ومستلزمات' },
  { id: 16, name: 'دراجات', slug: 'bikes', description: 'دراجات هوائية، دراجات نارية، وملحقاتها' },
  { id: 17, name: 'صحة', slug: 'health', description: 'مستلزمات طبية، أجهزة طبية، وأدوية' },
  { id: 18, name: 'أحذية', slug: 'shoes', description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال' },
  { id: 19, name: 'حقائب', slug: 'bags', description: 'حقائب يد، حقائب سفر، وحقائب مدرسية' },
  { id: 20, name: 'مجوهرات', slug: 'jewelry', description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات' },
  { id: 21, name: 'طفلك', slug: 'baby-supplies', description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية' },
  { id: 22, name: 'وظائف', slug: 'jobs', description: 'فرص عمل، وظائف شاغرة، وتوظيف' },
];

const demoSellerProfiles = [
  {
    userId: 'd0000000-0000-4000-8000-000000000001',
    sellerId: 'e0000000-0000-4000-8000-000000000001',
    userName: 'متجر تجريبي الشام',
    email: 'demo.seller.01@example.invalid',
    storeName: 'متجر تجريبي الشام',
    slug: 'demo-al-sham-store',
    city: 'دمشق',
  },
  {
    userId: 'd0000000-0000-4000-8000-000000000002',
    sellerId: 'e0000000-0000-4000-8000-000000000002',
    userName: 'متجر تجريبي حلب',
    email: 'demo.seller.02@example.invalid',
    storeName: 'متجر تجريبي حلب',
    slug: 'demo-aleppo-store',
    city: 'حلب',
  },
  {
    userId: 'd0000000-0000-4000-8000-000000000003',
    sellerId: 'e0000000-0000-4000-8000-000000000003',
    userName: 'متجر تجريبي بيروت',
    email: 'demo.seller.03@example.invalid',
    storeName: 'متجر تجريبي بيروت',
    slug: 'demo-beirut-store',
    city: 'بيروت',
  },
  {
    userId: 'd0000000-0000-4000-8000-000000000004',
    sellerId: 'e0000000-0000-4000-8000-000000000004',
    userName: 'متجر تجريبي عمّان',
    email: 'demo.seller.04@example.invalid',
    storeName: 'متجر تجريبي عمّان',
    slug: 'demo-amman-store',
    city: 'عمّان',
  },
  {
    userId: 'd0000000-0000-4000-8000-000000000005',
    sellerId: 'e0000000-0000-4000-8000-000000000005',
    userName: 'متجر تجريبي دبي',
    email: 'demo.seller.05@example.invalid',
    storeName: 'متجر تجريبي دبي',
    slug: 'demo-dubai-store',
    city: 'دبي',
  },
];

const categoryFixtures = [
  { productName: 'عقار سكني تجريبي', image: 'realEstate.png' },
  { productName: 'سيارة عائلية تجريبية', image: 'cars.png' },
  { productName: 'هاتف ذكي تجريبي', image: 'phones.png' },
  { productName: 'حاسوب محمول تجريبي', image: 'computers.png' },
  { productName: 'سماعات لاسلكية تجريبية', image: 'electronics.png' },
  { productName: 'مصباح مكتبي قابل للتعديل', image: 'furniture.png' },
  { productName: 'جهاز مطبخ عملي تجريبي', image: 'kitchen.png' },
  { productName: 'قطعة أزياء تجريبية', image: 'fashion.png' },
  { productName: 'مجموعة عناية تجريبية', image: 'beauty.png' },
  { productName: 'كرة تدريب رياضية', image: 'sports.png' },
  { productName: 'لعبة تعليمية تجريبية', image: 'games.png' },
  { productName: 'عدة أدوات منزلية تجريبية', image: 'tools.png' },
  { productName: 'كتاب تجريبي', image: 'books.png' },
  { productName: 'هدية مناسبة تجريبية', image: 'gifts.png' },
  { productName: 'مجموعة زراعة منزلية تجريبية', image: 'agriculture.png' },
  { productName: 'دراجة تجريبية', image: 'bikes.png' },
  { productName: 'جهاز صحي تجريبي', image: 'health.png' },
  { productName: 'حذاء يومي تجريبي', image: 'shoes.png' },
  { productName: 'حقيبة ظهر يومية', image: 'bags.png' },
  { productName: 'قطعة مجوهرات تجريبية', image: 'jewelry.png' },
  { productName: 'مستلزمات طفل تجريبية', image: 'babySupplies.png' },
  { productName: 'فرصة عمل تجريبية', image: 'jobs.png' },
];

const legacyProductIds = new Map([
  ['3:0', '00000000-0000-4000-8000-000000000001'],
  ['5:0', '00000000-0000-4000-8000-000000000002'],
  ['19:0', '00000000-0000-4000-8000-000000000003'],
  ['6:0', '00000000-0000-4000-8000-000000000004'],
  ['10:0', '00000000-0000-4000-8000-000000000005'],
]);

function getDemoPrice(categoryId, index) {
  if (categoryId === 1) return 120_000_000 + index * 2_000_000;
  if (categoryId === 2) return 25_000_000 + index * 1_500_000;
  if (categoryId === 22) return 0;
  return 25_000 + categoryId * 7_000 + index * 5_000;
}

function buildDemoProducts() {
  return categories.flatMap((category) => {
    const fixture = categoryFixtures[category.id - 1];
    return Array.from({ length: 10 }, (_, index) => {
      const seller = demoSellerProfiles[(category.id + index) % demoSellerProfiles.length];
      const serial = String(index + 1).padStart(2, '0');
      const legacyId = legacyProductIds.get(`${category.id}:${index}`);

      return {
        id: legacyId || `00000000-0000-4000-8000-${String(category.id * 100 + index + 1).padStart(12, '0')}`,
        title: `${fixture.productName} ${serial}`,
        userId: seller.userId,
        sellerId: seller.sellerId,
        userName: seller.userName,
        userImage: null,
        categoryId: category.id,
        categoryName: category.name,
        images: [`/images/categories/${fixture.image}`],
        basePrice: getDemoPrice(category.id, index),
        adCategory: 'DEMO',
        city: seller.city,
        link: '',
        details: { demo: true },
        description: `منتج تجريبي للعرض واختبار تجربة التسوق في فئة ${category.name}.`,
        stockQuantity: 10,
        salesCount: 0,
        isActive: true,
        approvalStatus: 'APPROVED',
        isDeleted: false,
      };
    });
  });
}

async function seedSellers() {
  for (const seller of demoSellerProfiles) {
    const userData = {
      userName: seller.userName,
      email: seller.email,
      role: 'SELLER',
      status: 'ACTIVE',
    };
    await prisma.user.upsert({
      where: { id: seller.userId },
      update: userData,
      create: { id: seller.userId, ...userData },
    });

    const sellerData = {
      storeName: seller.storeName,
      slug: seller.slug,
      description: 'متجر وحساب تجريبيان لعرض بيانات المنصة واختبارها.',
      contactName: seller.userName,
      contactEmail: seller.email,
      residence: seller.city,
      businessType: 'DEMO',
      sellingCategories: 'متنوعة',
      intendedProducts: 'بيانات تجريبية',
      status: 'ACTIVE',
      isVerified: true,
    };
    await prisma.seller.upsert({
      where: { id: seller.sellerId },
      update: sellerData,
      create: { id: seller.sellerId, userId: seller.userId, ...sellerData },
    });
  }
}

async function seedProducts(products) {
  const batchSize = 25;
  for (let offset = 0; offset < products.length; offset += batchSize) {
    const batch = products.slice(offset, offset + batchSize);
    // The configured legacy database lacks usdPriceCents, so demo inserts only use its existing columns.
    await prisma.$transaction(
      batch.map((product) => prisma.$executeRaw`
        INSERT INTO public.products (
          "id", "title", "userId", "sellerId", "userImage", "userName",
          "categoryId", "categoryName", "images", "basePrice", "adCategory",
          "city", "town", "phoneNumber", "lng", "lat", "link", "details",
          "description", "stockQuantity", "salesCount", "isActive",
          "approvalStatus", "isDeleted", "createdAt", "updatedAt"
        ) VALUES (
          ${product.id}, ${product.title}, ${product.userId}, ${product.sellerId},
          ${product.userImage}, ${product.userName}, ${product.categoryId},
          ${product.categoryName},
          ARRAY[${Prisma.join(product.images.map((image) => Prisma.sql`${image}`))}]::text[],
          ${product.basePrice}, ${product.adCategory}, ${product.city},
          ${product.town}, ${product.phoneNumber}, ${product.lng}, ${product.lat},
          ${product.link}, ${JSON.stringify(product.details)}::jsonb,
          ${product.description}, ${product.stockQuantity}, ${product.salesCount},
          ${product.isActive}, ${product.approvalStatus}::public."ProductApprovalStatus",
          ${product.isDeleted}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT ("id") DO UPDATE SET
          "title" = EXCLUDED."title",
          "userId" = EXCLUDED."userId",
          "sellerId" = EXCLUDED."sellerId",
          "userImage" = EXCLUDED."userImage",
          "userName" = EXCLUDED."userName",
          "categoryId" = EXCLUDED."categoryId",
          "categoryName" = EXCLUDED."categoryName",
          "images" = EXCLUDED."images",
          "basePrice" = EXCLUDED."basePrice",
          "adCategory" = EXCLUDED."adCategory",
          "city" = EXCLUDED."city",
          "town" = EXCLUDED."town",
          "phoneNumber" = EXCLUDED."phoneNumber",
          "lng" = EXCLUDED."lng",
          "lat" = EXCLUDED."lat",
          "link" = EXCLUDED."link",
          "details" = EXCLUDED."details",
          "description" = EXCLUDED."description",
          "stockQuantity" = EXCLUDED."stockQuantity",
          "salesCount" = EXCLUDED."salesCount",
          "isActive" = EXCLUDED."isActive",
          "approvalStatus" = EXCLUDED."approvalStatus",
          "isDeleted" = EXCLUDED."isDeleted",
          "updatedAt" = CURRENT_TIMESTAMP
      `),
    );
  }
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_SEED_IN_PRODUCTION !== 'true') {
    throw new Error('Demo data seeding is disabled in production. Set ALLOW_DEMO_SEED_IN_PRODUCTION=true only for an intentional demo environment.');
  }

  await prisma.$transaction(
    categories.map((category) => prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: true,
      },
      create: category,
    })),
  );
  await seedSellers();

  const products = buildDemoProducts();
  await seedProducts(products);
  console.info(`Seeded ${products.length} demo products across ${categories.length} categories and ${demoSellerProfiles.length} demo sellers.`);
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error('Unable to seed marketplace demo data:', error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}

module.exports = { categories, demoSellerProfiles, buildDemoProducts };
