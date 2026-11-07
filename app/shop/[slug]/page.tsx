import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductRatingSummaries, getStoreRatingSummaries } from '@/lib/reviews/ratings';
import ReviewWidget from '@/components/Reviews/ReviewWidget';
import { findPublicStoreHeader } from '@/lib/stores/public-store';
import { listPublicCatalogProducts } from '@/lib/catalog/public-products';
import {
  formatCatalogPrice,
  getAvailableInventory,
  getCatalogImageSource,
  getCurrentCatalogPrices,
} from '@/lib/catalog/presentation.mjs';
import StorefrontCatalog from './storefront-catalog';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await findPublicStoreHeader(slug);
  if (!store) return { title: 'المتجر غير موجود | Akaar' };

  const description = store.description?.trim() || `تصفح منتجات ${store.name} على Akaar.`;
  return {
    title: `${store.name} | Akaar`,
    description,
    openGraph: { title: `${store.name} | Akaar`, description, images: store.logoUrl ? [store.logoUrl] : undefined },
  };
}

export default async function PublicShopPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const paramsValue = await searchParams;
  const store = await findPublicStoreHeader(slug);
  if (!store) notFound();

  const requestedPage = Number(paramsValue.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 100_000) : 1;
  const category = typeof paramsValue.category === 'string' ? paramsValue.category.trim().slice(0, 80) : '';
  const query = typeof paramsValue.q === 'string' ? paramsValue.q.trim().slice(0, 100) : '';
  const [{ products, totalCount, categories, limit }, storeRatings] = await Promise.all([
    listPublicCatalogProducts({
      page,
      query,
      categorySlug: category,
      sort: 'newest',
      storeId: store.id,
    }),
    getStoreRatingSummaries([store.seller.id]),
  ]);
  const productRatings = await getProductRatingSummaries(products.map((product) => product.id));
  const storeRating = storeRatings.get(store.seller.id);
  const ratedProducts = products.map((product) => {
    const image = product.media.find((media) => media.mediaType === 'IMAGE');
    const price = product.variants.flatMap((variant) => getCurrentCatalogPrices(variant.prices))[0];
    return {
      id: product.id,
      title: product.title,
      image: getCatalogImageSource(image?.storageKey),
      priceLabel: price ? formatCatalogPrice({
        amount: price.amount.toString(),
        currency: price.currency,
        currencyRef: price.currencyRef,
      }) : null,
      availableStock: product.variants.reduce(
        (sum, variant) => sum + getAvailableInventory(variant.inventory, store.seller.id),
        0,
      ),
      categoryName: product.categories[0]?.category.name ?? 'منتجات المتجر',
      averageRating: productRatings.get(product.id)?.average ?? null,
      reviewCount: productRatings.get(product.id)?.count ?? 0,
    };
  });

  return (
    <main dir="rtl" className="min-h-screen bg-ak-ink px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-3xl border border-ak-line bg-gradient-to-br from-ak-raised via-ak-surface to-ak-canvas p-6 sm:p-10 shadow-ak-panel">
          <div className="absolute -left-12 -top-20 h-64 w-64 rounded-full bg-ak-amber/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            {store.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={store.logoUrl} alt="" className="h-20 w-20 rounded-2xl border border-ak-line object-cover" />
            ) : (
              <div aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-2xl border border-ak-amber/30 bg-ak-amber/10 text-3xl font-black text-ak-honey">{store.name.slice(0, 1)}</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-widest text-ak-amber">متجر معتمد</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">{store.name}</h1>
              <p className="mt-2 text-sm text-amber-300">{storeRating ? `★ ${storeRating.average.toFixed(1)} · ${storeRating.count} تقييم` : 'لا توجد تقييمات للمتجر بعد'}</p>
              {store.description && <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-stone-300">{store.description}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/messages?storeId=${encodeURIComponent(store.id)}`}
                className="rounded-xl bg-ak-amber px-4 py-3 text-sm font-bold text-ak-ink hover:bg-ak-honey"
              >
                راسل المتجر
              </Link>
              <Link href="/search" className="rounded-xl border border-ak-line px-4 py-3 text-sm hover:border-ak-amber/50">اكتشف المزيد</Link>
            </div>
          </div>
          {(store.contactEmail || store.contactPhone) && <div className="relative mt-6 flex flex-wrap gap-4 border-t border-ak-line pt-4 text-sm text-stone-300">
            {store.contactEmail && <a href={`mailto:${store.contactEmail}`} className="hover:text-ak-honey">{store.contactEmail}</a>}
            {store.contactPhone && <a href={`tel:${store.contactPhone}`} dir="ltr" className="hover:text-ak-honey">{store.contactPhone}</a>}
          </div>}
        </header>

        {store.pages.length > 0 && <section className="mt-7 grid gap-4 md:grid-cols-2">
          {store.pages.map((page) => <article key={page.slug} id={page.slug} className="rounded-2xl border border-ak-line bg-ak-surface p-5">
            <h2 className="text-lg font-bold">{page.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-300">{page.content}</p>
          </article>)}
        </section>}

        <div className="mt-6">
          <ReviewWidget targetType="store" targetId={store.seller.id} title={`قيّم متجر ${store.name}`} />
        </div>

        <section className="mt-9">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-semibold tracking-widest text-ak-amber">STORE CATALOG</p><h2 className="mt-2 text-2xl font-bold">منتجات المتجر</h2></div>
            <p className="text-sm text-stone-500">{totalCount} منتج</p>
          </div>
          <StorefrontCatalog
            products={ratedProducts}
            categories={categories.map(({ slug, name }) => ({ slug, name }))}
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
