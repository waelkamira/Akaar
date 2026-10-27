import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isUploadRequestTooLarge, safeImageFileName, validateImageContent, validateImageFile } from '@/lib/uploads/validate-image.mjs';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ success: false, error: 'يجب تسجيل الدخول لرفع الصور.' }, { status: 401 });
  if (isUploadRequestTooLarge(request)) return NextResponse.json({ success: false, error: 'حجم طلب الرفع أكبر من الحد المسموح.' }, { status: 413 });

  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_API_KEY;
  if (!apiKey || !secretKey) {
    return NextResponse.json({ success: false, error: 'خدمة رفع الصور غير مهيأة على الخادم.' }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file') || form.get('image');
    const validationError = validateImageFile(file);
    if (validationError) return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    const contentError = await validateImageContent(file);
    if (contentError) return NextResponse.json({ success: false, error: contentError }, { status: 400 });

    const uploadForm = new FormData();
    uploadForm.append('file', file, safeImageFileName(file.name));
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { pinata_api_key: apiKey, pinata_secret_api_key: secretKey },
      body: uploadForm,
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.IpfsHash) {
      console.error('Pinata upload failed with status:', response.status);
      return NextResponse.json({ success: false, error: 'تعذر رفع الصورة إلى خدمة التخزين.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: { url: `https://ipfs.io/ipfs/${payload.IpfsHash}` } });
  } catch (error) {
    console.error('IPFS upload failed:', error);
    return NextResponse.json({ success: false, error: 'تعذر رفع الصورة حاليًا.' }, { status: 500 });
  }
}
