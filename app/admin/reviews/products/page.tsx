import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { isReviewTableAvailable } from '@/lib/admin/review-table-availability';
import AnalyticsPanel from '../../analytics-panel';

export const dynamic = 'force-dynamic';

export default async function ProductReviewsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/admin/dashboard');

  const [reviewsAvailable, products] = await Promise.all([
    isReviewTableAvailable(),
    prisma.product.count({ where: { isDeleted: false } }),
  ]);
  const [ratings, reviews] = reviewsAvailable ? await Promise.all([
    prisma.$queryRaw<Array<{ rating: number; count: number }>>`
      SELECT rating, COUNT(*)::int AS count
      FROM public.reviews
      GROUP BY rating
      ORDER BY rating ASC
    `,
    prisma.$queryRaw<Array<{
      id: string;
      rating: number;
      comment: string | null;
      createdAt: Date;
      userName: string | null;
      email: string;
      productId: string;
      productTitle: string;
    }>>`
      SELECT r.id, r.rating, r.comment, r."createdAt",
        u."userName", u.email, p.id AS "productId", p.title AS "productTitle"
      FROM public.reviews r
      JOIN public.users u ON u.id = r."userId"
      JOIN public.products p ON p.id = r."productId"
      ORDER BY r."createdAt" DESC
      LIMIT 30
    `,
  ]) : [[], []];
  const reviewCount = ratings.reduce((sum, item) => sum + item.count, 0);
  const average = reviewCount ? ratings.reduce((sum, item) => sum + item.rating * item.count, 0) / reviewCount : 0;

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:py-12">
      <header><p className="ak-eyebrow">CUSTOMER FEEDBACK</p><h1 className="mt-2 text-3xl font-black">تقييمات المنتجات</h1><p className="mt-2 text-sm text-stone-400">تحليلات مستقلة لتقييمات المنتجات مع أحدث ملاحظات العملاء.</p></header>
      <AnalyticsPanel
        title="تحليل تقييمات المنتجات"
        description="يعرض توزيع التقييمات الفعلية لجميع المنتجات، ومتوسط التقييم ومعدل وجود مراجعات مقارنة بعدد المنتجات."
        notice={!reviewsAvailable ? 'تقييمات المنتجات غير متاحة لأن جدول Review غير موجود في قاعدة البيانات الحالية. طبّق ترحيلات Prisma على قاعدة بيانات مجهّزة قبل استخدام هذه البيانات؛ لم تُجر أي تغييرات تلقائية على قاعدة البيانات.' : undefined}
        metrics={[
          { label: 'إجمالي التقييمات', value: reviewCount, detail: 'تقييم مسجل', color: 'border-sky-400/25 bg-sky-400/10 text-sky-200' },
          { label: 'متوسط التقييم', value: average.toFixed(1), detail: 'من 5 نجوم', color: 'border-amber-400/25 bg-amber-400/10 text-amber-200' },
          { label: 'منتجات بمراجعات', value: new Set(reviews.map((review) => review.productId)).size, detail: 'ضمن أحدث 30 مراجعة', color: 'border-violet-400/25 bg-violet-400/10 text-violet-200' },
          { label: 'المنتجات النشطة', value: products, detail: 'غير محذوفة', color: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' },
        ]}
        chartTitle="توزيع التقييمات حسب عدد النجوم"
        chart={Array.from({ length: 5 }, (_, index) => {
          const rating = index + 1;
          return { label: `${rating} نجوم`, value: ratings.find((item) => item.rating === rating)?.count || 0 };
        })}
        chartColor="bg-amber-300"
      />
      <section className="ak-panel p-5">
        <h2 className="mb-4 text-lg font-bold">أحدث تقييمات المنتجات</h2>
        <div className="space-y-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-ak-line-strong/[.08] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="font-semibold">{review.productTitle}</p><p className="mt-1 text-xs text-stone-500">{review.userName || review.email} · {new Date(review.createdAt).toLocaleDateString('ar')}</p></div>
                <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">{review.rating}/5 نجوم</span>
              </div>
              {review.comment && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-300">{review.comment}</p>}
            </article>
          ))}
          {!reviews.length && <p className="py-5 text-sm text-stone-500">لا توجد تقييمات منتجات حتى الآن.</p>}
        </div>
      </section>
    </main>
  );
}
