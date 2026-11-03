import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/db/prisma';
import { getVerifiedGoogleIdentity } from './google-identity.mjs';
import { resolveSafeRedirectUrl } from './redirect-url.mjs';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { buildLoginAttemptData } from './login-attempts.mjs';
import { assignPlatformRole, getPlatformRole } from './roles.mjs';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        name: { label: 'Your name', type: 'text', placeholder: 'Your name' },
        email: {
          label: 'Your email',
          type: 'email',
          placeholder: 'Your email',
        },
        password: {
          label: 'Your password',
          type: 'password',
          placeholder: 'Your password',
        },
      },
      async authorize(credentials, req) {
        const email =
          typeof credentials?.email === 'string'
            ? credentials.email.trim().toLowerCase()
            : '';
        const password =
          typeof credentials?.password === 'string'
            ? credentials.password
            : '';

        const ipLimit = await consumeDurableRateLimit({
          request: req,
          scope: 'login-ip',
          limit: 20,
          windowMs: 15 * 60 * 1000,
        });
        if (!ipLimit.allowed) {
          throw new Error('Sign-in temporarily unavailable or rate limited');
        }

        if (email) {
          const accountLimit = await consumeDurableRateLimit({
            request: req,
            scope: 'login-account',
            limit: 5,
            windowMs: 15 * 60 * 1000,
            identity: email,
          });
          if (!accountLimit.allowed) {
            throw new Error('Sign-in temporarily unavailable or rate limited');
          }
        }
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || user.status !== 'ACTIVE' || !user.passwordHash || !user.emailVerifiedAt) {
          if (email) {
            await prisma.loginAttempt.create({
              data: buildLoginAttemptData({ email, request: req, success: false }),
            });
          }
          throw new Error('Invalid credentials or inactive account');
        }

        const checkPassword = await bcrypt.compare(password, user.passwordHash);
        if (!checkPassword) {
          await prisma.loginAttempt.create({
            data: buildLoginAttemptData({ email, request: req, success: false }),
          });
          throw new Error('Invalid credentials or inactive account');
        }

        const assignments = await prisma.userRoleAssignment.findMany({
          where: { userId: user.id, scopeType: 'PLATFORM', scopeId: null },
          select: { role: { select: { name: true } } },
        });
        await prisma.$transaction([
          prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
          prisma.loginAttempt.create({
            data: buildLoginAttemptData({ email, request: req, success: true }),
          }),
        ]);
        return {
          id: user.id,
          email: user.email,
          name: user.userName,
          userName: user.userName,
          image: user.imageUrl,
          imageUrl: user.imageUrl,
          role: getPlatformRole(assignments),
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.userName = token.name;
      session.user.userImage = token.picture;
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          const identity = getVerifiedGoogleIdentity(profile);
          if (!identity) return false;
          const { email, subject } = identity;
          const linkedAccount = await prisma.oAuthAccount.findUnique({
            where: { provider_providerAccountId: { provider: account.provider, providerAccountId: subject } },
            include: { user: true },
          });
          if (linkedAccount) {
            const active = linkedAccount.user.status === 'ACTIVE';
            const now = new Date();
            await prisma.$transaction([
              ...(active ? [prisma.user.update({
                where: { id: linkedAccount.user.id },
                data: {
                  emailVerifiedAt: linkedAccount.user.emailVerifiedAt || now,
                  lastLoginAt: now,
                },
              })] : []),
              prisma.loginAttempt.create({
                data: buildLoginAttemptData({ email, success: active }),
              }),
            ]);
            return active;
          }

          let user = await prisma.user.findUnique({ where: { email } });
          if (user?.status !== undefined && user.status !== 'ACTIVE') {
            await prisma.loginAttempt.create({
              data: buildLoginAttemptData({ email, success: false }),
            });
            return false;
          }
          if (!user) {
            user = await prisma.$transaction(async (transaction) => {
              const created = await transaction.user.create({
                data: {
                  email,
                  imageUrl: typeof profile.picture === 'string' ? profile.picture : null,
                  userName: typeof profile.name === 'string' ? profile.name : null,
                  emailVerifiedAt: new Date(),
                },
              });
              await assignPlatformRole(transaction, created.id, 'CUSTOMER');
              return created;
            });
          } else if (!user.emailVerifiedAt) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { emailVerifiedAt: new Date() },
            });
          }
          await prisma.oAuthAccount.create({
            data: {
              userId: user.id,
              provider: account.provider,
              providerAccountId: subject,
            },
          });
          const now = new Date();
          await prisma.$transaction([
            prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: now } }),
            prisma.loginAttempt.create({
              data: buildLoginAttemptData({ email, success: true }),
            }),
          ]);
          return true;
        } catch (error) {
          console.error('Google Sign-In Error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (account?.provider === 'google') {
        const identity = getVerifiedGoogleIdentity(profile);
        const linkedAccount = identity
          ? await prisma.oAuthAccount.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: identity.subject,
                },
              },
              include: {
                user: {
                  select: {
                    id: true,
                    status: true,
                    userName: true,
                    imageUrl: true,
                    roles: {
                      where: { scopeType: 'PLATFORM', scopeId: null },
                      select: { role: { select: { name: true } } },
                    },
                  },
                },
              },
            })
          : null;
        if (linkedAccount?.user && linkedAccount.user.status === 'ACTIVE') {
          token.id = linkedAccount.user.id;
          token.role = getPlatformRole(linkedAccount.user.roles);
          token.name = linkedAccount.user.userName;
          token.picture = linkedAccount.user.imageUrl;
        }
      } else if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.userName || user.name;
        token.picture = user.imageUrl || user.image;
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      return resolveSafeRedirectUrl(url, baseUrl);
    },
  },
  session: { strategy: 'jwt' },
  debug: false,
  pages: { signIn: '/login' },
};
