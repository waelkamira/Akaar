import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// إعداد Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API
);

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
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
        const email = credentials?.email;
        const password = credentials?.password;

        const { data: user, error } = await supabase
          .from('User')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !user) {
          throw new Error('Email not found');
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
      session.user.id = token.sub;
      return session;
    },
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        const { data: existingUser, error: existingUserError } = await supabase
          .from('User')
          .select('*')
          .eq('email', profile.email)
          .single();

        if (existingUserError && existingUserError.code !== 'PGRST116') {
          throw new Error(existingUserError.message);
        }

        if (existingUser) {
          if (!existingUser.googleId) {
            const { error } = await supabase
              .from('User')
              .update({ googleId: profile.sub })
              .eq('email', profile.email);

            if (error) {
              throw new Error(error.message);
            }
          }
        } else {
          const { error } = await supabase.from('User').insert({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            googleId: profile.sub,
          });

          if (error) {
            throw new Error(error.message);
          }
        }

        return true;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  pages: { signIn: '/login' },
};
