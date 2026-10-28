import { NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isUploadRequestTooLarge, safeImageFileName, validateImageContent, validateImageFile } from '@/lib/uploads/validate-image.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ success: false, error: 'يجب تسجيل الدخول لرفع الصور.' }, { status: 401 });
  const rateLimit = await enforceRateLimit(request, { namespace: 'image-upload', limit: 20, windowSeconds: 3600 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, error: rateLimit.status === 429 ? 'تم تجاوز الحد المسموح لرفع الصور. حاول لاحقًا.' : 'خدمة الحماية من الطلبات غير متاحة حاليًا.' }, {
      status: rateLimit.status,
      ...(rateLimit.retryAfter ? { headers: { 'Retry-After': String(rateLimit.retryAfter) } } : {}),
    });
  }
  if (isUploadRequestTooLarge(request)) return NextResponse.json({ success: false, error: 'حجم طلب الرفع أكبر من الحد المسموح.' }, { status: 413 });

  const clientId = process.env.IMGUR_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ success: false, error: 'خدمة رفع الصور غير مهيأة على الخادم.' }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get('image') || form.get('file');
    const validationError = validateImageFile(file);
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    const contentError = await validateImageContent(file);
    if (contentError) return NextResponse.json({ success: false, error: contentError }, { status: 400 });

    const uploadForm = new FormData();
    uploadForm.append('image', file, safeImageFileName(file.name));
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: { Authorization: `Client-ID ${clientId}` },
      body: uploadForm,
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success || !payload?.data?.link) {
      console.error('Imgur upload failed with status:', response.status);
      return NextResponse.json({ success: false, error: 'تعذر رفع الصورة إلى خدمة التخزين.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: payload.data });
  } catch (error) {
    console.error('Imgur upload failed:', error);
    return NextResponse.json({ success: false, error: 'تعذر رفع الصورة حاليًا.' }, { status: 502 });
  }
}
