'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DemoProductCard from '../../../components/Store/DemoProductCard';
import SmallCard from '../../../components/ReusableComponents/SmallCard/SmallCard';
import { useCommerce } from '@/features/cart/commerce-context';

export default function FavoritesPage() {
  const { favoriteItems } = useCommerce();
  const [userId, setUserId] = useState(null);
  const [serverFavorites, setServerFavorites] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem('CurrentUser') || 'null',
      );
      setUserId(currentUser?.id || null);
    } catch (error) {
      console.error('Unable to read the current user:', error);
      toast.error('تعذر تحميل بيانات الحساب');
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/favorite?userId=${encodeURIComponent(userId)}&page=${page}&limit=8`,
      );
      if (!response.ok) {
        throw new Error(`Unable to load favorites (${response.status}).`);
      }

      const result = await response.json();
      const products = Array.isArray(result.favorites)
        ? result.favorites.map((favorite) => favorite.product || favorite)
        : [];

      setServerFavorites((current) =>
        page === 0 ? products : [...current, ...products],
      );
      setTotalCount(Number(result.totalCount) || 0);
      setHasMore(Boolean(result.hasMore));
    } catch (error) {
      console.error('Failed to load favorites:', error);
      toast.error('حدث خطأ أثناء جلب المفضلة');
    } finally {
      setLoading(false);
    }
  }, [userId, page]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const hasFavorites = favoriteItems.length > 0 || serverFavorites.length > 0;

  return (
    <main
      dir="rtl"
      className="mx-auto mt-40 min-h-[60vh] w-full max-w-7xl px-4 py-10 text-white"
    >
      <header className="mb-8">
        <p className="mb-2 text-sm font-bold text-orange-400">قائمتك الخاصة</p>
        <h1 className="text-3xl font-black">المفضلة</h1>
        <p className="mt-2 text-sm text-neutral-400">
          {favoriteItems.length + totalCount} منتج وإعلان محفوظ
        </p>
      </header>

      {!hasFavorites && !loading && (
        <div className="border border-neutral-800 bg-neutral-900 p-8 text-center text-neutral-300">
          لم تضف أي منتج إلى المفضلة بعد. استخدم رمز القلب لحفظ ما يعجبك.
        </div>
      )}

      {favoriteItems.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">المنتجات التجريبية المحفوظة</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteItems.map((product) => (
              <DemoProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {serverFavorites.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">إعلاناتك المحفوظة</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {serverFavorites.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="overflow-hidden border border-neutral-800 bg-white"
              >
                <SmallCard
                  item={product}
                  category={{
                    id: product.categoryId,
                    name: product.categoryName,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={loading}
            className="border border-orange-500 px-6 py-3 font-bold text-orange-400 hover:bg-orange-500 hover:text-black disabled:opacity-50"
          >
            {loading ? 'جارٍ التحميل...' : 'عرض المزيد'}
          </button>
        </div>
      )}
    </main>
  );
}
