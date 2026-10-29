'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorState({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main
      dir="rtl"
      className="flex min-h-[60vh] items-center justify-center px-4 py-16 text-center"
    >
      <div className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-ak-surface p-8 shadow-lg">
        <p className="text-sm font-bold text-primary-600">500</p>
        <h1 className="mt-2 text-3xl font-black text-neutral-900">
          حدث خطأ غير متوقع
        </h1>
        <p className="mt-4 leading-7 text-neutral-600">
          تعذر إكمال طلبك الآن. يمكنك المحاولة مجددًا أو العودة إلى الصفحة
          الرئيسية.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-primary-600 px-6 py-3 font-bold text-white hover:bg-primary-700"
          >
            المحاولة مرة أخرى
          </button>
          <Link
            href="/"
            className="rounded-lg border border-neutral-300 px-6 py-3 font-bold text-neutral-800 hover:bg-neutral-50"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
