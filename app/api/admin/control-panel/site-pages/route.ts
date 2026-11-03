import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { createManagedSitePage } from '@/lib/site/service.mjs';
import { createSitePage, listSitePages } from '@/lib/site/repository';

export async function GET() {
  const admin = await getControlPanelAdmin('control_panel.content.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  try {
    const pages = await listSitePages();
    return NextResponse.json({ pages }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load site pages:', error);
    return NextResponse.json({ error: 'تعذر تحميل صفحات الموقع. تحقق من تطبيق ترحيل قاعدة البيانات.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.content.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });

  try {
    const result = await createManagedSitePage(parsed.value, { create: createSitePage });
    if (result.status === 'invalid') {
      return NextResponse.json({ error: 'أدخل رابطًا إنجليزيًا صالحًا وعنوانًا ومحتوى لا يتجاوز 20000 حرف.' }, { status: 400 });
    }
    if (result.status === 'conflict') return NextResponse.json({ error: 'يوجد بالفعل صفحة بهذا الرابط.' }, { status: 409 });
    return NextResponse.json({ page: result.page }, { status: 201 });
  } catch (error) {
    console.error('Unable to create site page:', error);
    return NextResponse.json({ error: 'تعذر إنشاء الصفحة.' }, { status: 500 });
  }
}
