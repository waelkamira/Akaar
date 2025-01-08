import { supabase } from '../../../lib/supabaseClient';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const searchQuery = searchParams.get('searchQuery') || '';
  const isAdmin = searchParams.get('isAdmin') === 'true';
  console.log('Full Query String:', req.url);
  console.log(
    'searchQuery',
    searchQuery,
    ' limit',
    limit,

    'pageNumber',
    pageNumber,
    'isAdmin',
    isAdmin
  );
  try {
    if (searchQuery && isAdmin) {
      let { data: User, error } = await supabase
        .from('User')
        .select('*')
        .like('email', `%${searchQuery}%`) // استخدم like للبحث الجزئي
        .range((pageNumber - 1) * limit, pageNumber * limit - 1);

      console.log('User', User);
      if (error) throw error;
      return Response.json(User);
    } else if (isAdmin) {
      let { data: User, error } = await supabase
        .from('User')
        .select('email')
        .order('createdAt', { ascending: false })
        .range((pageNumber - 1) * limit, pageNumber * limit - 1);

      if (error) throw error;
      console.log('User', User);
      console.log('User', User?.length);
      return Response.json(User);
    }
  } catch (error) {
    console.error('Error fetching User:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { email, image, name } = await req.json();

    const { data: user, error } = await supabase
      .from('User')
      .update({ image, name })
      .eq('email', email)
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { email } = await req.json();

    // التحقق من وجود المستخدم قبل محاولة حذفه
    const { data: existingUser, error: fetchError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !existingUser) {
      console.error(`User with email ${email} not found.`);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    const { data: deletedUser, error: deleteError } = await supabase
      .from('User')
      .delete()
      .eq('email', email);

    if (deleteError) throw deleteError;

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// import NodeCache from 'node-cache';
// import userPrisma from '../../../lib/UserPrismaClient';

// // إعداد التخزين المؤقت مع مدة تخزين مؤقت (مثلاً 10 دقائق)
// const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// export async function GET(req) {
//   await userPrisma.$connect(); // التأكد من أن Prisma جاهزة

//   const { searchParams } = new URL(req.url);
//   const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '5', 10);
//   const searchQuery = searchParams.get('searchQuery') || '';
//   const email = searchParams.get('email') || '';

//   // استخدم المفتاح الفريد لتخزين البيانات المؤقتة
//   const cacheKey = `users_${pageNumber}_${limit}_${searchQuery}_${email}`;
//   const cachedData = cache.get(cacheKey);

//   if (cachedData) {
//     // إذا كانت البيانات موجودة في الذاكرة المؤقتة، ارجعها مباشرة
//     return new Response(JSON.stringify(cachedData), { status: 200 });
//   }

//   try {
//     if (email) {
//       const user = await userPrisma.user.findUnique({
//         where: { email },
//       });
//       // احفظ البيانات في الذاكرة المؤقتة
//       cache.set(cacheKey, user);
//       return new Response(JSON.stringify(user), { status: 200 });
//     } else {
//       const users = await userPrisma.user.findMany({
//         where: {
//           email: {
//             contains: searchQuery,
//           },
//         },
//         skip: (pageNumber - 1) * limit,
//         take: limit,
//       });
//       // احفظ البيانات في الذاكرة المؤقتة
//       cache.set(cacheKey, users);
//       return new Response(JSON.stringify(users), { status: 200 });
//     }
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function PUT(req) {
//   await userPrisma.$connect(); // التأكد من أن Prisma جاهزة

//   try {
//     const { email, image, name } = await req.json();

//     const user = await userPrisma.user.update({
//       where: { email },
//       data: { image, name },
//     });

//     // مسح البيانات المؤقتة المتعلقة بالمستخدم المعدل
//     cache.keys().forEach((key) => {
//       if (key.includes(email)) {
//         cache.del(key);
//       }
//     });

//     return new Response(JSON.stringify(user), { status: 200 });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function DELETE(req) {
//   await userPrisma.$connect(); // التأكد من أن Prisma جاهزة

//   try {
//     const { email } = await req.json();

//     // التحقق من وجود المستخدم قبل محاولة حذفه
//     const existingUser = await userPrisma.user.findUnique({
//       where: { email },
//     });

//     if (!existingUser) {
//       console.error(`User with email ${email} not found.`);
//       return new Response(JSON.stringify({ error: 'User not found' }), {
//         status: 404,
//       });
//     }

//     const deleteUser = await userPrisma.user.delete({
//       where: { email },
//     });

//     // مسح البيانات المؤقتة المتعلقة بالمستخدم المحذوف
//     cache.keys().forEach((key) => {
//       if (key.includes(email)) {
//         cache.del(key);
//       }
//     });

//     return new Response(JSON.stringify(deleteUser), { status: 200 });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }
