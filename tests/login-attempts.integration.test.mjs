import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { recordLoginAttempt } from '../lib/auth/login-attempts.mjs';

const enabled = process.env.AUTH_DB_INTEGRATION === '1' && Boolean(process.env.DATABASE_URL);
const prisma = new PrismaClient();

test('records failed logins with the trusted proxy IP', { skip: !enabled }, async () => {
  const email = `auth-attempt-${randomUUID()}@example.invalid`;
  try {
    await recordLoginAttempt({
      email,
      request: { headers: { 'x-real-ip': '192.0.2.1' } },
      success: false,
      env: {
        TRUST_PROXY_HEADERS: 'true',
        NODE_ENV: 'test',
      },
    });

    const attempt = await prisma.loginAttempt.findFirst({ where: { email } });
    assert.ok(attempt);
    assert.equal(attempt.success, false);
    assert.equal(attempt.ipAddress, '192.0.2.1');
  } finally {
    await prisma.loginAttempt.deleteMany({ where: { email } });
    await prisma.$disconnect();
  }
});
