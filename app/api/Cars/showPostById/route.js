import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { id } = await req.json();
  console.log('id', id);
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
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return new Response(JSON.stringify({ error: 'Property not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    return new Response(JSON.stringify(property), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  } finally {
    // إغلاق الاتصال بقاعدة البيانات
    await prisma.$disconnect();
  }
}
