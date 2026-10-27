import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

const publicUserSelect = {
  id: true,
  userName: true,
  userImage: true,
  email: true,
  role: true,
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
      select: publicUserSelect,
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ ...user, isAdmin: user.role === 'ADMIN' });
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
    if (typeof body?.userImage === 'string' || body?.userImage === null) {
      data.userImage = body.userImage;
    }
    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'No valid profile fields supplied.' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: authenticatedUser.id },
      data,
      select: publicUserSelect,
    });
    return NextResponse.json({ user });
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
