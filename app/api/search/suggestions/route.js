// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const query = searchParams.get('query');

//     if (!query || query.length < 2) {
//       return NextResponse.json({ suggestions: [] });
//     }

//     // Search in titles and descriptions
//     const products = await prisma.product.findMany({
//       where: {
//         OR: [
//           { title: { contains: query, mode: 'insensitive' } },
//           { description: { contains: query, mode: 'insensitive' } },
//           {
//             details: {
//               path: ['$'],
//               string_contains: query,
//               mode: 'insensitive',
//             },
//           },
//         ],
//         isDeleted: false,
//       },
//       select: {
//         title: true,
//         description: true,
//         details: true,
//       },
//       take: 5,
//     });

//     // Extract unique suggestions from titles and descriptions
//     const suggestions = new Set();
//     products.forEach((product) => {
//       if (product.title) suggestions.add(product.title);
//       if (product.description) suggestions.add(product.description);
//       if (product.details) {
//         Object.values(product.details).forEach((value) => {
//           if (typeof value === 'string') suggestions.add(value);
//         });
//       }
//     });

//     return NextResponse.json({
//       suggestions: Array.from(suggestions).slice(0, 5),
//     });
//   } catch (error) {
//     console.error('Suggestions error:', error);
//     return NextResponse.json(
//       { error: 'حدث خطأ في جلب الاقتراحات' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cache للنتائج لتحسين الأداء
const suggestionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // التحقق من وجود النتائج في الـ cache
    const cacheKey = query.toLowerCase();
    const cached = suggestionCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ suggestions: cached.suggestions });
    }

    // البحث في العناوين والأوصاف
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        isDeleted: false,
      },
      select: {
        title: true,
      },
      take: 8,
      distinct: ['title'], // تجنب التكرار
    });

    // استخراج الاقتراحات من العناوين فقط (لتحسين الدقة)
    const suggestions = products
      .map((product) => product.title)
      .filter(Boolean);

    // تخزين النتائج في الـ cache
    suggestionCache.set(cacheKey, {
      suggestions,
      timestamp: Date.now(),
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الاقتراحات' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import Fuse from 'fuse.js';

// const prisma = new PrismaClient();

// // تكوين Fuse.js للبحث الضبابي
// const fuseOptions = {
//   includeScore: true,
//   threshold: 0.3,
//   keys: ['title', 'description', 'tags'],
// };

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const {
//       query = '',
//       categoryId = null,
//       filters = {},
//       page = 1,
//       limit = 8,
//       sortBy = 'createdAt',
//       sortOrder = 'desc',
//     } = body;

//     // بناء شروط البحث
//     const where = await buildSearchConditions(query, categoryId, filters);

//     // البحث باستخدام Prisma مع ترتيب النتائج
//     const [products, totalCount] = await Promise.all([
//       prisma.product.findMany({
//         where,
//         skip: (page - 1) * limit,
//         take: limit,
//         orderBy: { [sortBy]: sortOrder },
//         include: {
//           category: true,
//           seller: {
//             select: {
//               id: true,
//               name: true,
//               rating: true,
//             },
//           },
//         },
//       }),
//       prisma.product.count({ where }),
//     ]);

//     // تطبيق البحث الضبابي إذا كان هناك استعلام
//     let finalProducts = products;
//     if (query.trim()) {
//       const fuse = new Fuse(products, fuseOptions);
//       const fuzzyResults = fuse.search(query);
//       finalProducts = fuzzyResults.map((result) => result.item);
//     }

//     // حساب الإحصاءات للنتائج
//     const remainingCount = totalCount - page * limit;
//     const hasMore = remainingCount > 0;
//     const totalPages = Math.ceil(totalCount / limit);

//     return NextResponse.json({
//       products: finalProducts,
//       totalCount,
//       hasMore,
//       page,
//       limit,
//       totalPages,
//       remainingCount,
//     });
//   } catch (error) {
//     console.error('Search error:', error);
//     return NextResponse.json(
//       { error: 'حدث خطأ في البحث، حاول مرة أخرى' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // دالة مساعدة لبناء شروط البحث
// async function buildSearchConditions(query, categoryId, filters) {
//   const where = { AND: [] };

//   // إضافة شروط البحث النصي
//   if (query) {
//     where.AND.push({
//       OR: [
//         { title: { contains: query, mode: 'insensitive' } },
//         { description: { contains: query, mode: 'insensitive' } },
//         { tags: { has: query } },
//       ],
//     });
//   }

//   // إضافة شروط التصنيف
//   if (categoryId) {
//     where.AND.push({ categoryId: Number(categoryId) });
//   }

//   // إضافة الفلاتر الأساسية
//   if (filters.city) where.AND.push({ city: filters.city });
//   if (filters.town) where.AND.push({ town: filters.town });

//   // تطبيق فلتر السعر
//   applyPriceFilter(where, filters);

//   // تطبيق الفلاتر الديناميكية
//   if (categoryId && filters.details) {
//     applyDynamicFilters(where, filters.details);
//   }

//   return where.AND.length > 0 ? where : {};
// }

// // تطبيق فلتر السعر
// function applyPriceFilter(where, filters) {
//   if (filters.priceRange) {
//     const priceCondition = {};
//     switch (filters.priceRange) {
//       case 'أقل من 100 ألف':
//         priceCondition.lt = 100000;
//         break;
//       case '100 ألف - 500 ألف':
//         priceCondition.gte = 100000;
//         priceCondition.lte = 500000;
//         break;
//       case '500 ألف - مليون':
//         priceCondition.gte = 500000;
//         priceCondition.lte = 1000000;
//         break;
//       case 'مليون - 5 مليون':
//         priceCondition.gte = 1000000;
//         priceCondition.lte = 5000000;
//         break;
//       case 'أكثر من 5 مليون':
//         priceCondition.gt = 5000000;
//         break;
//     }
//     if (Object.keys(priceCondition).length > 0) {
//       where.AND.push({ basePrice: priceCondition });
//     }
//   } else if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
//     const priceCondition = {};
//     if (filters.priceMin !== undefined)
//       priceCondition.gte = Number(filters.priceMin);
//     if (filters.priceMax !== undefined)
//       priceCondition.lte = Number(filters.priceMax);
//     if (Object.keys(priceCondition).length > 0) {
//       where.AND.push({ basePrice: priceCondition });
//     }
//   }
// }

// // تطبيق الفلاتر الديناميكية
// function applyDynamicFilters(where, details) {
//   const detailConditions = Object.entries(details)
//     .filter(
//       ([_, value]) => value !== undefined && value !== null && value !== ''
//     )
//     .map(([key, value]) => ({
//       details: {
//         path: [key],
//         equals: String(value),
//       },
//     }));

//   if (detailConditions.length > 0) {
//     where.AND.push(...detailConditions);
//   }
// }
