'use client';

import { useEffect, useState } from 'react';

type Props = { slug: string; className?: string };

export default function ManagedSiteBanner({ slug, className = '' }: Props) {
  const [page, setPage] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/site-pages/${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 404) return null;
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.error || 'تعذر تحميل محتوى الموقع.');
        return payload.page as { title: string; content: string };
      })
      .then((result) => {
        if (active && result) setPage(result);
      })
      .catch((error: unknown) => {
        console.error('Unable to display managed site content:', error);
      });
    return () => { active = false; };
  }, [slug]);

  if (!page) return null;
  return (
    <aside className={`ak-page-shell pt-4 ${className}`} aria-label={page.title}>
      <div className="ak-panel border-ak-amber/25 p-4">
        <h2 className="font-bold text-ak-honey">{page.title}</h2>
        <p className="mt-1 whitespace-pre-line text-sm leading-7 text-ak-muted">{page.content}</p>
      </div>
    </aside>
  );
}
