import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import FavoriteProducts from './FavoriteProducts';

type FavoriteProduct = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  basePrice: number | null;
  stockQuantity: number | null;
  city: string | null;
  town: string | null;
  createdAt: Date;
  categoryId: number;
  categoryName: string;
};

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
  const [countRows, products] = await Promise.all([
    prisma.$queryRaw<Array<{ totalCount: number }>>`
      SELECT COUNT(*)::int AS "totalCount"
      FROM public.favorites AS favorite
      INNER JOIN public.products AS product
        ON product.id = favorite."productId"
      INNER JOIN public."Category" AS category
        ON category.id = product."categoryId"
      WHERE favorite."userId" = ${user.id}
        AND favorite."isDeleted" = false
        AND product."isDeleted" = false
        AND product."isActive" = true
        AND product."approvalStatus" = 'APPROVED'
        AND category."isActive" = true
    `,
    prisma.$queryRaw<FavoriteProduct[]>`
      SELECT
        product.id,
        product.title,
        product.description,
        product.images,
        product."basePrice",
        product."stockQuantity",
        product.city,
        product.town,
        product."createdAt",
        product."categoryId",
        product."categoryName"
      FROM public.favorites AS favorite
      INNER JOIN public.products AS product
        ON product.id = favorite."productId"
      INNER JOIN public."Category" AS category
        ON category.id = product."categoryId"
      WHERE favorite."userId" = ${user.id}
        AND favorite."isDeleted" = false
        AND product."isDeleted" = false
        AND product."isActive" = true
        AND product."approvalStatus" = 'APPROVED'
        AND category."isActive" = true
      ORDER BY favorite."createdAt" DESC, favorite.id DESC
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `,
  ]);
  const totalCount = countRows[0]?.totalCount ?? 0;
  const hasMore = page * limit < totalCount;

  return (
    <main dir="rtl" className="min-h-screen w-full min-w-0 overflow-x-clip bg-transparent py-6 text-white sm:py-10">
      <div className="ak-page-shell min-w-0">
        <header className="ak-page-heading mb-7">
          <div className="min-w-0">
            <p className="ak-eyebrow mb-2">عناصر محفوظة</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">قائمة المفضلة</h1>
            <p className="mt-3 text-sm leading-6 text-ak-muted">
              المنتجات التي حفظتها لتعود إليها بسهولة.
            </p>
          </div>
          <Link href="/search" className="ak-button-secondary shrink-0">
            تصفح المنتجات
          </Link>
        </header>

        {products.length ? (
          <FavoriteProducts products={products} page={page} />
        ) : (
          <section className="ak-panel-raised px-5 py-10 text-center sm:px-8 sm:py-14">
            <h2 className="text-xl font-bold sm:text-2xl">قائمة المفضلة فارغة</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ak-muted">
              احفظ المنتجات التي تود العودة إليها لاحقًا، وستجدها هنا.
            </p>
            <Link href="/search" className="ak-button-primary mt-6">
              استكشف المنتجات
            </Link>
          </section>
        )}

        {(page > 1 || hasMore) && <nav aria-label="صفحات المفضلة" className="mt-8 flex justify-center gap-3">
          {page > 1 && <Link href={`/favorite?page=${page - 1}`} className="ak-button-secondary">السابقة</Link>}
          <span className="inline-flex items-center rounded-xl border border-ak-amber/20 bg-ak-amber/10 px-4 py-3 text-sm text-ak-honey">صفحة {page}</span>
          {hasMore && <Link href={`/favorite?page=${page + 1}`} className="ak-button-secondary">التالية</Link>}
        </nav>}
      </div>
    </main>
  );
}
