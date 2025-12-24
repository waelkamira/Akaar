require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// بيانات المستخدمين الوهميين - محدث حسب المخطط الجديد
const dummyUsers = [
  {
    id: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    userName: 'wael', // تم التصحيح من username إلى userName
    email: 'user1@demo.com',
    password: 'hashed_password_1',
    roleId: null,
    userImage: 'images/placeholder.jpg',
  },
  {
    id: 'c3b5g4gb-3cc8-5g08-96ec-5gb64c692cd5',
    userName: 'sara', // تم التصحيح من username إلى userName
    email: 'user2@demo.com',
    password: 'hashed_password_2',
    roleId: null,
    userImage: 'images/placeholder.jpg',
  },
];

// بيانات البوستات المتنوعة - محدث حسب المخطط الجديد
const generateDummyProducts = () => {
  const products = [];
  const cities = ['دمشق', 'حلب', 'حمص', 'اللاذقية', 'درعا'];
  const towns = [
    'المنطقة الشرقية',
    'المنطقة الغربية',
    'المنطقة الشمالية',
    'المنطقة الجنوبية',
    'المنطقة الوسطى',
  ];

  // إضافة منتجات السيارات
  for (let i = 1; i <= 200; i++) {
    const userIndex = i % 2;
    const user = dummyUsers[userIndex];

    products.push({
      title: `سيارة ${i} ${i % 2 === 0 ? 'للبيع' : 'للإيجار'}`,
      description: `وصف لسيارة ${i} ${i % 2 === 0 ? 'المعروضة للبيع' : 'المعروضة للإيجار'}.`,
      userId: user.id, // يجب أن يتطابق مع ID موجود في جدول User
      userName: user.userName,
      userImage: '/placeholder.jpg',
      categoryId: 2,
      categoryName: 'سيارات',
      images: [
        `https://picsum.photos/seed/car${i}a/600/400`,
        `https://picsum.photos/seed/car${i}b/600/400`,
        `https://picsum.photos/seed/car${i}c/600/400`,
      ],
      basePrice: 100000 + i * 20000,
      adCategory: i % 2 === 0 ? 'بيع' : 'إيجار',
      city: cities[i % cities.length],
      town: towns[i % towns.length],
      phoneNumber: `093${1000000 + i}`,
      details: {
        brand: i % 2 === 0 ? 'تويوتا' : 'هوندا',
        model: `${2020 + i}`,
        year: 2020 + i,
        mileage: 50000 + i * 1000,
        fuelType: 'بنزين',
      },
      stockQuantity: (i % 5) + 1,
    });
  }

  // إضافة منتجات الهواتف
  for (let i = 1; i <= 200; i++) {
    const userIndex = i % 2;
    const user = dummyUsers[userIndex];

    products.push({
      title: `هاتف ${i} ${i % 2 === 0 ? 'للبيع' : 'للإيجار'}`,
      description: `وصف لهاتف ${i} ${i % 2 === 0 ? 'المعروض للبيع' : 'المعروض للإيجار'}.`,
      userId: user.id,
      userName: user.userName,
      userImage: '/placeholder.jpg',
      categoryId: 3,
      categoryName: 'هواتف',
      images: [
        `https://picsum.photos/seed/phone${i}a/600/400`,
        `https://picsum.photos/seed/phone${i}b/600/400`,
        `https://picsum.photos/seed/phone${i}c/600/400`,
      ],
      basePrice: 500 + i * 100,
      adCategory: i % 2 === 0 ? 'بيع' : 'إيجار',
      city: cities[i % cities.length],
      town: towns[i % towns.length],
      phoneNumber: `093${2000000 + i}`,
      details: {
        brand: i % 2 === 0 ? 'Samsung' : 'Apple',
        model: `${2022 + i}`,
        storage: `${64 + i * 32}GB`,
        color: i % 2 === 0 ? 'أسود' : 'أبيض',
      },
      stockQuantity: (i % 5) + 1,
    });
  }

  // إضافة منتجات أجهزة الكمبيوتر
  for (let i = 1; i <= 200; i++) {
    const userIndex = i % 2;
    const user = dummyUsers[userIndex];

    products.push({
      title: `جهاز كمبيوتر ${i} ${i % 2 === 0 ? 'للبيع' : 'للإيجار'}`,
      description: `وصف لجهاز الكمبيوتر ${i} ${i % 2 === 0 ? 'المعروض للبيع' : 'المعروض للإيجار'}.`,
      userId: user.id,
      userName: user.userName,
      userImage: '/placeholder.jpg',
      categoryId: 4,
      categoryName: 'كمبيوتر',
      images: [
        `https://picsum.photos/seed/pc${i}a/600/400`,
        `https://picsum.photos/seed/pc${i}b/600/400`,
        `https://picsum.photos/seed/pc${i}c/600/400`,
      ],
      basePrice: 2000 + i * 300,
      adCategory: i % 2 === 0 ? 'بيع' : 'إيجار',
      city: cities[i % cities.length],
      town: towns[i % towns.length],
      phoneNumber: `093${3000000 + i}`,
      details: {
        brand: i % 2 === 0 ? 'Dell' : 'HP',
        processor: `Intel i${5 + i}`,
        ram: `${8 + i * 4}GB`,
        storage: `${256 + i * 128}GB SSD`,
      },
      stockQuantity: (i % 5) + 1,
    });
  }

  return products;
};

