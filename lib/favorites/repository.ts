import { prisma } from '@/lib/db/prisma';

export type FavoriteProduct = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  basePrice: number | null;
  stockQuantity: number | null;
  city: string | null;
  town: string | null;
  createdAt: Date;
  categoryId: number;
  categoryName: string;
};

export async function listFavoriteProducts(userId: string, page: number, limit: number) {
  const [countRows, products] = await Promise.all([
    prisma.$queryRaw<Array<{ totalCount: number }>>`
      SELECT COUNT(*)::int AS "totalCount"
      FROM public.favorites AS favorite
      INNER JOIN public.products AS product
        ON product.id = favorite."productId"
      INNER JOIN public."Category" AS category
        ON category.id = product."categoryId"
      WHERE favorite."userId" = ${userId}
        AND favorite."isDeleted" = false
        AND product."isDeleted" = false
        AND product."isActive" = true
        AND product."approvalStatus" = 'APPROVED'
        AND category."isActive" = true
    `,
    prisma.$queryRaw<FavoriteProduct[]>`
      SELECT
        product.id,
        product.title,
        product.description,
        product.images,
        product."basePrice",
        product."stockQuantity",
        product.city,
        product.town,
        product."createdAt",
        product."categoryId",
        product."categoryName"
      FROM public.favorites AS favorite
      INNER JOIN public.products AS product
        ON product.id = favorite."productId"
      INNER JOIN public."Category" AS category
        ON category.id = product."categoryId"
      WHERE favorite."userId" = ${userId}
        AND favorite."isDeleted" = false
        AND product."isDeleted" = false
        AND product."isActive" = true
        AND product."approvalStatus" = 'APPROVED'
        AND category."isActive" = true
      ORDER BY favorite."createdAt" DESC, favorite.id DESC
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `,
  ]);
  return { totalCount: countRows[0]?.totalCount ?? 0, products };
}
