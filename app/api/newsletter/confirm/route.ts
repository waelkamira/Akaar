import { NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import {
  consumeNewsletterConfirmationToken,
  consumeNewsletterUnsubscribeToken,
} from '@/lib/newsletter/repository.mjs';
import { hashNewsletterToken } from '@/lib/newsletter/tokens.mjs';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'الطلب غير مسموح.' }, { status: 403 });
  }
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });

  const token = typeof parsed.value.token === 'string' ? parsed.value.token : '';
  const action = parsed.value.action;
  if (!/^[A-Za-z0-9_-]{32,100}$/.test(token) || (action !== 'confirm' && action !== 'unsubscribe')) {
    return NextResponse.json({ error: 'الرابط غير صالح أو منتهي.' }, { status: 400 });
  }

  try {
    if (action === 'confirm') {
      const consumed = await consumeNewsletterConfirmationToken(hashNewsletterToken(token));
      if (!consumed) return NextResponse.json({ error: 'الرابط غير صالح أو سبق استخدامه.' }, { status: 400 });
      return NextResponse.json({ message: 'تم تأكيد اشتراكك.' });
    }

    const consumed = await consumeNewsletterUnsubscribeToken(hashNewsletterToken(token));
    if (!consumed) return NextResponse.json({ error: 'الرابط غير صالح أو سبق استخدامه.' }, { status: 400 });
    return NextResponse.json({ message: 'تم إلغاء الاشتراك.' });
  } catch (error) {
    console.error('Unable to process newsletter consent:', error);
    return NextResponse.json({ error: 'تعذر تحديث الاشتراك.' }, { status: 500 });
  }
}
