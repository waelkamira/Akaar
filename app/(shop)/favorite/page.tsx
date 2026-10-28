import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import SmallCard from '@/components/ReusableComponents/SmallCard/SmallCard';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'المفضلة | Akaar',
  description: 'المنتجات التي حفظتها في قائمة المفضلة.',
};

export default async function FavoritesPage({ searchParams }: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Ffavorite');

  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 100_000) : 1;
  const limit = 24;
  const where = {
    userId: user.id,
    isDeleted: false,
    product: {
      isDeleted: false,
      isActive: true,
      approvalStatus: 'APPROVED' as const,
      category: { isActive: true },
    },
  };
  const [totalCount, favorites] = await Promise.all([
    prisma.favorite.count({ where }),
    prisma.favorite.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            images: true,
            basePrice: true,
            stockQuantity: true,
            city: true,
            town: true,
            createdAt: true,
            categoryId: true,
            categoryName: true,
          },
        },
      },
    }),
  ]);
  const products = favorites.map(({ product }) => product);
  const hasMore = page * limit < totalCount;

  return (
    <main dir="rtl" className="min-h-screen bg-ak-ink px-4 py-10 text-ak-cream sm:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold tracking-widest text-ak-amber">SAVED ITEMS</p><h1 className="mt-2 text-3xl font-black">قائمة المفضلة</h1><p className="mt-2 text-sm text-stone-400">{new Intl.NumberFormat('ar').format(totalCount)} منتج محفوظ من قاعدة البيانات.</p></div>
          <Link href="/search" className="rounded-xl border border-ak-line px-4 py-3 text-sm hover:border-ak-amber/40">تصفح المنتجات</Link>
        </header>

        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => <SmallCard key={product.id} item={product} category={{ id: product.categoryId, name: product.categoryName }} />)}
          </div>
        ) : (
          <section className="rounded-3xl border border-ak-line bg-ak-surface px-6 py-14 text-center">
            <h2 className="text-xl font-bold">قائمة المفضلة فارغة</h2><p className="mt-3 text-sm text-stone-400">احفظ المنتجات التي تود العودة إليها لاحقًا.</p>
            <Link href="/search" className="mt-6 inline-flex rounded-xl bg-ak-amber px-6 py-3 text-sm font-bold text-ak-canvas">استكشف المنتجات</Link>
          </section>
        )}

        {(page > 1 || hasMore) && <nav aria-label="صفحات المفضلة" className="mt-8 flex justify-center gap-3">
          {page > 1 && <Link href={`/favorite?page=${page - 1}`} className="rounded-xl border border-ak-line px-4 py-3 text-sm">السابقة</Link>}
          <span className="rounded-xl bg-ak-amber/10 px-4 py-3 text-sm text-ak-honey">صفحة {page}</span>
          {hasMore && <Link href={`/favorite?page=${page + 1}`} className="rounded-xl border border-ak-line px-4 py-3 text-sm">التالية</Link>}
        </nav>}
      </div>
    </main>
  );
}