async function main() {
  try {
    console.log('🌱 بدء عملية البذور...');

    // 1. تنظيف البيانات القديمة بترتيب صحيح لتجنب أخطاء المفتاح الخارجي
    console.log('🧹 تنظيف البيانات القديمة...');

    // حذف البيانات بالترتيب الصحيح لتجنب انتهاك القيود
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('✅ تم تنظيف البيانات القديمة');

    // 2. إنشاء المستخدمين الوهميين أولاً
    console.log('👥 إنشاء المستخدمين...');
    for (const user of dummyUsers) {
      try {
        await prisma.user.create({
          data: {
            id: user.id,
            userName: user.userName, // التأكد من استخدام userName وليس username
            email: user.email,
            password: user.password,
            roleId: user.roleId,
            userImage: '/placeholder.jpg',
          },
        });
        console.log(`✅ تم إنشاء المستخدم: ${user.email}`);
      } catch (error) {
        console.error(`❌ خطأ في إنشاء المستخدم ${user.email}:`, error.message);
        // في حالة وجود خطأ، قد يكون المستخدم موجوداً بالفعل، لذا نستخدم upsert
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            userName: user.userName,
            userImage: '/placeholder.jpg',
          },
          create: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            password: user.password,
            roleId: user.roleId,
            userImage: '/placeholder.jpg',
          },
        });
        console.log(`✅ تم تحديث المستخدم: ${user.email}`);
      }
    }

    // 3. التأكد من وجود المستخدمين قبل إنشاء المنتجات
    const existingUsers = await prisma.user.findMany();
    if (existingUsers.length === 0) {
      throw new Error('❌ لم يتم إنشاء أي مستخدم، لا يمكن إنشاء المنتجات');
    }

    console.log(`✅ تم العثور على ${existingUsers.length} مستخدم`);

    // 4. إنشاء المنتجات الوهمية
    console.log('📦 إنشاء المنتجات...');
    const dummyProducts = generateDummyProducts();

    let successCount = 0;
    let errorCount = 0;

    for (const [index, product] of dummyProducts.entries()) {
      try {
        // التأكد من أن userId موجود في قاعدة البيانات
        const userExists = await prisma.user.findUnique({
          where: { id: product.userId },
        });

        if (!userExists) {
          console.error(`❌ المستخدم غير موجود: ${product.userId}`);
          errorCount++;
          continue;
        }

        await prisma.product.create({
          data: {
            title: product.title,
            description: product.description,
            userId: product.userId, // التأكد من أن هذا ID موجود في جدول User
            userName: product.userName,
            userImage: product.userImage,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            images: product.images,
            basePrice: product.basePrice,
            adCategory: product.adCategory,
            city: product.city,
            town: product.town,
            phoneNumber: product.phoneNumber,
            details: product.details,
            stockQuantity: product.stockQuantity,
          },
        });

        successCount++;
        console.log(
          `✅ تم إنشاء المنتج ${index + 1}/${dummyProducts.length}: ${product.title}`
        );
      } catch (error) {
        errorCount++;
        console.error(
          `❌ خطأ في إنشاء المنتج ${product.title}:`,
          error.message
        );

        // محاولة بديلة باستخدام upsert
        try {
          await prisma.product.upsert({
            where: {
              title_userId: {
                // افترض أن لديك حقل فريد يجمع بين title و userId
                title: product.title,
                userId: product.userId,
              },
            },
            update: {
              description: product.description,
              userName: product.userName,
              userImage: product.userImage,
              categoryId: product.categoryId,
              categoryName: product.categoryName,
              images: product.images,
              basePrice: product.basePrice,
              adCategory: product.adCategory,
              city: product.city,
              town: product.town,
              phoneNumber: product.phoneNumber,
              details: product.details,
              stockQuantity: product.stockQuantity,
            },
            create: {
              title: product.title,
              description: product.description,
              userId: product.userId,
              userName: product.userName,
              userImage: product.userImage,
              categoryId: product.categoryId,
              categoryName: product.categoryName,
              images: product.images,
              basePrice: product.basePrice,
              adCategory: product.adCategory,
              city: product.city,
              town: product.town,
              phoneNumber: product.phoneNumber,
              details: product.details,
              stockQuantity: product.stockQuantity,
            },
          });
          console.log(`✅ تم تحديث المنتج: ${product.title}`);
          successCount++;
        } catch (retryError) {
          console.error(
            `❌ فشل محاولة التحديث للمنتج ${product.title}:`,
            retryError.message
          );
        }
      }
    }

    console.log('🎉 تمت عملية البذور بنجاح!');
    console.log(
      `📊 النتائج: ${successCount} منتج ناجح, ${errorCount} منتج فاشل`
    );
  } catch (error) {
    console.error('❌ حدث خطأ غير متوقع:', error);
  }
}

main()
  .catch((e) => {
    console.error('❌ فشل عملية البذور:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
