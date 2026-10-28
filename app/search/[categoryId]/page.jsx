'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function SearchCategoryRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const rawCategoryId = Array.isArray(params?.categoryId)
      ? params.categoryId[0]
      : params?.categoryId;
    const match = String(rawCategoryId || '').match(/(?:categoryId=)?(\d+)/);

    if (match) {
      router.replace(`/search?categoryId=${encodeURIComponent(match[1])}`);
    } else {
      router.replace('/search');
    }
  }, [params, router]);

  return (
    <main dir="rtl" className="flex min-h-[50vh] items-center justify-center bg-ak-ink px-4 text-ak-cream" aria-live="polite">
      <p className="text-sm text-stone-400">جارٍ فتح نتائج الفئة...</p>
    </main>
  );
}
