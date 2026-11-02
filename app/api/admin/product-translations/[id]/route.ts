import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

const LANGUAGE_PATTERN = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/i;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف الترجمة غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات الترجمة غير صالحة.' }, { status: 400 });
  const body = parsed.value;
  const keys = Object.keys(body);
  if (!keys.length || keys.some((key) => !['productId', 'language', 'title', 'description'].includes(key))) {
    return NextResponse.json({ error: 'حقول الترجمة المرسلة غير مدعومة.' }, { status: 400 });
  }
  const current = await prisma.productTranslation.findUnique({ where: { id }, select: { id: true, productId: true, language: true, title: true, description: true } });
  if (!current) return NextResponse.json({ error: 'الترجمة غير موجودة.' }, { status: 404 });
  const productId = body.productId === undefined ? current.productId : body.productId;
  const language = body.language === undefined ? current.language : body.language;
  const title = body.title === undefined ? current.title : body.title;
  const description = body.description === undefined ? current.description : body.description;
  if (typeof productId !== 'string' || !productId.trim() || productId.length > 128
    || typeof language !== 'string' || !LANGUAGE_PATTERN.test(language) || language.length > 16
    || typeof title !== 'string' || !title.trim() || title.trim().length > 200
    || (description !== null && (typeof description !== 'string' || description.trim().length > 10_000))) {
    return NextResponse.json({ error: 'تحقق من المنتج ورمز اللغة والعنوان والوصف.' }, { status: 400 });
  }
  const product = await prisma.product.findFirst({ where: { id: productId, isDeleted: false }, select: { id: true } });
  if (!product) return NextResponse.json({ error: 'المنتج غير موجود أو محذوف.' }, { status: 404 });
  try {
    const translation = await prisma.productTranslation.update({
      where: { id },
      data: { productId, language, title: title.trim(), description: typeof description === 'string' ? description.trim() || null : null },
      select: { id: true, productId: true, language: true, title: true, description: true, product: { select: { title: true } } },
    });
    return NextResponse.json({ translation });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'توجد ترجمة لهذه اللغة على المنتج نفسه.' }, { status: 409 });
    console.error('Unable to update product translation:', error);
    return NextResponse.json({ error: 'تعذر تحديث الترجمة.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف الترجمة غير صالح.' }, { status: 400 });
  try {
    await prisma.productTranslation.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return NextResponse.json({ error: 'الترجمة غير موجودة.' }, { status: 404 });
    console.error('Unable to delete product translation:', error);
    return NextResponse.json({ error: 'تعذر حذف الترجمة.' }, { status: 500 });
  }
}
