import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import {
  isUploadRequestTooLarge,
  validateImageContent,
  validateImageFile,
} from '@/lib/uploads/validate-image.mjs';

export const runtime = 'nodejs';

const fileExtensions: Record<string, string> = {
  'image/avif': 'avif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'سجّل الدخول لرفع وثيقة الهوية.' }, { status: 401 });
  }

  const rateLimit = await consumeDurableRateLimit({
    request,
    scope: 'seller-identity-upload',
    limit: 5,
    windowMs: 60 * 60 * 1000,
    identity: user.id,
  });
  if (!rateLimit.allowed) {
    const status = Boolean(rateLimit.reason) || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds
      ? { 'Retry-After': String(rateLimit.retryAfterSeconds) }
      : undefined;
    return NextResponse.json(
      { error: status === 429 ? 'تجاوزت حد رفع الوثائق. حاول لاحقًا.' : 'خدمة الحماية غير متاحة حاليًا.' },
      { status, headers },
    );
  }

  if (isUploadRequestTooLarge(request)) {
    return NextResponse.json({ error: 'حجم ملف الهوية أكبر من الحد المسموح.' }, { status: 413 });
  }

  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    return NextResponse.json({ error: 'خدمة رفع الوثائق غير مهيأة على الخادم.' }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'ملف صورة الهوية مطلوب.' }, { status: 400 });
    }
    const fileError = validateImageFile(file);
    if (fileError) return NextResponse.json({ error: fileError }, { status: 400 });

    const contentError = await validateImageContent(file);
    if (contentError) return NextResponse.json({ error: contentError }, { status: 400 });

    const imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });
    const uploaded = await imagekit.upload({
      file: Buffer.from(await file.arrayBuffer()),
      fileName: `identity-${randomUUID()}.${fileExtensions[file.type]}`,
      folder: '/seller-identity-documents',
      useUniqueFileName: false,
      isPrivateFile: true,
      tags: ['akaar-seller-identity', `user-${user.id}`],
    });

    return NextResponse.json({ fileId: uploaded.fileId }, { status: 201 });
  } catch (error) {
    console.error('Unable to upload seller identity document:', error);
    return NextResponse.json({ error: 'تعذر رفع صورة الهوية حاليًا.' }, { status: 502 });
  }
}
