import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });
  }

  const { id } = await params;
  const seller = await prisma.seller.findUnique({
    where: { id },
    select: { identityDocumentFileId: true },
  });
  if (!seller?.identityDocumentFileId) {
    return NextResponse.json({ error: 'وثيقة الهوية غير متاحة.' }, { status: 404 });
  }

  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    return NextResponse.json({ error: 'خدمة عرض الوثائق غير مهيأة.' }, { status: 503 });
  }

  try {
    const imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });
    const document = await imagekit.getFileDetails(seller.identityDocumentFileId);
    if (!document.isPrivateFile) {
      console.error('Seller identity document is not private:', seller.identityDocumentFileId);
      return NextResponse.json({ error: 'تعذر عرض وثيقة الهوية بأمان.' }, { status: 500 });
    }
    const signedUrl = imagekit.url({
      path: document.filePath,
      signed: true,
      expireSeconds: 300,
    });

    return NextResponse.redirect(signedUrl, {
      headers: {
        'Cache-Control': 'private, no-store',
        'Referrer-Policy': 'no-referrer',
      },
    });
  } catch (error) {
    console.error('Unable to generate seller identity document link:', error);
    return NextResponse.json({ error: 'تعذر فتح وثيقة الهوية.' }, { status: 502 });
  }
}
