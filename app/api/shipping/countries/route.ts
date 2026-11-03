import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { code: true, name: true, phoneCode: true },
    });
    return NextResponse.json({ countries });
  } catch (error) {
    console.error('Unable to load shipping countries:', error);
    return NextResponse.json({ error: 'تعذر تحميل بلدان الشحن.' }, { status: 500 });
  }
}
