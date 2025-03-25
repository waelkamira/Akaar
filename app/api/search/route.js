// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// console.log('تم الاطلاق');


// console.log('تم الاطلاق');

// export async function POST(req) {
//   const body = await req.json();
//   console.log('body', body);
//   const {
//     page = 1, // افتراضيًا، الصفحة تساوي 1
//     limit = 8,
//     searchedKeyword,
//   } = body;

//   try {

//     const skip = page === 1 ? 0 : Math.max(0, (page - 1) * limit);

//     // بحث بسيط بدون فلاتر معقدة
//     const whereCondition = searchedKeyword ? {
//       OR: [
//         { title: { contains: searchedKeyword, mode: 'insensitive' } },
//         { description: { contains: searchedKeyword, mode: 'insensitive' } },
//       ]
//     } : {};

//     // حساب العدد الإجمالي للنتائج
//     const totalCount = await prisma.product.count({
//       where: whereCondition,
//     });

//     // تنفيذ الاستعلام
//     const products = await prisma.product.findMany({
//       where: whereCondition,
//       skip,
//       take: limit,
//       orderBy: { createdAt: 'desc' },
//     });

//     console.log('hasMore:', skip + products.length < totalCount);
//     console.log('totalCount:', totalCount);
//     console.log('products.length:', products.length);

//     // إرجاع النتائج
//     return NextResponse.json({
//       totalCount: totalCount,
//       hasMore: skip + products.length < totalCount,
//       data: products,
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json(
//       { error: `Internal Server Error: ${error.message}` }, // تفاصيل أكثر للخطأ
//       { status: 500 }
//     );
//   } finally {
//     // لا داعي لفصل الاتصال هنا إذا كنت تستخدم PrismaClient بشكل عام
//     await prisma.$disconnect();
//   }
// }

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';

const prisma = new PrismaClient();
console.log('تم الاطلاق');

export async function POST(req) {
  const body = await req.json();
  console.log('body', body);

  const {
    page = 0,
    limit = 8,
    searchedKeyword,
    city,
    town,
    details,
    categoryId,
    minPrice,
    maxPrice,
  } = body;

  try {
    const currentPage = page === 0 || 1 ? 0 : Math.max(0, page);
    const skip = Math.max(0, currentPage * limit);

    let parsedDetails = details;
    if (typeof details === 'string') {
      parsedDetails = JSON.parse(details);
    }

    console.log('Received Filters:', {
      searchedKeyword,
      categoryId,
      city,
      town,
      minPrice,
      maxPrice,
      details: parsedDetails,
    });

    let keywordResults = [];
    let filterResults = [];

    // 🔹 البحث بالكلمات المفتاحية فقط
    if (searchedKeyword) {
      keywordResults = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: searchedKeyword, mode: 'insensitive' } },
            { description: { contains: searchedKeyword, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // 🔹 البحث باستخدام الفلاتر فقط
    const filters = {};
    if (categoryId) filters.categoryId = toInteger(categoryId);
    if (city) filters.city = city;
    if (town) filters.town = town;
    if (minPrice || maxPrice) {
      filters.basePrice = {
        ...(minPrice ? { gte: toInteger(minPrice) } : {}),
        ...(maxPrice ? { lte: toInteger(maxPrice) } : {}),
      };
    }
    if (parsedDetails && typeof parsedDetails === 'object' && Object.keys(parsedDetails).length > 0) {
      filters.AND = Object.entries(parsedDetails).map(([key, value]) => ({
        details: { path: [key], equals: value },
      }));
    }

    filterResults = await prisma.product.findMany({
      where: Object.keys(filters).length > 0 ? filters : {},
      orderBy: { createdAt: 'desc' },
    });

    // 🔹 دمج النتائج وإزالة التكرارات
    const mergedResults = [...new Map([...keywordResults, ...filterResults].map((item) => [item.id, item])).values()];
    
    // 🔹 تطبيق التصفية النهائية
    const totalCount = mergedResults.length;
    const paginatedResults = mergedResults.slice(skip, skip + limit);

    console.log('hasMore:', skip + paginatedResults.length < totalCount);
    console.log('totalCount:', totalCount);
    console.log('products.length:', paginatedResults.length);

    return NextResponse.json({
      totalCount,
      hasMore: skip + paginatedResults.length < totalCount,
      data: paginatedResults,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
