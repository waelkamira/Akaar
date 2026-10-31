import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
type SitePageRecord = { slug: string; title: string; content: string; updatedAt: Date };

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  try {
    const pages = await prisma.$queryRaw<SitePageRecord[]>`
      SELECT "slug", "title", "content", "updatedAt"
      FROM public.site_pages
      ORDER BY "slug" ASC
    `;
    return NextResponse.json({ pages }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load site pages:', error);
    return NextResponse.json({ error: 'تعذر تحميل صفحات الموقع. تحقق من تطبيق ترحيل قاعدة البيانات.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });

  const slug = typeof parsed.value.slug === 'string' ? parsed.value.slug.trim() : '';
  const title = typeof parsed.value.title === 'string' ? parsed.value.title.trim() : '';
  const content = typeof parsed.value.content === 'string' ? parsed.value.content.trim() : '';
  if (!slugPattern.test(slug) || slug.length > 64 || !title || title.length > 160 || !content || content.length > 20_000) {
    return NextResponse.json({ error: 'أدخل رابطًا إنجليزيًا صالحًا وعنوانًا ومحتوى لا يتجاوز 20000 حرف.' }, { status: 400 });
  }

  try {
    const [page] = await prisma.$queryRaw<SitePageRecord[]>`
      INSERT INTO public.site_pages ("slug", "title", "content", "updatedAt")
      VALUES (${slug}, ${title}, ${content}, CURRENT_TIMESTAMP)
      ON CONFLICT ("slug") DO NOTHING
      RETURNING "slug", "title", "content", "updatedAt"
    `;
    if (!page) return NextResponse.json({ error: 'يوجد بالفعل صفحة بهذا الرابط.' }, { status: 409 });
    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error('Unable to create site page:', error);
    return NextResponse.json({ error: 'تعذر إنشاء الصفحة.' }, { status: 500 });
  }
}
