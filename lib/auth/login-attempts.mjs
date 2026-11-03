import { getTrustedClientAddress } from '../api/durable-rate-limit.mjs';
import { prisma } from '../db/prisma.js';

export function buildLoginAttemptData({ email, request, success, env = process.env }) {
  return {
    email,
    ipAddress: getTrustedClientAddress(request, env),
    success,
  };
}

export async function recordLoginAttempt(input) {
  return prisma.loginAttempt.create({ data: buildLoginAttemptData(input) });
}
