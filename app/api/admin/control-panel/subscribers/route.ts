import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination } from '@/lib/api/validation.mjs';
import {
  countActiveNewsletterSubscribers,
  listActiveNewsletterSubscribers,
} from '@/lib/newsletter/repository.mjs';

export async function GET(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.marketing.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });
  try {
    const [items, totalCount] = await Promise.all([
      listActiveNewsletterSubscribers({ skip, take: limit }),
      countActiveNewsletterSubscribers(),
    ]);
    return NextResponse.json({ items, page, totalCount, hasMore: skip + items.length < totalCount }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    console.error('Unable to load newsletter subscribers:', error);
    return NextResponse.json({ error: 'تعذر تحميل المشتركين.' }, { status: 500 });
  }
}
