import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
type SitePageRecord = { slug: string; title: string; content: string; updatedAt: Date };

export async function PATCH(request: Request, context: RouteContext<'/api/admin/control-panel/site-pages/[slug]'>) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { slug } = await context.params;
  if (!slugPattern.test(slug) || slug.length > 64) return NextResponse.json({ error: 'رابط الصفحة غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });

  const title = typeof parsed.value.title === 'string' ? parsed.value.title.trim() : '';
  const content = typeof parsed.value.content === 'string' ? parsed.value.content.trim() : '';
  if (!title || title.length > 160 || !content || content.length > 20_000) {
    return NextResponse.json({ error: 'أدخل عنوانًا ومحتوى صالحًا لا يتجاوز 20000 حرف.' }, { status: 400 });
  }

  try {
    const [page] = await prisma.$queryRaw<SitePageRecord[]>`
      UPDATE public.site_pages
      SET "title" = ${title},
          "content" = ${content},
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "slug" = ${slug}
      RETURNING "slug", "title", "content", "updatedAt"
    `;
    if (!page) return NextResponse.json({ error: 'الصفحة غير موجودة.' }, { status: 404 });
    return NextResponse.json({ page });
  } catch (error) {
    console.error('Unable to update site page:', error);
    return NextResponse.json({ error: 'تعذر تحديث الصفحة.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext<'/api/admin/control-panel/site-pages/[slug]'>) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { slug } = await context.params;
  if (!slugPattern.test(slug) || slug.length > 64) return NextResponse.json({ error: 'رابط الصفحة غير صالح.' }, { status: 400 });

  try {
    const deleted = await prisma.$queryRaw<Array<{ slug: string }>>`
      DELETE FROM public.site_pages
      WHERE "slug" = ${slug}
      RETURNING "slug"
    `;
    if (!deleted.length) return NextResponse.json({ error: 'الصفحة غير موجودة.' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Unable to delete site page:', error);
    return NextResponse.json({ error: 'تعذر حذف الصفحة.' }, { status: 500 });
  }
}
