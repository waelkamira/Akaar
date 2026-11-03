import { prisma } from '@/lib/db/prisma';

const productWhere = {
  isActive: true,
  deletedAt: null,
  publishedAt: { not: null },
  status: 'APPROVED' as const,
  categories: { some: { category: { isActive: true } } },
  variants: { some: { status: 'ACTIVE' as const } },
  store: {
    is: {
      isActive: true,
      seller: { is: { status: 'ACTIVE' as const, isVerified: true } },
    },
  },
};

const propertyWhere = { isPublished: true, status: 'AVAILABLE' as const };
const storeWhere = {
  isActive: true,
  seller: { is: { status: 'ACTIVE' as const, isVerified: true } },
};

export async function getSitemapCounts() {
  return Promise.all([
    prisma.product.count({ where: productWhere }),
    prisma.property.count({ where: propertyWhere }),
    prisma.store.count({ where: storeWhere }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.sitePage.count({ where: { isActive: true } }),
  ]);
}

export function listSitemapProducts(skip: number, take: number) {
  return prisma.product.findMany({
    where: productWhere,
    select: { id: true, updatedAt: true },
    orderBy: { id: 'asc' },
    skip,
    take,
  });
}

export function listSitemapProperties(skip: number, take: number) {
  return prisma.property.findMany({
    where: propertyWhere,
    select: { id: true, updatedAt: true },
    orderBy: { id: 'asc' },
    skip,
    take,
  });
}

export function listSitemapStores(skip: number, take: number) {
  return prisma.store.findMany({
    where: storeWhere,
    select: { slug: true, updatedAt: true },
    orderBy: { id: 'asc' },
    skip,
    take,
  });
}

export function listSitemapCategories(skip: number, take: number) {
  return prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
    orderBy: { id: 'asc' },
    skip,
    take,
  });
}

export function listSitemapPages(skip: number, take: number) {
  return prisma.sitePage.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
    orderBy: { slug: 'asc' },
    skip,
    take,
  });
}
