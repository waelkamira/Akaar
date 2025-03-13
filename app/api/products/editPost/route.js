import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';

const prisma = new PrismaClient();

export async function POST(req) {
  const { id } = await req.json();
  console.log('id', id);

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: 'يجب توفير معرف الاعلان' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const post = await prisma.product.findUnique({
      where: { id },
    });

    if (!post) {
      return new Response(
        JSON.stringify({ error: 'لم يتم العثور على الاعلان' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
export async function PUT(req) {
  const { id, distance, year, price, ...data } = await req.json();

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: 'يجب توفير معرف الاعلان' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedPost = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        distance: distance ? toInteger(distance) : undefined,
        price: price ? toInteger(price) : undefined,
        year: year ? toInteger(year) : undefined,
      },
    });

    return new Response(
      JSON.stringify({ message: 'تم التعديل بنجاح', post: updatedPost }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating post:', error);
    if (error.code === 'P2025') {
      return new Response(
        JSON.stringify({ error: 'لم يتم العثور على الاعلان' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
