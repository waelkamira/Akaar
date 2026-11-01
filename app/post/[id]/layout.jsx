import { prisma } from '@/lib/db/prisma';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: {
      id,
      isActive: true,
      isDeleted: false,
      approvalStatus: 'APPROVED',
      category: { isActive: true },
      OR: [
        { sellerId: null },
        { seller: { is: { status: 'ACTIVE', isVerified: true } } },
      ],
    },
    select: {
      title: true,
      description: true,
      categoryName: true,
      images: true,
    },
  });

  if (!product) {
    return {
      title: 'المنتج غير متاح | Akaar',
      robots: { index: false, follow: true },
    };
  }

  const description = product.description?.trim().slice(0, 300)
    || `تعرّف على ${product.title} في فئة ${product.categoryName} على Akaar.`;
  const canonical = `/post/${encodeURIComponent(id)}`;

  return {
    title: `${product.title} | Akaar`,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${product.title} | Akaar`,
      description,
      url: canonical,
      images: product.images.slice(0, 4),
    },
    twitter: {
      card: product.images.length ? 'summary_large_image' : 'summary',
      title: `${product.title} | Akaar`,
      description,
      images: product.images.slice(0, 1),
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
