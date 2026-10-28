import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';

const MAX_BCRYPT_BYTES = 72;

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body: unknown = parsed.value;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Request body must be an object.' }, { status: 400 });
  }
  const values = body as { currentPassword?: unknown; newPassword?: unknown };
  if (typeof values.currentPassword !== 'string' || typeof values.newPassword !== 'string') {
    return NextResponse.json({ error: 'Current and new passwords are required.' }, { status: 400 });
  }
  const newPasswordBytes = new TextEncoder().encode(values.newPassword).length;
  if (newPasswordBytes < 8 || newPasswordBytes > MAX_BCRYPT_BYTES) {
    return NextResponse.json({ error: 'New password must be at least 8 characters and no more than 72 bytes.' }, { status: 400 });
  }

  try {
    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });
    if (!account?.password) {
      return NextResponse.json({ error: 'This account does not use password sign-in. Use your identity provider account settings.' }, { status: 409 });
    }
    const currentMatches = await bcrypt.compare(values.currentPassword, account.password);
    if (!currentMatches) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    if (values.currentPassword === values.newPassword) {
      return NextResponse.json({ error: 'Choose a password different from your current password.' }, { status: 400 });
    }

    const password = await bcrypt.hash(values.newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password } });
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error('Unable to update account password:', error);
    return NextResponse.json({ error: 'Unable to update password right now.' }, { status: 500 });
  }
}
