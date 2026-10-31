import { NextResponse } from 'next/server';
import { readManagedSitePage } from '@/lib/site/content';

export async function GET(_request: Request, context: RouteContext<'/api/site-pages/[slug]'>) {
  const { slug } = await context.params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 64) {
    return NextResponse.json({ error: 'الصفحة غير موجودة.' }, { status: 404 });
  }

  try {
    const page = await readManagedSitePage(slug);
    if (!page) return NextResponse.json({ error: 'الصفحة غير موجودة.' }, { status: 404 });
    return NextResponse.json({ page }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load public site page:', error);
    return NextResponse.json({ error: 'تعذر تحميل الصفحة.' }, { status: 500 });
  }
}
