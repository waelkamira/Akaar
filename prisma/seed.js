/* eslint-disable @typescript-eslint/no-require-imports -- This seed script runs as CommonJS under Node. */
const { Prisma, PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { id: 'c0000000-0000-4000-8000-000000000001', seedKey: 1, name: 'عقارات', slug: 'real-estate', description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار' },
  { id: 'c0000000-0000-4000-8000-000000000002', seedKey: 2, name: 'سيارات', slug: 'cars', description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات' },
  { id: 'c0000000-0000-4000-8000-000000000003', seedKey: 3, name: 'هواتف', slug: 'phones', description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها' },
  { id: 'c0000000-0000-4000-8000-000000000004', seedKey: 4, name: 'كمبيوتر', slug: 'computers', description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها' },
  { id: 'c0000000-0000-4000-8000-000000000005', seedKey: 5, name: 'إلكترونيات', slug: 'electronics', description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية' },
  { id: 'c0000000-0000-4000-8000-000000000006', seedKey: 6, name: 'أثاث', slug: 'furniture', description: 'أثاث غرف، مفروشات، وديكورات منزلية' },
  { id: 'c0000000-0000-4000-8000-000000000007', seedKey: 7, name: 'مطبخ', slug: 'kitchen', description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل' },
  { id: 'c0000000-0000-4000-8000-000000000008', seedKey: 8, name: 'موضة', slug: 'fashion', description: 'ملابس، أحذية، حقائب، واكسسوارات' },
  { id: 'c0000000-0000-4000-8000-000000000009', seedKey: 9, name: 'جمال', slug: 'beauty', description: 'مستحضرات تجميل، عطور، ومنتجات العناية' },
  { id: 'c0000000-0000-4000-8000-000000000010', seedKey: 10, name: 'رياضة', slug: 'sports', description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين' },
  { id: 'c0000000-0000-4000-8000-000000000011', seedKey: 11, name: 'ألعاب', slug: 'games', description: 'ألعاب فيديو، ألعاب أطفال، وهوايات' },
  { id: 'c0000000-0000-4000-8000-000000000012', seedKey: 12, name: 'أدوات', slug: 'tools', description: 'أدوات يدوية، معدات، وأدوات مهنية' },
  { id: 'c0000000-0000-4000-8000-000000000013', seedKey: 13, name: 'كتب', slug: 'books', description: 'كتب، مجلات، وأدوات مكتبية' },
  { id: 'c0000000-0000-4000-8000-000000000014', seedKey: 14, name: 'هدايا', slug: 'gifts', description: 'هدايا، مناسبات خاصة، وتغليف' },
  { id: 'c0000000-0000-4000-8000-000000000015', seedKey: 15, name: 'زراعة', slug: 'agriculture', description: 'نباتات، بذور، معدات زراعية، ومستلزمات' },
  { id: 'c0000000-0000-4000-8000-000000000016', seedKey: 16, name: 'دراجات', slug: 'bikes', description: 'دراجات هوائية، دراجات نارية، وملحقاتها' },
  { id: 'c0000000-0000-4000-8000-000000000017', seedKey: 17, name: 'صحة', slug: 'health', description: 'مستلزمات طبية، أجهزة طبية، وأدوية' },
  { id: 'c0000000-0000-4000-8000-000000000018', seedKey: 18, name: 'أحذية', slug: 'shoes', description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال' },
  { id: 'c0000000-0000-4000-8000-000000000019', seedKey: 19, name: 'حقائب', slug: 'bags', description: 'حقائب يد، حقائب سفر، وحقائب مدرسية' },
  { id: 'c0000000-0000-4000-8000-000000000020', seedKey: 20, name: 'مجوهرات', slug: 'jewelry', description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات' },
  { id: 'c0000000-0000-4000-8000-000000000021', seedKey: 21, name: 'طفلك', slug: 'baby-supplies', description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية' },
  { id: 'c0000000-0000-4000-8000-000000000022', seedKey: 22, name: 'وظائف', slug: 'jobs', description: 'فرص عمل، وظائف شاغرة، وتوظيف' },
];

const demoSellerProfiles = [
  {
    userId: 'd0000000-0000-4000-8000-000000000001',
    sellerId: 'e0000000-0000-4000-8000-000000000001',
    storeId: 'f0000000-0000-4000-8000-000000000001',
    warehouseId: '90000000-0000-4000-8000-000000000001',
    userName: 'متجر تجريبي الشام',
    email: 'demo.seller.01@example.invalid',
    storeName: 'متجر تجريبي الشام',
    slug: 'demo-al-sham-store',
    sellerSlug: 'demo-al-sham-seller',
    warehouseCode: 'DEMO-AL-SHAM',
    countryCode: 'SY',
  },
  {
    userId: 'd0000000-0000-4000-8000-000000000002',
    sellerId: 'e0000000-0000-4000-8000-000000000002',
    storeId: 'f0000000-0000-4000-8000-000000000002',
    warehouseId: '90000000-0000-4000-8000-000000000002',
    userName: 'متجر تجريبي حلب',
    email: 'demo.seller.02@example.invalid',
    storeName: 'متجر تجريبي حلب',
    slug: 'demo-aleppo-store',
    sellerSlug: 'demo-aleppo-seller',
    warehouseCode: 'DEMO-ALEPPO',
    countryCode: 'SY',
  },
  {
    userId: 'd0000000-0000-4000-8000-000000000003',
    sellerId: 'e0000000-0000-4000-8000-000000000003',
    storeId: 'f0000000-0000-4000-8000-000000000003',
    warehouseId: '90000000-0000-4000-8000-000000000003',
    userName: 'متجر تجريبي بيروت',
    email: 'demo.seller.03@example.invalid',
    storeName: 'متجر تجريبي بيروت',
    slug: 'demo-beirut-store',
    sellerSlug: 'demo-beirut-seller',
    warehouseCode: 'DEMO-BEIRUT',
    countryCode: 'LB',
  },
  {
    userId: 'd0000000-0000-4000-8000-000000000004',
    sellerId: 'e0000000-0000-4000-8000-000000000004',
    storeId: 'f0000000-0000-4000-8000-000000000004',
    warehouseId: '90000000-0000-4000-8000-000000000004',
    userName: 'متجر تجريبي عمّان',
    email: 'demo.seller.04@example.invalid',
    storeName: 'متجر تجريبي عمّان',
    slug: 'demo-amman-store',
    sellerSlug: 'demo-amman-seller',
    warehouseCode: 'DEMO-AMMAN',
    countryCode: 'JO',
  },
  {
    userId: 'd0000000-0000-4000-8000-000000000005',
    sellerId: 'e0000000-0000-4000-8000-000000000005',
    storeId: 'f0000000-0000-4000-8000-000000000005',
    warehouseId: '90000000-0000-4000-8000-000000000005',
    userName: 'متجر تجريبي دبي',
    email: 'demo.seller.05@example.invalid',
    storeName: 'متجر تجريبي دبي',
    slug: 'demo-dubai-store',
    sellerSlug: 'demo-dubai-seller',
    warehouseCode: 'DEMO-DUBAI',
    countryCode: 'AE',
  },
];

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', minorUnits: 2 },
  { code: 'SYP', name: 'Syrian Pound', symbol: 'ل.س', minorUnits: 2 },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', minorUnits: 2 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', minorUnits: 3 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', minorUnits: 2 },
];

const countries = [
  { code: 'SY', name: 'Syria', phoneCode: '+963', currencyCode: 'SYP' },
  { code: 'LB', name: 'Lebanon', phoneCode: '+961', currencyCode: 'LBP' },
  { code: 'JO', name: 'Jordan', phoneCode: '+962', currencyCode: 'JOD' },
  { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971', currencyCode: 'AED' },
];

const categoryFixtures = {
  cars: { productName: 'سيارة عائلية تجريبية', image: 'cars.png', basePrice: 25_000 },
  phones: { productName: 'هاتف ذكي تجريبي', image: 'phones.png', basePrice: 250 },
  computers: { productName: 'حاسوب محمول تجريبي', image: 'computers.png', basePrice: 600 },
  electronics: { productName: 'سماعات لاسلكية تجريبية', image: 'electronics.png', basePrice: 50 },
  furniture: { productName: 'مصباح مكتبي قابل للتعديل', image: 'furniture.png', basePrice: 60 },
  kitchen: { productName: 'جهاز مطبخ عملي تجريبي', image: 'kitchen.png', basePrice: 40 },
  fashion: { productName: 'قطعة أزياء تجريبية', image: 'fashion.png', basePrice: 25 },
  beauty: { productName: 'مجموعة عناية تجريبية', image: 'beauty.png', basePrice: 15 },
  sports: { productName: 'كرة تدريب رياضية', image: 'sports.png', basePrice: 20 },
  games: { productName: 'لعبة تعليمية تجريبية', image: 'games.png', basePrice: 35 },
  tools: { productName: 'عدة أدوات منزلية تجريبية', image: 'tools.png', basePrice: 20 },
  books: { productName: 'كتاب تجريبي', image: 'books.png', basePrice: 8 },
  gifts: { productName: 'هدية مناسبة تجريبية', image: 'gifts.png', basePrice: 10 },
  agriculture: { productName: 'مجموعة زراعة منزلية تجريبية', image: 'agriculture.png', basePrice: 10 },
  bikes: { productName: 'دراجة تجريبية', image: 'bikes.png', basePrice: 150 },
  health: { productName: 'جهاز صحي تجريبي', image: 'health.png', basePrice: 20 },
  shoes: { productName: 'حذاء يومي تجريبي', image: 'shoes.png', basePrice: 25 },
  bags: { productName: 'حقيبة ظهر يومية', image: 'bags.png', basePrice: 30 },
  jewelry: { productName: 'قطعة مجوهرات تجريبية', image: 'jewelry.png', basePrice: 100 },
  'baby-supplies': { productName: 'مستلزمات طفل تجريبية', image: 'babySupplies.png', basePrice: 20 },
};

const legacyProductIds = new Map([
  ['3:0', '00000000-0000-4000-8000-000000000001'],
  ['5:0', '00000000-0000-4000-8000-000000000002'],
  ['19:0', '00000000-0000-4000-8000-000000000003'],
  ['6:0', '00000000-0000-4000-8000-000000000004'],
  ['10:0', '00000000-0000-4000-8000-000000000005'],
]);

function buildDemoProducts() {
  return categories.flatMap((category) => {
    const fixture = categoryFixtures[category.slug];
    if (!fixture) return [];

    return Array.from({ length: 10 }, (_, index) => {
      const seller = demoSellerProfiles[(category.seedKey + index) % demoSellerProfiles.length];
      const serial = String(index + 1).padStart(2, '0');
      const legacyId = legacyProductIds.get(`${category.seedKey}:${index}`);
      const numericId = category.seedKey * 100 + index + 1;
      const id = legacyId || `00000000-0000-4000-8000-${String(numericId).padStart(12, '0')}`;

      return {
        id,
        variantId: `b0000000-0000-4000-8000-${id.slice(-12)}`,
        mediaId: `a0000000-0000-4000-8000-${id.slice(-12)}`,
        title: `${fixture.productName} ${serial}`,
        sellerId: seller.sellerId,
        storeId: seller.storeId,
        warehouseId: seller.warehouseId,
        categoryId: category.id,
        slug: `${category.slug}-${serial}`,
        sku: `DEMO-${category.slug}-${serial}`,
        image: `/images/categories/${fixture.image}`,
        price: fixture.basePrice + index * Math.max(1, Math.round(fixture.basePrice * 0.05)),
        quantity: 10,
        description: `منتج تجريبي للعرض واختبار تجربة التسوق في فئة ${category.name}.`,
      };
    });
  });
}

async function seedGlobalData() {
  for (const name of ['ADMIN', 'SELLER', 'CUSTOMER']) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
  }
}

async function seedSellers() {
  for (const seller of demoSellerProfiles) {
    const userData = {
      userName: seller.userName,
      email: seller.email,
      status: 'ACTIVE',
      emailVerifiedAt: new Date('2025-01-01T00:00:00.000Z'),
    };
    await prisma.user.upsert({
      where: { id: seller.userId },
      update: userData,
      create: { id: seller.userId, ...userData },
    });
    const sellerRole = await prisma.role.findUnique({ where: { name: 'SELLER' }, select: { id: true } });
    const assignment = await prisma.userRoleAssignment.findFirst({
      where: { userId: seller.userId, roleId: sellerRole.id, scopeType: 'PLATFORM', scopeId: null },
      select: { id: true },
    });
    if (!assignment) {
      await prisma.userRoleAssignment.create({
        data: { userId: seller.userId, roleId: sellerRole.id, scopeType: 'PLATFORM' },
      });
    }

    const sellerData = {
      displayName: seller.storeName,
      slug: seller.sellerSlug,
      description: 'متجر تجريبي لعرض بيانات المنصة واختبارها.',
      status: 'ACTIVE',
      isVerified: true,
      countryCode: seller.countryCode,
    };
    await prisma.seller.upsert({
      where: { id: seller.sellerId },
      update: sellerData,
      create: { id: seller.sellerId, userId: seller.userId, ...sellerData },
    });

    await prisma.store.upsert({
      where: { id: seller.storeId },
      update: {
        sellerId: seller.sellerId,
        name: seller.storeName,
        slug: seller.slug,
        description: sellerData.description,
        defaultLanguage: 'ar',
        isActive: true,
      },
      create: {
        id: seller.storeId,
        sellerId: seller.sellerId,
        name: seller.storeName,
        slug: seller.slug,
        description: sellerData.description,
        defaultLanguage: 'ar',
      },
    });

    await prisma.warehouse.upsert({
      where: { id: seller.warehouseId },
      update: {
        sellerId: seller.sellerId,
        name: `${seller.storeName} - المستودع`,
        code: seller.warehouseCode,
        countryCode: seller.countryCode,
        isActive: true,
      },
      create: {
        id: seller.warehouseId,
        sellerId: seller.sellerId,
        name: `${seller.storeName} - المستودع`,
        code: seller.warehouseCode,
        countryCode: seller.countryCode,
      },
    });
  }
}

async function seedProducts(products) {
  const batchSize = 25;
  const validFrom = new Date('2026-01-01T00:00:00.000Z');

  for (let offset = 0; offset < products.length; offset += batchSize) {
    const batch = products.slice(offset, offset + batchSize);
    const operations = batch.flatMap((product) => [
      prisma.product.upsert({
        where: { id: product.id },
        update: {
          storeId: product.storeId,
          title: product.title,
          slug: product.slug,
          description: product.description,
          status: 'APPROVED',
          isActive: true,
          publishedAt: validFrom,
        },
        create: {
          id: product.id,
          storeId: product.storeId,
          title: product.title,
          slug: product.slug,
          description: product.description,
          status: 'APPROVED',
          isActive: true,
          publishedAt: validFrom,
        },
      }),
      prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: product.id,
            categoryId: product.categoryId,
          },
        },
        update: {},
        create: { productId: product.id, categoryId: product.categoryId },
      }),
      prisma.productVariant.upsert({
        where: { id: product.variantId },
        update: {
          productId: product.id,
          sku: product.sku,
          title: 'Standard',
          status: 'ACTIVE',
        },
        create: {
          id: product.variantId,
          productId: product.id,
          sku: product.sku,
          title: 'Standard',
          status: 'ACTIVE',
        },
      }),
      prisma.productPrice.upsert({
        where: {
          variantId_currency_validFrom: {
            variantId: product.variantId,
            currency: 'USD',
            validFrom,
          },
        },
        update: { amount: new Prisma.Decimal(product.price) },
        create: {
          variantId: product.variantId,
          currency: 'USD',
          amount: new Prisma.Decimal(product.price),
          validFrom,
        },
      }),
      prisma.inventory.upsert({
        where: {
          variantId_warehouseId: {
            variantId: product.variantId,
            warehouseId: product.warehouseId,
          },
        },
        update: { onHand: product.quantity, reserved: 0 },
        create: {
          variantId: product.variantId,
          warehouseId: product.warehouseId,
          onHand: product.quantity,
          reserved: 0,
        },
      }),
      prisma.productMedia.upsert({
        where: { id: product.mediaId },
        update: {
          productId: product.id,
          storageKey: product.image,
          altText: product.title,
          sortOrder: 0,
          isPrimary: true,
        },
        create: {
          id: product.mediaId,
          productId: product.id,
          storageKey: product.image,
          altText: product.title,
          sortOrder: 0,
          isPrimary: true,
        },
      }),
    ]);

    await prisma.$transaction(operations);
  }
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_SEED_IN_PRODUCTION !== 'true') {
    throw new Error('Demo data seeding is disabled in production. Set ALLOW_DEMO_SEED_IN_PRODUCTION=true only for an intentional demo environment.');
  }

  await seedGlobalData();
  await prisma.$transaction(
    categories.map(({ id, name, slug, description }) => prisma.category.upsert({
      where: { id },
      update: { name, slug, description, isActive: true },
      create: { id, name, slug, description },
    })),
  );
  await seedSellers();

  const products = buildDemoProducts();
  await seedProducts(products);
  console.info(`Seeded ${products.length} demo products across ${Object.keys(categoryFixtures).length} commerce categories and ${demoSellerProfiles.length} demo sellers.`);
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
