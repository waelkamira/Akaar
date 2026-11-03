import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser, getControlPanelPermissions } from '@/lib/auth/require-auth';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isValidProfileImage } from '@/lib/api/profile-image.mjs';
import { isControlPanelAdmin } from '@/lib/auth/control-panel-access.mjs';
import { CONTROL_PANEL_PERMISSION_NAMES, getControlPanelEntryPath } from '@/lib/auth/control-panel-permissions.mjs';

const publicUserSelect = {
  id: true,
  userName: true,
  imageUrl: true,
  email: true,
  status: true,
  createdAt: true,
};

export async function GET() {
  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authenticatedUser.id },
      select: { ...publicUserSelect, passwordHash: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const { passwordHash, ...safeUser } = user;
    const controlPanelPermissions = isControlPanelAdmin(authenticatedUser)
      ? CONTROL_PANEL_PERMISSION_NAMES
      : await getControlPanelPermissions(authenticatedUser.id);
    return NextResponse.json({
      ...safeUser,
      userImage: safeUser.imageUrl,
      role: authenticatedUser.role,
      hasPassword: Boolean(passwordHash),
      isAdmin: authenticatedUser.role === 'ADMIN',
      controlPanelEntryPath: getControlPanelEntryPath(controlPanelPermissions),
    }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    console.error('Unable to fetch current user:', error);
    return NextResponse.json({ error: 'Unable to fetch user.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsedBody = await readJsonBody(request, 16 * 1024);
    if (!parsedBody.ok) {
      return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
    }
    const body = parsedBody.value;

    if (body?.id && body.id !== authenticatedUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = {};
    if (typeof body?.userName === 'string') {
      const userName = body.userName.trim();
      if (userName.length < 2 || userName.length > 100) {
        return NextResponse.json({ error: 'User name must be 2–100 characters.' }, { status: 400 });
      }
      data.userName = userName;
    }
    if (Object.prototype.hasOwnProperty.call(body ?? {}, 'imageUrl')) {
      if (!isValidProfileImage(body.imageUrl)) {
        return NextResponse.json({ error: 'Profile image must be a valid HTTP(S) URL or a same-origin path under 2048 characters.' }, { status: 400 });
      }
      data.imageUrl = body.imageUrl === null ? null : body.imageUrl.trim();
    }
    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'No valid profile fields supplied.' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: authenticatedUser.id },
      data,
      select: publicUserSelect,
    });
    return NextResponse.json({
      user: {
        ...user,
        userImage: user.imageUrl,
        role: authenticatedUser.role,
      },
    });
  } catch (error) {
    console.error('Unable to update current user:', error);
    return NextResponse.json({ error: 'Unable to update user.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Deactivate rather than physically delete a user and cascade-delete commerce history.
    await prisma.user.update({
      where: { id: authenticatedUser.id },
      data: { status: 'DELETED' },
    });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Unable to deactivate current user:', error);
    return NextResponse.json({ error: 'Unable to deactivate user.' }, { status: 500 });
  }
}
