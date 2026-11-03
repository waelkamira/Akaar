import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { getPagination } from '@/lib/api/validation.mjs';
import { parseSellerApplicationDetails } from '@/lib/seller/application.mjs';

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  if (type !== 'products' && type !== 'sellers') {
    return NextResponse.json({ error: 'نوع قائمة المراجعة غير صالح.' }, { status: 400 });
  }
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 10, maxLimit: 50 });

  try {
    const [items, totalCount] = type === 'products'
      ? await Promise.all([
          prisma.product.findMany({
            where: { approvalStatus: 'PENDING', isDeleted: false },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
            select: { id: true, title: true, description: true, categoryName: true, basePrice: true, createdAt: true, userName: true, images: true },
          }),
          prisma.product.count({ where: { approvalStatus: 'PENDING', isDeleted: false } }),
        ])
      : await Promise.all([
          prisma.seller.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
            select: {
              id: true,
              userId: true,
              displayName: true,
              slug: true,
              createdAt: true,
              description: true,
              sellerType: true,
              countryCode: true,
              user: { select: { email: true, userName: true, phone: true } },
              verifications: {
                where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } },
                orderBy: [{ submittedAt: 'desc' }, { createdAt: 'desc' }],
                take: 1,
                select: { notes: true },
              },
              documents: { where: { type: 'IDENTITY' }, select: { id: true }, take: 1 },
            },
          }),
          prisma.seller.count({ where: { status: 'PENDING' } }),
        ]).then(([sellers, count]) => [
          sellers.map(({ verifications, documents, userId, displayName, sellerType, countryCode, user, ...seller }) => {
            const application = parseSellerApplicationDetails(verifications[0]?.notes);
            return {
              ...seller,
              userId,
              storeName: displayName,
              businessType: sellerType,
              residence: application?.residence ?? countryCode,
              contactName: application?.contactName ?? user.userName,
              contactEmail: application?.contactEmail ?? user.email,
              phoneNumber: application?.phoneNumber ?? user.phone,
              sellingCategories: application?.sellingCategories ?? null,
              intendedProducts: application?.intendedProducts ?? null,
              hasIdentityDocument: documents.length > 0,
              user: { email: user.email },
            };
          }),
          count,
        ] as const);

    return NextResponse.json({
      items,
      page,
      limit,
      totalCount,
      hasMore: skip + items.length < totalCount,
    });
  } catch (error) {
    console.error('Unable to load admin review queue:', error);
    return NextResponse.json({ error: 'تعذر تحميل قائمة المراجعة.' }, { status: 500 });
  }
}
