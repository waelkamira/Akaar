import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

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
      const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { confirmationTokenHash: hashToken(token) }, select: { id: true } });
      if (!subscriber) return NextResponse.json({ error: 'الرابط غير صالح أو سبق استخدامه.' }, { status: 400 });
      await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: { confirmedAt: new Date(), confirmationTokenHash: null },
      });
      return NextResponse.json({ message: 'تم تأكيد اشتراكك.' });
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { unsubscribeTokenHash: hashToken(token) }, select: { id: true } });
    if (!subscriber) return NextResponse.json({ error: 'الرابط غير صالح أو سبق استخدامه.' }, { status: 400 });
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { unsubscribedAt: new Date(), confirmationTokenHash: null, unsubscribeTokenHash: null },
    });
    return NextResponse.json({ message: 'تم إلغاء الاشتراك.' });
  } catch (error) {
    console.error('Unable to process newsletter consent:', error);
    return NextResponse.json({ error: 'تعذر تحديث الاشتراك.' }, { status: 500 });
  }
}
