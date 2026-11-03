import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getControlPanelAdmin('control_panel.stores.manage');
  if (!admin) {
    return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });
  }

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'معرف البائع غير صالح.' }, { status: 400 });
  }
  const seller = await prisma.seller.findUnique({
    where: { id },
    select: {
      userId: true,
      documents: {
        where: { type: 'IDENTITY' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { storageKey: true },
      },
    },
  });
  const identityDocument = seller?.documents[0]?.storageKey;
  if (!seller || !identityDocument) {
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
    const document = await imagekit.getFileDetails(identityDocument);
    const documentTags = document.tags ?? [];
    if (
      !document.isPrivateFile
      || !documentTags.includes('akaar-seller-identity')
      || !documentTags.includes(`user-${seller.userId}`)
    ) {
      console.error('Seller identity document failed privacy or ownership validation:', seller.id);
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
