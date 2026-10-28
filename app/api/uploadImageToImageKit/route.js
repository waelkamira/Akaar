import { NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import ImageKit from 'imagekit';
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

  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    return NextResponse.json({ success: false, error: 'خدمة رفع الصور غير مهيأة على الخادم.' }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file') || form.get('image');
    const validationError = validateImageFile(file);
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    const contentError = await validateImageContent(file);
    if (contentError) return NextResponse.json({ success: false, error: contentError }, { status: 400 });

    const imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });
    const buffer = Buffer.from(await file.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: `akaar-${Date.now()}-${safeImageFileName(file.name)}`,
      useUniqueFileName: true,
      tags: ['akaar', `user-${user.id}`],
    });

    return NextResponse.json({ success: true, data: { url: response.url } });
  } catch (error) {
    console.error('ImageKit upload failed:', error);
    return NextResponse.json({ success: false, error: 'تعذر رفع الصورة حاليًا.' }, { status: 502 });
  }
}
