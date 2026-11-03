import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAdminUser } from '@/lib/auth/require-auth';
import { getPagination, isPaginationOffsetOutOfRange } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isValidAdminUserId } from '@/lib/api/admin-user-validation.mjs';
import { isValidProfileImage } from '@/lib/api/profile-image.mjs';
import { getPlatformRole, replacePlatformRole } from '@/lib/auth/roles.mjs';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';
import { Prisma } from '@prisma/client';

const MAX_PAGE_SIZE = 100;
const userSelect = {
  id: true,
  email: true,
  userName: true,
  imageUrl: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    where: { scopeType: 'PLATFORM', scopeId: null },
    select: { role: { select: { name: true } } },
  },
};

function serializeUser(user) {
  const { roles, ...profile } = user;
  return { ...profile, userImage: profile.imageUrl, role: getPlatformRole(roles) };
}

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
      users: users.map(serializeUser),
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

    const id = body?.id;
    if (!isValidAdminUserId(id)) {
      return NextResponse.json({ error: 'A valid user id is required.' }, { status: 400 });
    }

    const data = {};
    if (typeof body.userName === 'string') data.userName = body.userName.trim().slice(0, 100);
    if (Object.prototype.hasOwnProperty.call(body ?? {}, 'userImage')) {
      if (!isValidProfileImage(body.userImage)) {
        return NextResponse.json({ error: 'Profile image must be a valid HTTP(S) URL or a same-origin path under 2048 characters.' }, { status: 400 });
      }
      data.imageUrl = body.userImage === null ? null : body.userImage.trim();
    }
    if (Object.prototype.hasOwnProperty.call(body ?? {}, 'role')) {
      if (!['CUSTOMER', 'SELLER', 'ADMIN'].includes(body.role)) {
        return NextResponse.json({ error: 'A valid role is required.' }, { status: 400 });
      }
      data.role = body.role;
    }
    if (Object.prototype.hasOwnProperty.call(body ?? {}, 'status')) {
      if (!['ACTIVE', 'SUSPENDED'].includes(body.status)) {
        return NextResponse.json({ error: 'A valid status is required.' }, { status: 400 });
      }
      data.status = body.status;
      if (body.status === 'ACTIVE') data.deletedAt = null;
    }

    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
    }
    if (id === admin.id && (data.role && data.role !== 'ADMIN' || data.status && data.status !== 'ACTIVE')) {
      return NextResponse.json({ error: 'You cannot remove your own admin access or suspend your account.' }, { status: 400 });
    }

    const user = await prisma.$transaction(async (transaction) => {
      const current = await transaction.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          status: true,
          roles: {
            where: { scopeType: 'PLATFORM', scopeId: null },
            select: { role: { select: { name: true } } },
          },
        },
      });
      if (!current) throw new Error('ADMIN_USER_NOT_FOUND');
      const currentRole = getPlatformRole(current.roles);
      const removingActiveAdmin = currentRole === 'ADMIN'
        && current.status === 'ACTIVE'
        && ((data.role && data.role !== 'ADMIN') || data.status === 'SUSPENDED');
      if (isControlPanelAdminEmail(current.email)
        && ((data.role && data.role !== 'ADMIN') || (data.status && data.status !== 'ACTIVE'))) {
        throw new Error('PROTECTED_CONTROL_PANEL_ADMIN');
      }
      if (removingActiveAdmin) {
        const remainingAdmins = await transaction.userRoleAssignment.count({
          where: {
            scopeType: 'PLATFORM',
            scopeId: null,
            role: { name: 'ADMIN' },
            user: { status: 'ACTIVE', id: { not: id } },
          },
        });
        if (remainingAdmins === 0) throw new Error('LAST_ACTIVE_ADMIN');
      }
      if (data.role) await replacePlatformRole(transaction, id, data.role);
      const userData = { ...data };
      delete userData.role;
      const updated = await transaction.user.update({ where: { id }, data: userData, select: userSelect });
      return serializeUser(updated);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_USER_NOT_FOUND') {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'PROTECTED_CONTROL_PANEL_ADMIN') {
      return NextResponse.json({ error: 'The control panel admin account is protected.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'LAST_ACTIVE_ADMIN') {
      return NextResponse.json({ error: 'The last active admin cannot be demoted or suspended.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'The user changed during the update. Please retry.' }, { status: 409 });
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
    if (!isValidAdminUserId(id)) {
      return NextResponse.json({ error: 'A valid user id is required.' }, { status: 400 });
    }
    if (id === admin.id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    await prisma.$transaction(async (transaction) => {
      const current = await transaction.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          status: true,
          roles: {
            where: { scopeType: 'PLATFORM', scopeId: null },
            select: { role: { select: { name: true } } },
          },
        },
      });
      if (!current) throw new Error('ADMIN_USER_NOT_FOUND');
      if (isControlPanelAdminEmail(current.email)) throw new Error('PROTECTED_CONTROL_PANEL_ADMIN');
      if (current.status === 'ACTIVE' && getPlatformRole(current.roles) === 'ADMIN') {
        const remainingAdmins = await transaction.userRoleAssignment.count({
          where: {
            scopeType: 'PLATFORM',
            scopeId: null,
            role: { name: 'ADMIN' },
            user: { status: 'ACTIVE', id: { not: id } },
          },
        });
        if (remainingAdmins === 0) throw new Error('LAST_ACTIVE_ADMIN');
      }
      await transaction.user.update({
        where: { id },
        data: { status: 'DELETED', deletedAt: new Date() },
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ deleted: true, id, status: 'DELETED' });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_USER_NOT_FOUND') {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'PROTECTED_CONTROL_PANEL_ADMIN') {
      return NextResponse.json({ error: 'The control panel admin account is protected.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'LAST_ACTIVE_ADMIN') {
      return NextResponse.json({ error: 'The last active admin cannot be deleted.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'The user changed during deletion. Please retry.' }, { status: 409 });
    }
    console.error('Admin user deletion failed:', error);
    return NextResponse.json({ error: 'Unable to delete user.' }, { status: 500 });
  }
}
