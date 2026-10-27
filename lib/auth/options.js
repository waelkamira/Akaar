import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/db/prisma';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
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
      async authorize(credentials) {
        const email =
          typeof credentials?.email === 'string'
            ? credentials.email.trim().toLowerCase()
            : '';
        const password =
          typeof credentials?.password === 'string'
            ? credentials.password
            : '';
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || user.status !== 'ACTIVE') {
          throw new Error('Invalid credentials or inactive account');
        }

        if (!user.password) {
          throw new Error('This account does not use password sign-in');
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
          throw new Error('Incorrect password');
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        try {
          if (!profile?.email || !profile?.sub) return false;
          let user;
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (existingUser) {
            if (existingUser.status !== 'ACTIVE') return false;
            if (!existingUser.googleId) {
              user = await prisma.user.update({
                where: { email: profile.email },
                data: { googleId: profile.sub },
              });
            } else {
              user = existingUser;
            }
          } else {
            user = await prisma.user.create({
              data: {
                id: uuidv4(),
                email: profile.email,
                userImage: profile.picture,
                googleId: profile.sub,
                userName: profile.name,
                role: 'CUSTOMER',
              },
            });
          }
          return !!user;
        } catch (error) {
          console.error('Google Sign-In Error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });
        token.id = existingUser.id;
        token.role = existingUser.role;
      } else if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: { strategy: 'jwt' },
  debug: process.env.NODE_ENV === 'development',
  pages: { signIn: '/login' },
};
