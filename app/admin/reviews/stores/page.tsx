import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { isStoreReviewTableAvailable, isVendorOrderTableAvailable } from '@/lib/admin/review-table-availability';
import AnalyticsPanel from '../../analytics-panel';

export const dynamic = 'force-dynamic';

export default async function StoreReviewsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/admin/dashboard');

  const [sellers, storeReviewsAvailable, vendorOrdersAvailable] = await Promise.all([
    prisma.seller.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: 100,
      select: {
        id: true,
        storeName: true,
        status: true,
        isVerified: true,
        _count: { select: { products: true } },
      },
    }),
    isStoreReviewTableAvailable(),
    isVendorOrderTableAvailable(),
  ]);

  const orderCounts = new Map<string, number>();
  if (vendorOrdersAvailable) {
    const sellerOrderCounts = await prisma.$queryRaw<Array<{ sellerId: string; count: bigint }>>`
      SELECT "sellerId", COUNT(*)::bigint AS "count"
      FROM public."VendorOrder"
      GROUP BY "sellerId"
    `;
    for (const orderCount of sellerOrderCounts) {
      orderCounts.set(orderCount.sellerId, Number(orderCount.count));
    }
  }

  const scores = new Map<string, { count: number; average: number }>();
  let latestReviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    storeName: string;
    userName: string | null;
    email: string;
  }> = [];
  const ratingDistribution = new Map<number, number>();
  let reviewCount = 0;
  let totalRating = 0;
  if (storeReviewsAvailable) {
    const [sellerScores, distribution, reviews] = await Promise.all([
      prisma.$queryRaw<Array<{ sellerId: string; count: number; average: number }>>`
        SELECT "sellerId", COUNT(*)::int AS count, AVG(rating)::float8 AS average
        FROM public.store_reviews
        GROUP BY "sellerId"
      `,
      prisma.$queryRaw<Array<{ rating: number; count: number }>>`
        SELECT rating, COUNT(*)::int AS count
        FROM public.store_reviews
        GROUP BY rating
      `,
      prisma.$queryRaw<typeof latestReviews>`
        SELECT r.id, r.rating, r.comment, r."createdAt", s."storeName", u."userName", u.email
        FROM public.store_reviews r
        JOIN public.sellers s ON s.id = r."sellerId"
        JOIN public.users u ON u.id = r."userId"
        ORDER BY r."createdAt" DESC
        LIMIT 30
      `,
    ]);
    latestReviews = reviews;
    for (const item of distribution) ratingDistribution.set(item.rating, item.count);
    for (const score of sellerScores) {
      scores.set(score.sellerId, { count: score.count, average: score.average });
      reviewCount += score.count;
      totalRating += score.average * score.count;
    }
  }
  const average = reviewCount ? totalRating / reviewCount : 0;
  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:py-12">
      <header><p className="ak-eyebrow">STORE PERFORMANCE</p><h1 className="mt-2 text-3xl font-black">تقييمات المتاجر</h1><p className="mt-2 text-sm text-stone-400">تحليلات مستقلة لتقييمات المتاجر التي أرسلها العملاء.</p></header>
      <AnalyticsPanel
        title="ملخص تقييمات المتاجر"
        description="يعرض متوسطات وتوزيع التقييمات المستقلة التي قدّمها العملاء للمتاجر، إلى جانب مؤشرات الاعتماد والكتالوج والطلبات."
        notice={[
          !storeReviewsAvailable ? 'تقييمات المتاجر غير متاحة حتى يتم تطبيق ترحيل قاعدة البيانات الذي ينشئ جدول store_reviews.' : null,
          !vendorOrdersAvailable ? 'بيانات الطلبات غير متاحة لأن جدول VendorOrder غير موجود في قاعدة البيانات الحالية.' : null,
        ].filter(Boolean).join(' ') || undefined}
        metrics={[
          { label: 'المتاجر المعتمدة', value: sellers.filter((seller) => seller.status === 'ACTIVE' && seller.isVerified).length, detail: 'حالة نشطة وموثقة', color: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' },
          { label: 'بانتظار المراجعة', value: sellers.filter((seller) => seller.status === 'PENDING').length, detail: 'طلبات بائعين', color: 'border-amber-400/25 bg-amber-400/10 text-amber-200' },
          { label: 'تقييمات المتاجر', value: reviewCount, detail: 'تقييم مستقل من العملاء', color: 'border-sky-400/25 bg-sky-400/10 text-sky-200' },
          { label: 'متوسط التقييم', value: average.toFixed(1), detail: 'من 5 نجوم', color: 'border-violet-400/25 bg-violet-400/10 text-violet-200' },
        ]}
        chartTitle="توزيع تقييمات المتاجر حسب النجوم"
        chart={Array.from({ length: 5 }, (_, index) => {
          const rating = index + 1;
          return { label: `${rating} نجوم`, value: ratingDistribution.get(rating) || 0 };
        })}
        chartColor="bg-amber-300"
      />
      <section className="ak-panel p-5">
        <h2 className="mb-4 text-lg font-bold">أداء المتاجر والتقييمات</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-right text-sm">
            <thead className="text-xs text-stone-500"><tr><th className="pb-3">المتجر</th><th className="pb-3">حالة الاعتماد</th><th className="pb-3">المنتجات</th><th className="pb-3">الطلبات</th><th className="pb-3">تقييم المتجر</th></tr></thead>
            <tbody>{sellers.map((seller) => {
              const score = scores.get(seller.id);
              const badge = seller.status === 'ACTIVE' ? 'bg-emerald-400/10 text-emerald-200' : seller.status === 'PENDING' ? 'bg-amber-400/10 text-amber-200' : 'bg-rose-400/10 text-rose-200';
              return <tr key={seller.id} className="border-t border-ak-line-strong/[.08]">
                <td className="py-3 font-semibold">{seller.storeName}</td>
                <td className="py-3"><span className={`rounded-full px-3 py-1 text-xs ${badge}`}>{seller.status === 'ACTIVE' && seller.isVerified ? 'معتمد' : seller.status === 'PENDING' ? 'قيد المراجعة' : seller.status}</span></td>
                <td className="py-3 text-sky-200">{seller._count.products}</td>
                <td className="py-3 text-violet-200">{vendorOrdersAvailable ? orderCounts.get(seller.id) || 0 : 'غير متاح'}</td>
                <td className="py-3 text-amber-200">{score ? `${score.average.toFixed(1)} / 5 · ${score.count}` : 'لا توجد مراجعات'}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </section>
      <section className="ak-panel space-y-3 p-5">
        <h2 className="text-lg font-bold">أحدث تقييمات المتاجر</h2>
        {latestReviews.map((review) => (
          <article key={review.id} className="rounded-xl border border-ak-line-strong/[.08] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="font-semibold">{review.storeName}</p><p className="mt-1 text-xs text-stone-500">{review.userName || review.email} · {new Date(review.createdAt).toLocaleDateString('ar')}</p></div>
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">{review.rating}/5 نجوم</span>
            </div>
            {review.comment && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-300">{review.comment}</p>}
          </article>
        ))}
        {!latestReviews.length && <p className="text-sm text-stone-500">لا توجد تقييمات متاجر حتى الآن.</p>}
      </section>
    </main>
  );
}
