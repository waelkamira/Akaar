import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const {
      searchQuery = "",
      categoryId = null,
      filters = {},
      page = 1,
      limit = 10,
    } = body;
console.log("body تم استدعاء الراوت",body)
    // Build the where clause for Prisma
    const where: any = {};

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

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.basePrice = {};
      if (filters.priceMin !== undefined) {
        where.basePrice.gte = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        where.basePrice.lte = filters.priceMax;
      }
    }

    // Apply dynamic filters based on category
    if (categoryId && filters.details) {
      // Construct detail filters.  This part is trickier because Prisma doesn't directly support nested object filtering like this.  You might need to use a raw query for more complex scenarios or restructure your data differently.
      //  This attempts to filter based on exact matches in the `details` JSON object.
      where.details = filters.details; // Warning: This assumes that the details are stored as a JSON object and you want exact matches.  Adjust as needed.

    }

    // Fetch the products and total count from Prisma
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const hasMore = (page * limit) < totalCount;
    // Return the results
    return NextResponse.json({
      products: products,
      totalCount,
      hasMore,
      page,
      limit,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your search" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after operation.
  }
}