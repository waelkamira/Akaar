import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAdminUser } from '@/lib/auth/require-auth';
import { getPagination, isPaginationOffsetOutOfRange } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isValidProfileImage } from '@/lib/api/profile-image.mjs';

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

export async function GET(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams, {
      defaultPage: 1,
      defaultLimit: 20,
      maxLimit: MAX_PAGE_SIZE,
    });
    const searchQuery = (searchParams.get('searchQuery') || '').trim().slice(0, 120);
    const where = searchQuery
      ? { OR: [
          { email: { contains: searchQuery, mode: 'insensitive' } },
          { userName: { contains: searchQuery, mode: 'insensitive' } },
        ] }
      : {};

    // Count first so huge but safe-integer offsets cannot force an expensive page query.
    const totalCount = await prisma.user.count({ where });
    if (isPaginationOffsetOutOfRange(skip, totalCount)) {
      return NextResponse.json({ users: [], page, limit, totalCount, hasMore: false });
    }
    const users = await prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      users,
      page,
      limit,
      totalCount,
      hasMore: skip + users.length < totalCount,
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

    const parsedBody = await readJsonBody(request, 16 * 1024);
    if (!parsedBody.ok) {
      return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
    }
    const body = parsedBody.value;

    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    if (!id) {
      return NextResponse.json({ error: 'A valid user id is required.' }, { status: 400 });
    }

    const data = {};
    if (typeof body.userName === 'string') data.userName = body.userName.trim().slice(0, 100);
    if (Object.prototype.hasOwnProperty.call(body, 'userImage')) {
      if (!isValidProfileImage(body.userImage)) {
        return NextResponse.json({ error: 'Profile image must be a valid HTTP(S) URL or a same-origin path under 2048 characters.' }, { status: 400 });
      }
      data.userImage = body.userImage === null ? null : body.userImage.trim();
    }
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

    const parsedBody = await readJsonBody(request, 16 * 1024);
    if (!parsedBody.ok) {
      return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
    }
    const body = parsedBody.value;

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
