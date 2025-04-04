// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth/next';
// استورد من الموقع الجديد الصحيح
import { authOptions } from '../../authOptions/route'; // أو استخدم المسار النسبي مثل ../../../lib/auth

const handler = NextAuth(authOptions);

// يجب تصدير المعالج كـ GET و POST
export { handler as GET, handler as POST };
