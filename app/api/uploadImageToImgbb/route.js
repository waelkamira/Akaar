import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isUploadRequestTooLarge, safeImageFileName, validateImageContent, validateImageFile } from '@/lib/uploads/validate-image.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ success: false, error: 'يجب تسجيل الدخول لرفع الصور.' }, { status: 401 });

  const rateLimit = await consumeDurableRateLimit({
    request: request,
    scope: 'image-upload',
    limit: 20,
    windowMs: 600000,
    identity: user.id,
  });
  if (!rateLimit.allowed) {
    const status = Boolean(rateLimit.reason) || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined;
    return NextResponse.json({ success: false, error: status === 429 ? 'تم تجاوز حد رفع الصور. حاول لاحقًا.' : 'خدمة الحماية غير متاحة حاليًا.' }, { status, headers });
  }
  if (isUploadRequestTooLarge(request)) return NextResponse.json({ success: false, error: 'حجم طلب الرفع أكبر من الحد المسموح.' }, { status: 413 });

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'خدمة رفع الصور غير مهيأة على الخادم.' }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get('image') || form.get('file');
    const validationError = validateImageFile(file);
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    const contentError = await validateImageContent(file);
    if (contentError) return NextResponse.json({ success: false, error: contentError }, { status: 400 });

    const base64Data = Buffer.from(await file.arrayBuffer()).toString('base64');
    const uploadForm = new FormData();
    uploadForm.append('key', apiKey);
    uploadForm.append('image', base64Data);
    uploadForm.append('name', safeImageFileName(file.name));

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: uploadForm,
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success || !payload?.data?.url) {
      console.error('ImgBB upload failed with status:', response.status);
      return NextResponse.json({ success: false, error: 'تعذر رفع الصورة إلى خدمة التخزين.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: payload.data });
  } catch (error) {
    console.error('ImgBB upload failed:', error);
    return NextResponse.json({ success: false, error: 'تعذر رفع الصورة حاليًا.' }, { status: 502 });
  }
}
