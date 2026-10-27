import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAdminUser } from '@/lib/auth/require-auth';

const MAX_PAGE_SIZE = 100;
const userSelect = {
  id: true,
  email: true,
  userName: true,
  userImage: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

function parsePositiveInteger(value, fallback, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export async function GET(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parsePositiveInteger(searchParams.get('page'), 1);
    const limit = parsePositiveInteger(searchParams.get('limit'), 20, MAX_PAGE_SIZE);
    const searchQuery = (searchParams.get('searchQuery') || '').trim().slice(0, 120);
    const where = searchQuery
      ? { OR: [
          { email: { contains: searchQuery, mode: 'insensitive' } },
          { userName: { contains: searchQuery, mode: 'insensitive' } },
        ] }
      : {};

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      page,
      limit,
      totalCount,
      hasMore: page * limit < totalCount,
    });
  } catch (error) {
    console.error('Admin user listing failed:', error);
    return NextResponse.json({ error: 'Unable to load users.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    if (!id) {
      return NextResponse.json({ error: 'A valid user id is required.' }, { status: 400 });
    }

    const data = {};
    if (typeof body.userName === 'string') data.userName = body.userName.trim().slice(0, 100);
    if (typeof body.userImage === 'string' || body.userImage === null) data.userImage = body.userImage;
    if (body.role && ['CUSTOMER', 'SELLER', 'ADMIN', 'GUEST'].includes(body.role)) data.role = body.role;
    if (body.status && ['ACTIVE', 'SUSPENDED', 'DELETED'].includes(body.status)) data.status = body.status;

    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
    }
    if (id === admin.id && (data.role && data.role !== 'ADMIN' || data.status && data.status !== 'ACTIVE')) {
      return NextResponse.json({ error: 'You cannot remove your own admin access or suspend your account.' }, { status: 400 });
    }

    const user = await prisma.user.update({ where: { id }, data, select: userSelect });
    return NextResponse.json({ user });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    console.error('Admin user update failed:', error);
    return NextResponse.json({ error: 'Unable to update user.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    if (!id) {
      return NextResponse.json({ error: 'A valid user id is required.' }, { status: 400 });
    }
    if (id === admin.id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    await prisma.user.update({ where: { id }, data: { status: 'DELETED' } });
    return NextResponse.json({ deleted: true, id, status: 'DELETED' });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    console.error('Admin user deletion failed:', error);
    return NextResponse.json({ error: 'Unable to delete user.' }, { status: 500 });
  }
}
