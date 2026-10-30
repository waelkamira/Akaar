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
      <div className="ak-panel-raised w-full max-w-xl p-8">
        <p className="text-sm font-bold text-ak-honey">500</p>
        <h1 className="mt-2 text-3xl font-black text-white">
          حدث خطأ غير متوقع
        </h1>
        <p className="mt-4 leading-7 text-ak-muted">
          تعذر إكمال طلبك الآن. يمكنك المحاولة مجددًا أو العودة إلى الصفحة
          الرئيسية.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="ak-button-primary"
          >
            المحاولة مرة أخرى
          </button>
          <Link
            href="/"
            className="ak-button-secondary"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
