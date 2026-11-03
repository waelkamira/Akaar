import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { listPublicCatalogProducts, normalizeCatalogSort } from '@/lib/catalog/public-products';
import {
  formatCatalogPrice,
  getAvailableInventory,
  getCatalogImageSource,
  getCurrentCatalogPrices,
} from '@/lib/catalog/presentation.mjs';

type Props = {
  searchParams: Promise<{
    page?: string | string[];
    q?: string | string[];
    category?: string | string[];
    sort?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: 'المنتجات | Akaar',
  description: 'تصفح المنتجات المعتمدة والمتاحة من متاجر Akaar.',
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const pageValue = Number(typeof params.page === 'string' ? params.page : params.page?.[0]);
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? Math.min(pageValue, 100_000) : 1;
  const queryValue = typeof params.q === 'string' ? params.q : params.q?.[0];
  const categoryValue = typeof params.category === 'string' ? params.category : params.category?.[0];
  const sortValue = typeof params.sort === 'string' ? params.sort : params.sort?.[0];
  const query = queryValue?.trim().slice(0, 100) ?? '';
  const category = categoryValue?.trim().slice(0, 80) ?? '';
  const sort = normalizeCatalogSort(sortValue);
  const { products, totalCount, categories, limit } = await listPublicCatalogProducts({
    page,
    query,
    categorySlug: category,
    sort,
  });
  const hasMore = page * limit < totalCount;

  return (
    <main dir="rtl" className="min-h-screen bg-ak-ink px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-ak-line bg-gradient-to-br from-ak-raised via-ak-surface to-ak-canvas p-6 sm:p-10">
          <p className="text-xs font-semibold tracking-widest text-ak-amber">A KAAR MARKETPLACE</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">اكتشف المنتجات</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ak-muted">
            منتجات منشورة من المتاجر المعتمدة، بأسعار حالية ومخزون محسوب من المستودعات النشطة.
          </p>
          <form action="/products" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="product-query">ابحث عن منتج أو متجر</label>
            <input
              id="product-query"
              name="q"
              defaultValue={query}
              maxLength={100}
              placeholder="ابحث عن منتج أو متجر"
              className="min-h-12 flex-1 rounded-xl border border-ak-line bg-ak-ink/70 px-4 text-sm outline-none focus:border-ak-amber"
            />
            {category && <input type="hidden" name="category" value={category} />}
            <label className="sr-only" htmlFor="product-sort">ترتيب المنتجات</label>
            <select
              id="product-sort"
              name="sort"
              defaultValue={sort}
              className="min-h-12 rounded-xl border border-ak-line bg-ak-ink/70 px-4 text-sm outline-none focus:border-ak-amber"
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="title-asc">الاسم: أ-ي</option>
              <option value="title-desc">الاسم: ي-أ</option>
            </select>
            <button type="submit" className="min-h-12 rounded-xl bg-ak-amber px-6 font-bold text-ak-ink hover:bg-ak-honey">
              تطبيق
            </button>
          </form>
        </header>

        <nav aria-label="فئات المنتجات" className="mt-6 flex flex-wrap gap-2">
          <Link
            href={catalogHref(1, query, '', sort)}
            aria-current={!category ? 'page' : undefined}
            className={`rounded-full border px-4 py-2 text-sm ${!category ? 'border-ak-amber bg-ak-amber/10 text-ak-honey' : 'border-ak-line text-ak-muted hover:border-ak-amber/50'}`}
          >
            جميع الفئات
          </Link>
          {categories.map((item) => {
            const href = new URLSearchParams({
              ...(query ? { q: query } : {}),
              ...(sort !== 'newest' ? { sort } : {}),
              category: item.slug,
            });
            return (
              <Link
                key={item.slug}
                href={`/products?${href.toString()}`}
                aria-current={category === item.slug ? 'page' : undefined}
                className={`rounded-full border px-4 py-2 text-sm ${category === item.slug ? 'border-ak-amber bg-ak-amber/10 text-ak-honey' : 'border-ak-line text-ak-muted hover:border-ak-amber/50'}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mb-5 mt-8 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold">المنتجات المتاحة</h2>
          <p className="text-sm text-ak-muted">{totalCount} منتج</p>
        </div>

        {products.length ? (
          <section aria-label="قائمة المنتجات" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const image = product.media.find((media) => media.mediaType === 'IMAGE');
              const imageSource = getCatalogImageSource(image?.storageKey);
              const available = product.variants.reduce(
                (sum, variant) => sum + getAvailableInventory(variant.inventory, product.store.seller.id),
                0,
              );
              const price = product.variants
                .flatMap((variant) => getCurrentCatalogPrices(variant.prices))[0];
              return (
                <article key={product.id} className="overflow-hidden rounded-2xl border border-ak-line bg-ak-surface">
                  <Link href={`/products/${product.id}`} className="group block">
                    <div className="relative aspect-[4/3] bg-ak-raised">
                      {imageSource ? (
                        <Image
                          src={imageSource}
                          alt={image?.altText || product.title}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-ak-muted">
                          الصورة غير متاحة
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 p-4">
                      <p className="line-clamp-2 min-h-12 font-bold leading-6">{product.title}</p>
                      <p className="text-sm text-ak-muted">{product.store.name}</p>
                      {price ? (
                        <p className="font-bold text-ak-honey">{formatCatalogPrice({
                          amount: price.amount.toString(),
                          currency: price.currency,
                          currencyRef: price.currencyRef,
                        })}</p>
                      ) : (
                        <p className="text-sm text-ak-muted">السعر غير متاح حاليًا</p>
                      )}
                      <p className={`text-xs ${available > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {available > 0 ? 'متوفر' : 'غير متوفر حاليًا'}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="rounded-2xl border border-ak-line bg-ak-surface px-5 py-12 text-center">
            <h2 className="text-lg font-bold">لا توجد منتجات مطابقة</h2>
            <p className="mt-2 text-sm text-ak-muted">جرّب تغيير عبارة البحث أو اختيار فئة أخرى.</p>
          </section>
        )}

        {(page > 1 || hasMore) && (
          <nav aria-label="صفحات المنتجات" className="mt-8 flex justify-center gap-3">
            {page > 1 && (
              <Link href={catalogHref(page - 1, query, category, sort)} className="rounded-xl border border-ak-line px-4 py-3 text-sm hover:border-ak-amber/50">
                السابقة
              </Link>
            )}
            <span className="rounded-xl border border-ak-amber/20 bg-ak-amber/10 px-4 py-3 text-sm text-ak-honey">صفحة {page}</span>
            {hasMore && (
              <Link href={catalogHref(page + 1, query, category, sort)} className="rounded-xl border border-ak-line px-4 py-3 text-sm hover:border-ak-amber/50">
                التالية
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}

function catalogHref(page: number, query: string, category: string, sort: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (query) params.set('q', query);
  if (category) params.set('category', category);
  if (sort !== 'newest') params.set('sort', sort);
  return `/products?${params.toString()}`;
}
