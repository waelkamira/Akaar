'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SmallCard from '@/components/ReusableComponents/SmallCard/SmallCard';

export default function FavoriteProducts({ products, page }) {
  const [favoriteProducts, setFavoriteProducts] = useState(products);
  const router = useRouter();

  const removeFavorite = (productId) => {
    if (favoriteProducts.length === 1 && page > 1) {
      router.replace(`/favorite?page=${page - 1}`);
    }
    setFavoriteProducts((current) =>
      current.filter((product) => product.id !== productId),
    );
  };

  if (favoriteProducts.length === 0) {
    return (
      <section className="ak-panel-raised px-5 py-10 text-center sm:px-8 sm:py-14">
        <h2 className="text-xl font-bold sm:text-2xl">قائمة المفضلة فارغة</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ak-muted">
          احفظ المنتجات التي تود العودة إليها لاحقًا، وستجدها هنا.
        </p>
        <Link href="/search" className="ak-button-primary mt-6">
          استكشف المنتجات
        </Link>
      </section>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {favoriteProducts.map((product) => {
        const item = {
          ...product,
          image1: product.images?.[0] || null,
          location: product.city,
          subLocation: product.town,
        };

        return (
          <SmallCard
            key={product.id}
            item={item}
            category={{ id: product.categoryId, name: product.categoryName }}
            onFavoriteChange={(favorited) => {
              if (!favorited) removeFavorite(product.id);
            }}
          />
        );
      })}
    </div>
  );
}
