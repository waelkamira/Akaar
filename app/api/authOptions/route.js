// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';

// const prisma = new PrismaClient();

// export const authOptions = {
//   secret: process.env.NEXT_PUBLIC_SECRET,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         name: { label: 'Your name', type: 'text', placeholder: 'Your name' },
//         email: {
//           label: 'Your email',
//           type: 'email',
//           placeholder: 'Your email',
//         },
//         password: {
//           label: 'Your password',
//           type: 'password',
//           placeholder: 'Your password',
//         },
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials;

//         // البحث عن المستخدم بالبريد الإلكتروني
//         const user = await prisma.user.findUnique({
//           where: { email },
//         });

//         if (!user) {
//           throw new Error('Email not found');
//         }

//         // التحقق من كلمة المرور
//         const checkPassword = await bcrypt.compare(password, user.password);
//         if (!checkPassword) {
//           throw new Error('Incorrect password');
//         }

//         return user;
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.sub;
//       return session;
//     },
//     async signIn({ account, profile }) {
//       if (account.provider === 'google') {
//         const existingUser = await prisma.user.findUnique({
//           where: { email: profile.email },
//         });

//         if (existingUser) {
//           // تحديث معرف Google إذا لم يكن مسجلاً مسبقًا
//           if (!existingUser.googleId) {
//             await prisma.user.update({
//               where: { email: profile.email },
//               data: { googleId: profile.sub },
//             });
//           }
//         } else {
//           // إنشاء مستخدم جديد عند تسجيل الدخول لأول مرة باستخدام Google
//           await prisma.user.create({
//             data: {
//               email: profile.email,
//               userImage: profile.picture,
//               googleId: profile.sub,
//               username: profile.name,
//             },
//           });
//         }
//         return true;
//       }
//       return true;
//     },
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async redirect({ url, baseUrl }) {
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
//   session: { strategy: 'jwt' },
//   debug: process.env.NODE_ENV === 'development',
//   pages: { signIn: '/login' },
// };
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

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
        const { email, password } = credentials;

        // البحث عن المستخدم بالبريد الإلكتروني
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error('Email not found');
        }

        // التحقق من كلمة المرور
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
      // استخدام معرف المستخدم من الـ JWT
      session.user.id = token.id;
      return session;
    },
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        try {
          let user;
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (existingUser) {
            // تحديث معرف Google إذا لم يكن مسجلاً مسبقًا
            if (!existingUser.googleId) {
              user = await prisma.user.update({
                where: { email: profile.email },
                data: { googleId: profile.sub },
              });
            } else {
              user = existingUser; // المستخدم موجود بالفعل
            }
          } else {
            // إنشاء مستخدم جديد عند تسجيل الدخول لأول مرة باستخدام Google
            user = await prisma.user.create({
              data: {
                id: uuidv4(), // Assign UUID here
                email: profile.email,
                userImage: profile.picture,
                googleId: profile.sub,
                username: profile.name,
              },
            });
          }
          // ارجع المستخدم الذي تم العثور عليه أو إنشاؤه
          return !!user; // تحويل إلى قيمة منطقية (true إذا تم العثور على/إنشاء المستخدم)

        } catch (error) {
          console.error("Google Sign-In Error:", error);
          return false; // منع تسجيل الدخول في حالة الخطأ
        }
      }
      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      // إذا كان المستخدم قادماً من Google، استخدم الـ profile.sub كمفتاح
      if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
              where: { email: profile.email },
          });
          token.id = existingUser.id
      }
      // إذا كان المستخدم قادماً من credentials، استخدم الـ user.id
      else if (user) {
          token.id = user.id;
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