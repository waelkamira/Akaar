import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

export async function POST(request) {
  const parsedBody = await readJsonBody(request, 8 * 1024);
  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  }
  const body = parsedBody.value;

  const id = typeof body?.id === 'string' ? body.id.trim() : '';
  if (!id || id.length > 100) {
    return NextResponse.json({ error: 'A valid product ID is required.' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: { select: { id: true, userName: true, userImage: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product detail lookup failed:', error);
    return NextResponse.json({ error: 'Unable to load product details.' }, { status: 500 });
  }
}
