import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url, 'http://localhost');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const mealName = searchParams.get('mealName') || '';
    const propertyType = searchParams.get('propertyType') || '';

    const skip = (page - 1) * limit;

    // بناء شروط الاستعلام
    const whereConditions = {};
    if (mealName) {
      whereConditions['mealName'] = mealName;
    }
    if (propertyType) {
      whereConditions['propertyType'] = propertyType;
    }

    // تنفيذ الاستعلام في Supabase
    let { data: meals, error } = await supabase
      .from('Meal')
      .select('*')
      .ilike('mealName', `%${mealName}%`)
      .ilike('propertyType', `%${propertyType}%`)
      .range(skip, skip + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json(meals, { status: 200 });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import prisma from '../../../lib/PrismaClient';

// export async function GET(req) {
//   await prisma.$connect(); // التأكد من أن Prisma جاهزة

//   const { searchParams } = new URL(req.url, 'http://localhost');
//   const page = parseInt(searchParams.get('page') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '3', 10);
//   const mealName = searchParams.get('mealName') || '';
//   const propertyType = searchParams.get('propertyType') || '';

//   const whereConditions = {};

//   if (mealName) {
//     whereConditions.mealName = {
//       contains: mealName,
//     };
//   }

//   if (propertyType) {
//     whereConditions.propertyType = {
//       contains: propertyType,
//     };
//   }

//   try {
//     const meals = await prisma.meal.findMany({
//       where: whereConditions,
//       skip: (page - 1) * limit,
//       take: limit,
//     });

//     await prisma.$disconnect(); // إغلاق الاتصال بقاعدة البيانات
//     return NextResponse.json(meals, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching meals:', error);
//     await prisma.$disconnect(); // إغلاق الاتصال بقاعدة البيانات في حالة الخطأ
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
