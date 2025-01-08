// إعداد Supabase
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';
import { authOptions } from '../authOptions/route';
import { getServerSession } from 'next-auth';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log('email', email);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const skip = (page - 1) * limit;

  try {
    if (!email) {
      return new Response(
        JSON.stringify({ message: 'يجب توفير البريد الإلكتروني' }),
        { status: 400 }
      );
    }

    // جلب عدد الوجبات
    const userPostsCount = await prisma.property.count({
      where: { createdBy: email },
    });

    console.log('userPostsCount', userPostsCount);
    // جلب الوجبات
    const userPosts = await prisma.property.findMany({
      where: { createdBy: email },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return new Response(
      JSON.stringify({
        count: userPostsCount,
        recipes: userPosts,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user recipes data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
export async function DELETE(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  if (!id || !email) {
    return new Response(
      JSON.stringify({ error: 'يجب توفير معرف الوجبة والبريد الإلكتروني' }),
      { status: 400 }
    );
  }

  try {
    // تحقق إذا كانت الوجبة موجودة
    const property = await prisma.property.findFirst({
      where: { id, createdBy: email },
    });

    if (!property) {
      return new Response(
        JSON.stringify({
          error: 'لم يتم العثور على الوجبة أو لا تملك صلاحية حذف هذه الوجبة',
        }),
        { status: 404 }
      );
    }

    // حذف الوجبة
    await prisma.property.delete({ where: { id } });

    return new Response(JSON.stringify({ message: 'تم الحذف بنجاح ✔' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
