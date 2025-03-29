import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const {
      searchQuery = '',
      categoryId = null,
      filters = {},
      page = 1,
      limit = 10,
    } = body;
    console.log('body تم استدعاء الراوت', body);

    // Build the where clause for Prisma
    const where = {};

    // Filter by search query (title or description)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    // Apply static filters
    if (filters.city) {
      where.city = filters.city;
    }

    if (filters.town) {
      where.town = filters.town;
    }

    // تطبيق فلتر نطاق السعر
    if (filters.priceRange) {
      where.basePrice = {};
      switch (filters.priceRange) {
        case 'أقل من 100 ألف':
          where.basePrice.lt = 100000;
          break;
        case '100 ألف - 500 ألف':
          where.basePrice.gte = 100000;
          where.basePrice.lte = 500000;
          break;
        case '500 ألف - مليون':
          where.basePrice.gte = 500000;
          where.basePrice.lte = 1000000;
          break;
        case 'مليون - 5 مليون':
          where.basePrice.gte = 1000000;
          where.basePrice.lte = 5000000;
          break;
        case 'أكثر من 5 مليون':
          where.basePrice.gt = 5000000;
          break;
        default:
          // إذا تم تحديد نطاق سعر مخصص
          if (
            filters.priceMin !== undefined ||
            filters.priceMax !== undefined
          ) {
            if (filters.priceMin !== undefined) {
              where.basePrice.gte = Number(filters.priceMin);
            }
            if (filters.priceMax !== undefined) {
              where.basePrice.lte = Number(filters.priceMax);
            }
          }
      }
    } else if (
      filters.priceMin !== undefined ||
      filters.priceMax !== undefined
    ) {
      // التعامل مع حالة إدخال السعر يدوياً
      where.basePrice = {};
      if (filters.priceMin !== undefined) {
        where.basePrice.gte = Number(filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        where.basePrice.lte = Number(filters.priceMax);
      }
    }

    // Apply dynamic filters based on category
    if (categoryId && filters.details) {
      where.AND = Object.entries(filters.details)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ''
        )
        .map(([key, value]) => ({
          details: {
            path: [key],
            equals: value,
          },
        }));
    }

    console.log('Search conditions:', JSON.stringify(where, null, 2));

    // Fetch the products and total count from Prisma
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const hasMore = page * limit < totalCount;
    console.log('totalCount', totalCount);
    console.log('hasMore', hasMore);
    // console.log('products', products);
    // Return the results
    return NextResponse.json({
      products: products,
      totalCount,
      hasMore,
      page,
      limit,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في البحث حاول مرة اخرى' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after operation.
  }
}
