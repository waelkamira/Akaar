import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url, 'http://localhost');
//     const page = parseInt(searchParams.get('page') || '1', 10);
//     const limit = parseInt(searchParams.get('limit') || '5', 10);
//     const mealName = searchParams.get('mealName') || '';
//     const propertyType = searchParams.get('propertyType') || '';

//     const skip = (page - 1) * limit;

//     // بناء شروط الاستعلام
//     const whereConditions = {};
//     if (mealName) {
//       whereConditions['mealName'] = mealName;
//     }
//     if (propertyType) {
//       whereConditions['propertyType'] = propertyType;
//     }

//     // تنفيذ الاستعلام في Supabase
//     let { data: meals, error } = await supabase
//       .from('Meal')
//       .select('*')
//       .ilike('mealName', `%${mealName}%`)
//       .ilike('propertyType', `%${propertyType}%`)
//       .range(skip, skip + limit - 1);

//     if (error) {
//       throw error;
//     }

//     return NextResponse.json(meals, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching meals:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // الحصول على قيم الصفحة والحد الأقصى
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const skip = (page - 1) * limit;
  const selectedCity = searchParams.get('selectedCity');
  const selectedTown = searchParams.get('selectedTown');
  const category = searchParams.get('category');

  console.log('selectedCity', selectedCity);
  console.log('selectedTown', selectedTown);
  console.log('category', category);

  try {
    // قراءة البيانات من جدول Property
    const properties = await prisma.property.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    // console.log('properties', properties);
    if (category) {
    }
    return new Response(JSON.stringify(properties), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
