import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';

  try {
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
        });
      }

      return new Response(JSON.stringify(user), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { id, userImage, username } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { userImage, username },
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
    const { userId } = await req.json();

    // التحقق مما إذا كان المستخدم موجودًا قبل الحذف
    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (!existingUser) {
      console.error(`User with userId ${userId} not found.`);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    const deletedUser = await prisma.user.delete({
      where: { userId },
    });

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
