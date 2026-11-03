import { prisma } from '@/lib/db/prisma';

export async function findPublishedPropertyDetails(id: string) {
  return prisma.property.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      currency: true,
      location: true,
      city: true,
      countryCode: true,
      media: {
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: { storageKey: true },
      },
      type: true,
      status: true,
      attributes: true,
      store: { select: { name: true, slug: true, description: true } },
    },
  });
}

export async function findPublishedPropertyBookingDetails(id: string) {
  return prisma.property.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      city: true,
      location: true,
      media: {
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: { storageKey: true },
      },
      status: true,
    },
  });
}

export async function findPublishedPropertyMetadata(id: string) {
  return prisma.property.findFirst({
    where: { id, isPublished: true },
    select: { title: true, description: true },
  });
}

export async function getAdminPropertyOverview() {
  const [total, byStatus, published, listings] = await Promise.all([
    prisma.property.count(),
    prisma.property.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.property.count({ where: { isPublished: true } }),
    prisma.property.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: 100,
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        location: true,
        city: true,
        status: true,
        isPublished: true,
        createdAt: true,
        owner: { select: { email: true, userName: true } },
        store: { select: { name: true } },
      },
    }),
  ]);
  return { total, byStatus, published, listings };
}
