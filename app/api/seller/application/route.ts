import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isMarketplaceEnabled } from '@/lib/marketplace/settings';
import { prisma } from '@/lib/db/prisma';
<<<<<<< HEAD
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
=======
import { serializeSellerApplicationDetails } from '@/lib/seller/application.mjs';
>>>>>>> wael-work-in-progress

function makeSlug(value: string) {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  const base = slug || 'shop';
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول للتقديم كبائع.' }, { status: 401 });
  if (!(await isMarketplaceEnabled('sellerApplicationsEnabled'))) {
    return NextResponse.json({ error: 'طلبات البائعين متوقفة حاليًا.' }, { status: 403 });
  }

  const parsedBody = await readJsonBody(request, 16 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as Record<string, unknown>;
  const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
  const storeName = text(body.storeName);
  const contactName = text(body.contactName);
  const contactEmail = text(body.contactEmail).toLowerCase();
  const phoneNumber = text(body.phoneNumber);
  const residence = text(body.residence);
  const businessType = text(body.businessType);
  const sellingCategories = text(body.sellingCategories);
  const intendedProducts = text(body.intendedProducts);
  const description = text(body.description);
  const identityDocumentFileId = text(body.identityDocumentFileId);
  const latitude = body.latitude;
  const longitude = body.longitude;
  const socialUrls = {
    facebookUrl: text(body.facebookUrl),
    youtubeUrl: text(body.youtubeUrl),
    twitterUrl: text(body.twitterUrl),
  };
  const businessTypes = new Set(['INDIVIDUAL', 'STORE', 'ARTISAN', 'AGENCY', 'OTHER']);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
  const normalizedPhone = phoneNumber.replace(/[\s().-]/g, '');
  const validPhone = /^\+?\d{7,15}$/.test(normalizedPhone);
  const validCoordinates =
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;
  const validSocialUrls = Object.values(socialUrls).every((value) => {
    if (!value) return true;
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  });

  if (
    !storeName ||
    storeName.length > 100 ||
    !contactName ||
    contactName.length > 120 ||
    !validEmail ||
    contactEmail.length > 254 ||
    !validPhone ||
    phoneNumber.length > 25 ||
    !residence ||
    residence.length > 240 ||
    !businessTypes.has(businessType) ||
    !sellingCategories ||
    sellingCategories.length > 300 ||
    !intendedProducts ||
    intendedProducts.length < 20 ||
    intendedProducts.length > 4000 ||
    description.length > 2000 ||
    identityDocumentFileId.length > 255 ||
    !validCoordinates ||
    !validSocialUrls
  ) {
    return NextResponse.json(
      { error: 'تحقق من بيانات التواصل والموقع ونشاط المتجر والمنتجات قبل الإرسال.' },
      { status: 400 },
    );
  }

  if (identityDocumentFileId) {
    const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
      return NextResponse.json({ error: 'خدمة التحقق من وثيقة الهوية غير مهيأة.' }, { status: 503 });
    }

    let document: { isPrivateFile: boolean; tags?: string[] | null };
    try {
      const imagekit = new ImageKit({
        publicKey: IMAGEKIT_PUBLIC_KEY,
        privateKey: IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: IMAGEKIT_URL_ENDPOINT,
      });
      document = await imagekit.getFileDetails(identityDocumentFileId);
    } catch (error) {
      console.error('Unable to verify seller identity document:', error);
      return NextResponse.json({ error: 'تعذر التحقق من صورة الهوية. ارفعها مرة أخرى.' }, { status: 502 });
    }
    const documentTags = document.tags ?? [];
    if (
      !document.isPrivateFile ||
      !documentTags.includes('akaar-seller-identity') ||
      !documentTags.includes(`user-${user.id}`)
    ) {
      return NextResponse.json({ error: 'صورة الهوية غير صالحة. ارفع صورة جديدة.' }, { status: 400 });
    }
  }

  try {
    const slug = makeSlug(storeName);
    const seller = await prisma.$transaction(async (transaction) => {
      const createdSeller = await transaction.seller.create({
        data: {
          userId: user.id,
          displayName: storeName,
          slug,
          sellerType: businessType,
          description: description || null,
          status: 'PENDING',
          isVerified: false,
        },
        select: { id: true, displayName: true, slug: true, status: true },
      });
      await transaction.store.create({
        data: {
          sellerId: createdSeller.id,
          name: storeName,
          slug,
          description: description || null,
          defaultLanguage: 'ar',
          isActive: false,
        },
      });
      const verification = await transaction.sellerVerification.create({
        data: {
          sellerId: createdSeller.id,
          status: 'PENDING',
          submittedAt: new Date(),
          notes: serializeSellerApplicationDetails({
            contactName,
            contactEmail,
            phoneNumber,
            residence,
            sellingCategories,
            intendedProducts,
            ...socialUrls,
            latitude,
            longitude,
          }),
        },
        select: { id: true },
      });
      if (identityDocumentFileId) {
        await transaction.sellerDocument.create({
          data: {
            sellerId: createdSeller.id,
            verificationId: verification.id,
            type: 'IDENTITY',
            storageKey: identityDocumentFileId,
            status: 'PENDING',
          },
        });
      }
      await transaction.user.update({
        where: { id: user.id },
        data: { phone: normalizedPhone },
      });
      return createdSeller;
    });

    return NextResponse.json({
      seller: {
        id: seller.id,
        storeName: seller.displayName,
        slug: seller.slug,
        status: seller.status,
      },
    }, { status: 201 });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'لديك طلب بائع أو متجر مسجل بالفعل.' }, { status: 409 });
    }
    console.error('Unable to create seller application:', error);
    return NextResponse.json({ error: 'تعذر إرسال طلب البائع.' }, { status: 500 });
  }
}
