import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSellerAccount } from '@/lib/auth/require-seller';
import ProductCreateForm from './product-create-form';

export default async function NewPostPage() {
  const { user, seller } = await getSellerAccount();
  if (!user) redirect('/login?callbackUrl=%2FnewPost');

  if (user.role === 'SELLER' && seller?.status === 'ACTIVE' && seller.isVerified) {
    return <ProductCreateForm />;
  }

  const statusMessage = !seller
    ? 'قدّم طلب فتح متجر من لوحة البائع. ستتمكن من نشر الإعلانات بعد موافقة الإدارة.'
    : seller.status === 'PENDING'
      ? 'طلب فتح متجرك قيد المراجعة. ستتمكن من نشر الإعلانات بعد موافقة الإدارة.'
      : seller.status === 'REJECTED'
        ? 'لم تتم الموافقة على طلب فتح المتجر. راجع لوحة البائع لمعرفة الخطوات التالية.'
        : seller.status === 'SUSPENDED'
          ? 'تم تعليق صلاحية متجرك مؤقتًا. تواصل مع الإدارة لمعرفة المزيد.'
          : 'متجرك غير معتمد بعد. لا يمكنك نشر الإعلانات حتى يكتمل اعتماده.';

  return (
    <main dir="rtl" className="flex min-h-[60vh] items-center justify-center bg-neutral-950 px-4 py-12 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[.04] p-8 text-center shadow-2xl">
        <h1 className="text-2xl font-bold">النشر متاح لأصحاب المتاجر المعتمدة</h1>
        <p className="mt-4 leading-7 text-neutral-300">{statusMessage}</p>
        <Link
          href="/seller/dashboard"
          className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-bold text-neutral-950 transition hover:bg-orange-400"
        >
          لوحة البائع وطلب فتح متجر
        </Link>
      </section>
    </main>
  );
}
