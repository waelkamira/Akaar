import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import StorefrontCatalog from './storefront-catalog';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
};

async function getStoreHeader(slug: string) {
  return prisma.seller.findFirst({
    where: { slug, status: 'ACTIVE', isVerified: true },
    select: {
      id: true,
      storeName: true,
      slug: true,
      description: true,
      logo: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreHeader(slug);
  if (!store) return { title: 'المتجر غير موجود | Akaar' };

  const description = store.description?.trim() || `تصفح منتجات ${store.storeName} على Akaar.`;
  return {
    title: `${store.storeName} | Akaar`,
    description,
    openGraph: { title: `${store.storeName} | Akaar`, description, images: store.logo ? [store.logo] : undefined },
  };
}

export default async function PublicShopPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const paramsValue = await searchParams;
  const store = await getStoreHeader(slug);
  if (!store) notFound();

  const requestedPage = Number(paramsValue.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 100_000) : 1;
  const limit = 24;
  const category = typeof paramsValue.category === 'string' ? paramsValue.category.trim().slice(0, 100) : '';
  const query = typeof paramsValue.q === 'string' ? paramsValue.q.trim().slice(0, 100) : '';
  const baseWhere = {
    sellerId: store.id,
    isDeleted: false,
    isActive: true,
    approvalStatus: 'APPROVED' as const,
    category: { isActive: true },
  };
  const where = {
    ...baseWhere,
    ...(category ? { categoryName: category } : {}),
    ...(query ? { OR: [{ title: { contains: query, mode: 'insensitive' as const } }, { description: { contains: query, mode: 'insensitive' as const } }] } : {}),
  };
  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        images: true,
        basePrice: true,
        stockQuantity: true,
        categoryName: true,
        city: true,
      },
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: baseWhere,
      distinct: ['categoryName'],
      orderBy: { categoryName: 'asc' },
      select: { categoryName: true },
    }),
  ]);

  return (
    <main dir="rtl" className="min-h-screen bg-ak-ink px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-3xl border border-ak-line bg-gradient-to-br from-ak-raised via-ak-surface to-ak-canvas p-6 sm:p-10 shadow-ak-panel">
          <div className="absolute -left-12 -top-20 h-64 w-64 rounded-full bg-ak-amber/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            {store.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={store.logo} alt="" className="h-20 w-20 rounded-2xl border border-ak-line object-cover" />
            ) : (
              <div aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-2xl border border-ak-amber/30 bg-ak-amber/10 text-3xl font-black text-ak-honey">{store.storeName.slice(0, 1)}</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-widest text-ak-amber">متجر معتمد</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">{store.storeName}</h1>
              {store.description && <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-stone-300">{store.description}</p>}
            </div>
            <Link href="/search" className="rounded-xl border border-ak-line px-4 py-3 text-sm hover:border-ak-amber/50">اكتشف المزيد</Link>
          </div>
        </header>

        <section className="mt-9">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-semibold tracking-widest text-ak-amber">STORE CATALOG</p><h2 className="mt-2 text-2xl font-bold">منتجات المتجر</h2></div>
            <p className="text-sm text-stone-500">{store.products.length} منتج</p>
          </div>
          <StorefrontCatalog
            products={products}
            categories={categories.map(({ categoryName }) => categoryName)}
            slug={store.slug}
            page={page}
            hasMore={page * limit < totalCount}
            query={query}
            selectedCategory={category}
          />
        </section>
      </div>
    </main>
  );
}
