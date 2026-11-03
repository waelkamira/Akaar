'use client';

import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  title: string;
  image: string | null;
  priceLabel: string | null;
  availableStock: number;
  categoryName: string;
  averageRating: number | null;
  reviewCount: number;
};

export default function StorefrontProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-ak-line bg-ak-surface">
      <Link href={`/products/${encodeURIComponent(product.id)}`} className="block">
        <div className="relative aspect-[4/3] bg-ak-canvas">
          {product.image ? (
            <Image src={product.image} alt={product.title} fill unoptimized sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ak-muted">الصورة غير متاحة</div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-ak-amber">{product.categoryName}</p>
          <h3 className="mt-2 line-clamp-2 min-h-12 font-bold">{product.title}</h3>
          <p className="mt-2 text-xs text-amber-300">{product.averageRating === null ? 'لا توجد تقييمات' : `★ ${product.averageRating.toFixed(1)} · ${product.reviewCount} تقييم`}</p>
          <p className="mt-3 text-lg font-black text-ak-honey">{product.priceLabel || 'السعر غير متاح حاليًا'}</p>
          <p className="mt-1 text-xs text-stone-500">{product.availableStock > 0 ? `المتوفر: ${product.availableStock}` : 'نفد المخزون'}</p>
        </div>
      </Link>
      <Link href={`/products/${encodeURIComponent(product.id)}`} className="m-4 mt-0 flex w-[calc(100%-2rem)] items-center justify-center rounded-xl bg-ak-amber px-4 py-3 text-sm font-bold text-ak-ink hover:bg-ak-honey">
        عرض المنتج
      </Link>
    </article>
  );
}
