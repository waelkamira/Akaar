import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminUser, getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });

  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          email: true,
          userName: true,
          role: true,
          status: true,
          createdAt: true,
          seller: { select: { storeName: true } },
          _count: { select: { properties: true } },
        },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      items: users,
      page,
      limit,
      totalCount,
      hasMore: skip + users.length < totalCount,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load admin user list:', error);
    return NextResponse.json({ error: 'تعذر تحميل المستخدمين.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }

  const email = payload && typeof payload === 'object' && !Array.isArray(payload)
    && typeof (payload as Record<string, unknown>).email === 'string'
    ? (payload as { email: string }).email.trim().toLowerCase()
    : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'عنوان البريد الإلكتروني غير صالح.' }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: 'يوجد حساب بهذا البريد بالفعل. غيّر دوره من قائمة المستخدمين.' }, { status: 409 });
    }

    await prisma.user.create({
      data: { email, role: 'ADMIN', status: 'ACTIVE' },
      select: { id: true },
    });
    return NextResponse.json({ created: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'يوجد حساب بهذا البريد بالفعل.' }, { status: 409 });
    }
    console.error('Unable to create administrator account:', error);
    return NextResponse.json({ error: 'تعذر إنشاء حساب المدير.' }, { status: 500 });
  }
}
