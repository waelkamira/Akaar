/* eslint-disable @typescript-eslint/no-require-imports -- This seed script runs as CommonJS under Node. */
const { PrismaClient } = require('@prisma/client');

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

const sampleProducts = [
  { id: '00000000-0000-4000-8000-000000000001', title: 'هاتف ذكي تجريبي', categoryId: 3, categoryName: 'هواتف', basePrice: 1250000, description: 'هاتف ذكي تجريبي مع مساحة تخزين واسعة وبطارية تدوم طويلًا.' },
  { id: '00000000-0000-4000-8000-000000000002', title: 'سماعات لاسلكية تجريبية', categoryId: 5, categoryName: 'إلكترونيات', basePrice: 185000, description: 'سماعات لاسلكية تجريبية بصوت واضح وعلبة شحن مدمجة.' },
  { id: '00000000-0000-4000-8000-000000000003', title: 'حقيبة ظهر يومية', categoryId: 19, categoryName: 'حقائب', basePrice: 95000, description: 'حقيبة عملية تجريبية للاستخدام اليومي مع جيوب متعددة.' },
  { id: '00000000-0000-4000-8000-000000000004', title: 'مصباح مكتبي قابل للتعديل', categoryId: 6, categoryName: 'أثاث', basePrice: 72000, description: 'مصباح تجريبي بإضاءة مريحة وذراع قابل للتعديل.' },
  { id: '00000000-0000-4000-8000-000000000005', title: 'كرة تدريب رياضية', categoryId: 10, categoryName: 'رياضة', basePrice: 56000, description: 'كرة تدريب تجريبية مناسبة للتمارين والأنشطة الخارجية.' },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: true,
      },
      create: category,
    });
  }

  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN', status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
    select: { id: true, userName: true, userImage: true },
  });
  if (!admin) {
    console.info('Skipping sample products: create an active admin user before running the seed.');
    return;
  }

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: {
        ...product,
        userId: admin.id,
        userName: admin.userName,
        userImage: admin.userImage,
        images: [],
        stockQuantity: 10,
        salesCount: 0,
        isActive: true,
        approvalStatus: 'APPROVED',
        isDeleted: false,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
