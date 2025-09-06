import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';
import { LRUCache } from 'lru-cache';

// إنشاء كائن LRU Cache للتخزين المؤقت
const cache = new LRUCache({
  max: 100, // الحد الأقصى للعناصر
  ttl: 1000 * 60 * 5, // وقت انتهاء الصلاحية: 5 دقائق
});

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { category } = params;
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  // console.log('category من داخل الدالة', category);
  const fakeData = [
    {
      id: '96a5b419-2513-4a13-ac15-4663f81e295c',
      title:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
      userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
      categoryId: 1,
      categoryName: 'زراعة',
      image1: 'https://i.imgur.com/vGpGUAj.png',
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      basePrice: 0,
      adCategory: null,
      city: 'دمشق',
      town: null,
      phoneNumber: '0938089837',
      lng: null,
      lat: null,
      link: '',
      details: [Object],
      description:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
      stockQuantity: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: ' 2025-03-11T09:27:23.000Z',
      updatedAt: '2025-08-01T11:51:08.335Z',
    },
    {
      id: '96a5b419-2513-4a13-ac15-4663f81e295c',
      title:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
      userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
      categoryId: 1,
      categoryName: 'زراعة',
      image1: 'https://i.imgur.com/vGpGUAj.png',
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      basePrice: 0,
      adCategory: null,
      city: 'دمشق',
      town: null,
      phoneNumber: '0938089837',
      lng: null,
      lat: null,
      link: '',
      details: [Object],
      description:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
      stockQuantity: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: ' 2025-03-11T09:27:23.000Z',
      updatedAt: '2025-08-01T11:51:08.335Z',
    },
    {
      id: '96a5b419-2513-4a13-ac15-4663f81e295c',
      title:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
      userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
      categoryId: 1,
      categoryName: 'زراعة',
      image1: 'https://i.imgur.com/vGpGUAj.png',
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      basePrice: 0,
      adCategory: null,
      city: 'دمشق',
      town: null,
      phoneNumber: '0938089837',
      lng: null,
      lat: null,
      link: '',
      details: [Object],
      description:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
      stockQuantity: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: ' 2025-03-11T09:27:23.000Z',
      updatedAt: '2025-08-01T11:51:08.335Z',
    },
    {
      id: '96a5b419-2513-4a13-ac15-4663f81e295c',
      title:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
      userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
      categoryId: 1,
      categoryName: 'زراعة',
      image1: 'https://i.imgur.com/vGpGUAj.png',
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      basePrice: 0,
      adCategory: null,
      city: 'دمشق',
      town: null,
      phoneNumber: '0938089837',
      lng: null,
      lat: null,
      link: '',
      details: [Object],
      description:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
      stockQuantity: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: ' 2025-03-11T09:27:23.000Z',
      updatedAt: '2025-08-01T11:51:08.335Z',
    },
    {
      id: '96a5b419-2513-4a13-ac15-4663f81e295c',
      title:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
      userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
      categoryId: 1,
      categoryName: 'زراعة',
      image1: 'https://i.imgur.com/vGpGUAj.png',
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      basePrice: 0,
      adCategory: null,
      city: 'دمشق',
      town: null,
      phoneNumber: '0938089837',
      lng: null,
      lat: null,
      link: '',
      details: [Object],
      description:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
      stockQuantity: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: ' 2025-03-11T09:27:23.000Z',
      updatedAt: '2025-08-01T11:51:08.335Z',
    },
    {
      id: '96a5b419-2513-4a13-ac15-4663f81e295c',
      title:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
      userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
      categoryId: 1,
      categoryName: 'زراعة',
      image1: 'https://i.imgur.com/vGpGUAj.png',
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      basePrice: 0,
      adCategory: null,
      city: 'دمشق',
      town: null,
      phoneNumber: '0938089837',
      lng: null,
      lat: null,
      link: '',
      details: [Object],
      description:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
      stockQuantity: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: ' 2025-03-11T09:27:23.000Z',
      updatedAt: '2025-08-01T11:51:08.335Z',
    },
    {
      id: '96a5b419-2513-4a13-ac15-4663f81e295c',
      title:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
      userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
      categoryId: 1,
      categoryName: 'زراعة',
      image1: 'https://i.imgur.com/vGpGUAj.png',
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      basePrice: 0,
      adCategory: null,
      city: 'دمشق',
      town: null,
      phoneNumber: '0938089837',
      lng: null,
      lat: null,
      link: '',
      details: [Object],
      description:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
      stockQuantity: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: ' 2025-03-11T09:27:23.000Z',
      updatedAt: '2025-08-01T11:51:08.335Z',
    },
    {
      id: '96a5b419-2513-4a13-ac15-4663f81e295c',
      title:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
      userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
      categoryId: 1,
      categoryName: 'زراعة',
      image1: 'https://i.imgur.com/vGpGUAj.png',
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      basePrice: 0,
      adCategory: null,
      city: 'دمشق',
      town: null,
      phoneNumber: '0938089837',
      lng: null,
      lat: null,
      link: '',
      details: [Object],
      description:
        'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
      stockQuantity: 1,
      isDeleted: false,
      deletedAt: null,
      createdAt: ' 2025-03-11T09:27:23.000Z',
      updatedAt: '2025-08-01T11:51:08.335Z',
    },
  ];

  // الحصول على قيم الصفحة والحد الأقصى مع قيم افتراضية
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 8;
  const skip = (page - 1) * limit;

  // إنشاء مفتاح للتخزين المؤقت
  const cacheKey = `category_${category}_page_${page}_limit_${limit}`;

  // التحقق من وجود البيانات في التخزين المؤقت
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('✅ تم استرجاع البيانات من التخزين المؤقت:', cacheKey);
    return NextResponse.json(cachedData);
  }

  try {
    // جلب العدد الإجمالي للمنتجات
    const totalCount = await prisma.product.count({
      where: { categoryId: toInteger(category) },
    });

    // جلب المنتجات
    const products = await prisma.product.findMany({
      where: { categoryId: toInteger(category) }, // تصفية البيانات حسب الفئة
      skip, // تخطي عدد معين من العناصر
      take: limit, // الحد الأقصى للعناصر
      orderBy: { createdAt: 'desc' }, // ترتيب العناصر حسب التاريخ
    });

    // إعداد الاستجابة
    const response = {
      // data: products,
      data: fakeData,
      hasMore: skip + products.length < totalCount,
      totalCount, // إضافة totalCount إلى الرد
    };

    // تخزين البيانات في التخزين المؤقت
    cache.set(cacheKey, response);
    console.log('✅ تم تخزين البيانات في التخزين المؤقت:', cacheKey);

    // إرجاع البيانات مع العدد الإجمالي
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ خطأ أثناء جلب البيانات:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // إغلاق اتصال Prisma بعد الانتهاء
  }
}
