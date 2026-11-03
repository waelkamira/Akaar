import { NextResponse } from 'next/server';
import { normalizeAnalyticsPath } from '@/lib/analytics/normalize-path.mjs';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { recordDailyPageView } from '@/lib/analytics/service.mjs';
import { incrementDailyVisit } from '@/lib/analytics/repository';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'الطلب غير مسموح.' }, { status: 403 });
  }

  const rateLimit = await consumeDurableRateLimit({ request, scope: 'analytics-page-view', limit: 120, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'تم تجاوز الحد المسموح.' }, {
      status: rateLimit.configured ? 429 : 503,
      headers: rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined,
    });
  }

  const parsed = await readJsonBody(request, 2 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const path = typeof parsed.value.path === 'string' ? parsed.value.path : '';
  if (!path.startsWith('/') || path.startsWith('//') || path.length > 180 || /[?#\u0000-\u001f]/.test(path)) {
    return NextResponse.json({ error: 'مسار الصفحة غير صالح.' }, { status: 400 });
  }
  const aggregatePath = normalizeAnalyticsPath(path);
  if (!aggregatePath) return new NextResponse(null, { status: 204 });

  try {
    const recorded = await recordDailyPageView(aggregatePath, { incrementDailyVisit });
    if (!recorded) return NextResponse.json({ error: 'جدول التحليلات غير مهيأ.' }, { status: 503 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Unable to record aggregate page view:', error);
    return NextResponse.json({ error: 'تعذر تسجيل زيارة الصفحة.' }, { status: 500 });
  }
}
