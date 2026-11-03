import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { areValidProductImageUrls } from '@/lib/api/product-media-validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { replaceProductMedia } from '@/lib/admin/product-media.mjs';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.catalog.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'معرف المنتج غير صالح.' }, { status: 400 });
  }

  const parsed = await readJsonBody(request, 64 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value) || !areValidProductImageUrls(parsed.value.images)) {
    return NextResponse.json({ error: 'روابط الصور غير صالحة.' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!product) return NextResponse.json({ error: 'المنتج غير موجود.' }, { status: 404 });

    await prisma.$transaction((transaction) =>
      replaceProductMedia(transaction, id, parsed.value.images),
    );

    return NextResponse.json({ id, images: parsed.value.images });
  } catch (error) {
    console.error('Unable to replace product media:', error);
    return NextResponse.json({ error: 'تعذر حفظ صور المنتج.' }, { status: 500 });
  }
}
