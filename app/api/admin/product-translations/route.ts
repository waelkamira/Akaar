import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

export const dynamic = 'force-dynamic';
const LANGUAGE_PATTERN = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/i;

function parseTranslation(body: Record<string, unknown>) {
  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  const language = typeof body.language === 'string' ? body.language.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = body.description === null ? null : typeof body.description === 'string' ? body.description.trim() : undefined;
  if (!productId || productId.length > 128 || !LANGUAGE_PATTERN.test(language) || language.length > 16
    || !title || title.length > 200 || description === undefined || (description !== null && description.length > 10_000)) {
    return { error: 'تحقق من المنتج ورمز اللغة والعنوان والوصف.' };
  }
  return { productId, language, title, description };
}

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  try {
    const [translations, products] = await Promise.all([
      prisma.productTranslation.findMany({
        orderBy: [{ language: 'asc' }, { title: 'asc' }],
        take: 500,
        select: { id: true, productId: true, language: true, title: true, description: true, product: { select: { title: true } } },
      }),
      prisma.product.findMany({
        where: { isDeleted: false },
        orderBy: { title: 'asc' },
        take: 500,
        select: { id: true, title: true },
      }),
    ]);
    return NextResponse.json({ translations, products }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load product translations:', error);
    return NextResponse.json({ error: 'تعذر تحميل الترجمات.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات الترجمة غير صالحة.' }, { status: 400 });
  const data = parseTranslation(parsed.value);
  if ('error' in data) return NextResponse.json({ error: data.error }, { status: 400 });
  try {
    const product = await prisma.product.findFirst({ where: { id: data.productId, isDeleted: false }, select: { id: true } });
    if (!product) return NextResponse.json({ error: 'المنتج غير موجود أو محذوف.' }, { status: 404 });
    const translation = await prisma.productTranslation.create({
      data,
      select: { id: true, productId: true, language: true, title: true, description: true, product: { select: { title: true } } },
    });
    return NextResponse.json({ translation }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'توجد ترجمة لهذه اللغة على المنتج نفسه.' }, { status: 409 });
    console.error('Unable to create product translation:', error);
    return NextResponse.json({ error: 'تعذر إنشاء الترجمة.' }, { status: 500 });
  }
}
