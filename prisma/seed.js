/* eslint-disable @typescript-eslint/no-require-imports -- This seed script runs as CommonJS under Node. */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { id: '1', name: 'عقارات', description: 'شقق، فلل، أراضي، مكاتب تجارية وعقارات للبيع والإيجار' },
  { id: '2', name: 'سيارات', description: 'سيارات جديدة ومستعملة، قطع غيار، وخدمات السيارات' },
  { id: '3', name: 'هواتف', description: 'هواتف ذكية، أجهزة لوحية، وملحقاتها' },
  { id: '4', name: 'كمبيوتر', description: 'أجهزة كمبيوتر، لابتوب، وملحقاتها' },
  { id: '5', name: 'إلكترونيات', description: 'تلفزيونات، أجهزة صوت، وإلكترونيات منزلية' },
  { id: '6', name: 'أثاث', description: 'أثاث غرف، مفروشات، وديكورات منزلية' },
  { id: '7', name: 'مطبخ', description: 'أدوات مطبخ، أجهزة منزلية، ومستلزمات المنزل' },
  { id: '8', name: 'موضة', description: 'ملابس، أحذية، حقائب، واكسسوارات' },
  { id: '9', name: 'جمال', description: 'مستحضرات تجميل، عطور، ومنتجات العناية' },
  { id: '10', name: 'رياضة', description: 'معدات رياضية، ملابس رياضية، وأدوات تمارين' },
  { id: '11', name: 'ألعاب', description: 'ألعاب فيديو، ألعاب أطفال، وهوايات' },
  { id: '12', name: 'أدوات', description: 'أدوات يدوية، معدات، وأدوات مهنية' },
  { id: '13', name: 'كتب', description: 'كتب، مجلات، وأدوات مكتبية' },
  { id: '14', name: 'هدايا', description: 'هدايا، مناسبات خاصة، وتغليف' },
  { id: '15', name: 'زراعة', description: 'نباتات، بذور، معدات زراعية، ومستلزمات' },
  { id: '16', name: 'دراجات', description: 'دراجات هوائية، دراجات نارية، وملحقاتها' },
  { id: '17', name: 'صحة', description: 'مستلزمات طبية، أجهزة طبية، وأدوية' },
  { id: '18', name: 'أحذية', description: 'أحذية رجالية، أحذية نسائية، وأحذية أطفال' },
  { id: '19', name: 'حقائب', description: 'حقائب يد، حقائب سفر، وحقائب مدرسية' },
  { id: '20', name: 'مجوهرات', description: 'مجوهرات ذهبية، مجوهرات فضية، واكسسوارات' },
  { id: '21', name: 'طفلك', description: 'ملابس أطفال، ألعاب أطفال، ومستلزمات الرعاية' },
  { id: '22', name: 'وظائف', description: 'فرص عمل، وظائف شاغرة، وتوظيف' },
];

// This seed targets the legacy text-ID Category model. Never run it as a production schema diagnostic.
async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description,
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
