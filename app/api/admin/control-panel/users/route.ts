import { NextResponse } from 'next/server';
import { getPagination } from '@/lib/api/validation.mjs';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { getPlatformRole } from '@/lib/auth/roles.mjs';

export async function GET(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.users.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });

  try {
    const [items, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          email: true,
          userName: true,
          status: true,
          createdAt: true,
          roles: {
            where: { scopeType: 'PLATFORM', scopeId: null },
            select: { role: { select: { name: true } } },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      items: items.map(({ roles, ...user }) => ({ ...user, role: getPlatformRole(roles) })),
      page,
      limit,
      totalCount,
      hasMore: skip + items.length < totalCount,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load control panel users:', error);
    return NextResponse.json({ error: 'تعذر تحميل المستخدمين.' }, { status: 500 });
  }
}
