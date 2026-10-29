'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';
import { useCommerce } from '@/features/cart/commerce-context';

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

export default function StorefrontProductCard({ product }: { product: Product }) {
  const { addToCart } = useCommerce();
  const image = product.images[0] || '/placeholder.jpg';
  const available = (product.stockQuantity ?? 0) > 0;

  function addProduct() {
    try {
      if (product.basePrice === null) throw new Error('السعر غير متاح حاليًا.');
      addToCart({ ...product, basePrice: product.basePrice, image1: image });
      toast.success('أضيف المنتج إلى السلة.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذر إضافة المنتج للسلة.');
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-ak-line bg-ak-surface">
      <Link href={`/post/${encodeURIComponent(product.id)}`} className="block">
        <div className="relative aspect-[4/3] bg-ak-canvas">
          <Image src={image} alt={product.title} fill unoptimized sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
        </div>
        <div className="p-4">
          <p className="text-xs text-ak-amber">{product.categoryName}{product.city ? ` · ${product.city}` : ''}</p>
          <h3 className="mt-2 line-clamp-2 min-h-12 font-bold">{product.title}</h3>
          <p className="mt-3 text-lg font-black text-ak-honey">{product.basePrice === null ? 'السعر عند الطلب' : `${new Intl.NumberFormat('ar-SY').format(product.basePrice)} ل.س`}</p>
          <p className="mt-1 text-xs text-stone-500">{available ? `المتوفر: ${product.stockQuantity}` : 'نفد المخزون'}</p>
        </div>
      </Link>
      <button type="button" disabled={!available || product.basePrice === null} onClick={addProduct} className="m-4 mt-0 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-xl bg-ak-amber px-4 py-3 text-sm font-bold text-ak-ink disabled:cursor-not-allowed disabled:opacity-40">
        <FaShoppingCart aria-hidden="true" /> أضف للسلة
      </button>
    </article>
  );
}
