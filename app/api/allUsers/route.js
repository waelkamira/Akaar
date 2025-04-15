import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const searchQuery = searchParams.get('searchQuery') || '';
  const isAdmin = searchParams.get('isAdmin') === 'true';

  try {
    let users;

    if (searchQuery && isAdmin) {
      users = await prisma.user.findMany({
        where: { email: { contains: searchQuery } },
        skip: (pageNumber - 1) * limit,
        take: limit,
      });
    } else if (isAdmin) {
      users = await prisma.user.findMany({
        select: { email: true },
        orderBy: { createdAt: 'desc' },
        skip: (pageNumber - 1) * limit,
        take: limit,
      });
    }

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { email, image, name } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { image, name },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
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

    // التحقق مما إذا كان المستخدم موجودًا قبل الحذف
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      console.error(`User with email ${email} not found.`);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    const deletedUser = await prisma.user.delete({
      where: { email },
    });

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
