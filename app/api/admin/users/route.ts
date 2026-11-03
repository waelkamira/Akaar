import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getAdminUser, getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
<<<<<<< HEAD
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
=======
import { assignPlatformRole, getPlatformRole } from '@/lib/auth/roles.mjs';
import { isAuthEmailConfigured } from '@/lib/auth/email.mjs';
import { issueVerificationEmail } from '@/lib/auth/email-token-service.mjs';
>>>>>>> wael-work-in-progress

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
          status: true,
          createdAt: true,
          seller: { select: { displayName: true } },
          roles: {
            where: { scopeType: 'PLATFORM', scopeId: null },
            select: { role: { select: { name: true } } },
          },
          _count: { select: { ownedProperties: true } },
        },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      items: users.map(({ roles, ...user }) => ({
        ...user,
        role: getPlatformRole(roles),
        seller: user.seller ? { storeName: user.seller.displayName } : null,
        _count: { properties: user._count.ownedProperties },
      })),
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
  const admin = await getControlPanelAdmin('control_panel.users.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const parsedBody = await readJsonBody(request, 16 * 1024);
  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  }
  const payload: unknown = parsedBody.value;

  const body = payload && typeof payload === 'object' && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const userName = typeof body.userName === 'string' ? body.userName.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const role = body.role ?? 'ADMIN';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'عنوان البريد الإلكتروني غير صالح.' }, { status: 400 });
  }
  if (userName.length > 100) {
    return NextResponse.json({ error: 'الاسم أطول من الحد المسموح.' }, { status: 400 });
  }
  const passwordBytes = new TextEncoder().encode(password).length;
  if (passwordBytes < 8 || passwordBytes > 72) {
    return NextResponse.json({ error: 'كلمة المرور مطلوبة ويجب أن تكون بين 8 و72 بايتًا.' }, { status: 400 });
  }
  if (role !== 'CUSTOMER' && role !== 'SELLER' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'دور المستخدم غير صالح.' }, { status: 400 });
  }
  if (role === 'ADMIN' && !(await getControlPanelAdmin('control_panel.roles.manage'))) {
    return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة لتعيين دور المدير.' }, { status: 403 });
  }
  if (!isAuthEmailConfigured()) {
    return NextResponse.json({ error: 'خدمة التحقق من البريد غير مهيأة.' }, { status: 503 });
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: 'يوجد حساب بهذا البريد بالفعل. غيّر دوره من قائمة المستخدمين.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.$transaction(async (transaction) => {
      const created = await transaction.user.create({
        data: { email, userName: userName || null, passwordHash: hashedPassword, status: 'ACTIVE' },
        select: { id: true, email: true, userName: true, status: true },
      });
      await assignPlatformRole(transaction, created.id, role);
      return { ...created, role };
    });
    try {
      await issueVerificationEmail(user.email);
    } catch (error) {
      console.error('Unable to deliver administrator-created account verification:', error);
      return NextResponse.json({
        error: 'تم إنشاء الحساب، لكن تعذر إرسال رابط التحقق. أعد إرسال الرابط بعد قليل.',
      }, { status: 502 });
    }
    return NextResponse.json({ created: true, user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'يوجد حساب بهذا البريد بالفعل.' }, { status: 409 });
    }
    console.error('Unable to create administrator account:', error);
    return NextResponse.json({ error: 'تعذر إنشاء حساب المدير.' }, { status: 500 });
  }
}
