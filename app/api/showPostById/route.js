import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { id } = await req.json();
  try {
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID parameter is required' }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // استخدام Prisma لجلب البيانات
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    return new Response(JSON.stringify(product), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  } finally {
    // إغلاق الاتصال بقاعدة البيانات
    await prisma.$disconnect();
  }
}
