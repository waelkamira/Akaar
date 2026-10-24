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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
