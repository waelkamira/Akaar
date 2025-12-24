import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const {
      query = '',
      categoryId = null,
      filters = {},
      page = 1,
      limit = 20,
    } = body;
    console.log('body تم استدعاء الراوت', body);

    // Build the where clause for Prisma
    const where = {
      AND: [],
    };

    // Filter by category only if there's no search query
    if (categoryId && !query) {
      where.AND.push({ categoryId: Number(categoryId) });
    }

    // Apply keyword search
    if (query) {
      where.AND.push({
        OR: [{ title: { contains: query, mode: 'insensitive' } }],
      });
    }

    // Apply static filters
    if (filters.city) {
      where.AND.push({ city: filters.city });
    }

    if (filters.town) {
      where.AND.push({ town: filters.town });
    }

    // تطبيق فلتر نطاق السعر
    if (filters.priceRange) {
      const priceCondition = {};
      switch (filters.priceRange) {
        case 'أقل من 100 ألف':
          priceCondition.lt = 100000;
          break;
        case '100 ألف - 500 ألف':
          priceCondition.gte = 100000;
          priceCondition.lte = 500000;
          break;
        case '500 ألف - مليون':
          priceCondition.gte = 500000;
          priceCondition.lte = 1000000;
          break;
        case 'مليون - 5 مليون':
          priceCondition.gte = 1000000;
          priceCondition.lte = 5000000;
          break;
        case 'أكثر من 5 مليون':
          priceCondition.gt = 5000000;
          break;
        default:
          // إذا تم تحديد نطاق سعر مخصص
          if (
            filters.priceMin !== undefined ||
            filters.priceMax !== undefined
          ) {
            if (filters.priceMin !== undefined) {
              priceCondition.gte = Number(filters.priceMin);
            }
            if (filters.priceMax !== undefined) {
              priceCondition.lte = Number(filters.priceMax);
            }
          }
      }
      if (Object.keys(priceCondition).length > 0) {
        where.AND.push({ basePrice: priceCondition });
      }
    } else if (
      filters.priceMin !== undefined ||
      filters.priceMax !== undefined
    ) {
      const priceCondition = {};
      if (filters.priceMin !== undefined) {
        priceCondition.gte = Number(filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        priceCondition.lte = Number(filters.priceMax);
      }
      if (Object.keys(priceCondition).length > 0) {
        where.AND.push({ basePrice: priceCondition });
      }
    }

    // Apply dynamic filters based on category
    if (categoryId && filters.details) {
      const detailConditions = Object.entries(filters.details)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ''
        )
        .map(([key, value]) => ({
          details: {
            path: [key],
            equals: String(value),
          },
        }));

      if (detailConditions.length > 0) {
        where.AND.push(...detailConditions);
      }
    }

    // If no conditions were added, remove the AND array
    if (where.AND.length === 0) {
      delete where.AND;
    }

    console.log('Search conditions:', JSON.stringify(where, null, 2));

    // Fetch the products and total count from Prisma
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate if there are more results after the current page
    const remainingCount = totalCount - page * limit;
    const hasMore = remainingCount > 0;

    console.log('totalCount:', totalCount);
    // console.log('products:', products);
    // console.log('currentPage:', page);
    // console.log('remainingCount:', remainingCount);
    // console.log('hasMore:', hasMore);

    // Return the results
    return NextResponse.json({
      products: products,
      totalCount,
      hasMore,
      page,
      limit,
      remainingCount,
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
