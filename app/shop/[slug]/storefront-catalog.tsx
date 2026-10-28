'use client';

import Link from 'next/link';
import StorefrontProductCard from './storefront-product-card';

type Product = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  basePrice: number | null;
  stockQuantity: number | null;
  categoryName: string;
  city: string | null;
};

export default function StorefrontCatalog({
  products,
  categories,
  slug,
  page,
  hasMore,
  query,
  selectedCategory,
}: {
  products: Product[];
  categories: string[];
  slug: string;
  page: number;
  hasMore: boolean;
  query: string;
  selectedCategory: string;
}) {
  const basePath = `/shop/${encodeURIComponent(slug)}`;
  const previous = new URLSearchParams({ page: String(page - 1) });
  const next = new URLSearchParams({ page: String(page + 1) });
  for (const params of [previous, next]) {
    if (query) params.set('q', query);
    if (selectedCategory) params.set('category', selectedCategory);
  }

  if (!products.length && page === 1) {
    return <div className="rounded-2xl border border-ak-line bg-ak-surface p-10 text-center text-stone-400">لا توجد منتجات منشورة في هذا المتجر بعد.</div>;
  }

  return (
    <>
      <form method="get" action={basePath} className="mb-5 grid gap-3 sm:grid-cols-[1fr_240px_auto]">
        <label className="sr-only" htmlFor="shop-query">ابحث في المتجر</label>
        <input id="shop-query" name="q" type="search" defaultValue={query} maxLength={100} placeholder="ابحث ضمن منتجات المتجر" className="rounded-xl border border-ak-line bg-ak-surface px-4 py-3 text-sm outline-none focus:border-ak-amber/50" />
        <label className="sr-only" htmlFor="shop-category">تصفية حسب الفئة</label>
        <select id="shop-category" name="category" defaultValue={selectedCategory} className="rounded-xl border border-ak-line bg-ak-surface px-4 py-3 text-sm outline-none focus:border-ak-amber/50">
          <option value="">كل الفئات</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="submit" className="rounded-xl bg-ak-amber px-5 py-3 text-sm font-bold text-ak-canvas">تصفية</button>
      </form>
      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <StorefrontProductCard key={product.id} product={product} />)}
        </div>
      ) : <p className="rounded-2xl border border-ak-line bg-ak-surface p-10 text-center text-stone-400">لا توجد نتائج مطابقة للفلاتر المحددة.</p>}
      {(page > 1 || hasMore) && <nav aria-label="صفحات منتجات المتجر" className="mt-8 flex justify-center gap-3">
        {page > 1 && <Link href={`${basePath}?${previous}`} className="rounded-xl border border-ak-line px-4 py-3 text-sm">السابقة</Link>}
        <span className="rounded-xl bg-ak-amber/10 px-4 py-3 text-sm text-ak-honey">صفحة {page}</span>
        {hasMore && <Link href={`${basePath}?${next}`} className="rounded-xl border border-ak-line px-4 py-3 text-sm">التالية</Link>}
      </nav>}
    </>
  );
}
