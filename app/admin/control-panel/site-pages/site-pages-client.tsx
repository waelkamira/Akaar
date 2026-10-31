'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';

type SitePage = { slug: string; title: string; content: string; updatedAt: string };

async function readJson<T>(response: Response): Promise<T & { error?: string }> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
  return payload;
}

export default function SitePagesClient() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadPages = useCallback(async () => {
    const result = await readJson<{ pages: SitePage[] }>(await fetch('/api/admin/control-panel/site-pages', { cache: 'no-store' }));
    setPages(result.pages);
    setSelectedSlug((current) => current && result.pages.some((page) => page.slug === current) ? current : result.pages[0]?.slug || '');
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/control-panel/site-pages', { cache: 'no-store' })
      .then(readJson<{ pages: SitePage[] }>)
      .then((result) => {
        if (!active) return;
        setPages(result.pages);
        setSelectedSlug(result.pages[0]?.slug || '');
        setTitle(result.pages[0]?.title || '');
        setContent(result.pages[0]?.content || '');
        setError('');
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل صفحات الموقع.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const selected = pages.find((page) => page.slug === selectedSlug);

  async function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      if (creating) {
        const result = await readJson<{ page: SitePage }>(await fetch('/api/admin/control-panel/site-pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, title, content }),
        }));
        await loadPages();
        setSelectedSlug(result.page.slug);
        setCreating(false);
      } else {
        const result = await readJson<{ page: SitePage }>(await fetch(`/api/admin/control-panel/site-pages/${encodeURIComponent(selectedSlug)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        }));
        setPages((current) => current.map((page) => page.slug === result.page.slug ? result.page : page));
      }
      setNotice('تم حفظ الصفحة. رابطها العام /pages/' + (creating ? slug : selectedSlug));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ الصفحة.');
    } finally {
      setPending(false);
    }
  }

  async function deletePage() {
    if (!selected || !window.confirm(`حذف صفحة «${selected.title}»؟`)) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      await readJson(await fetch(`/api/admin/control-panel/site-pages/${encodeURIComponent(selected.slug)}`, { method: 'DELETE' }));
      const remainingPages = pages.filter((page) => page.slug !== selected.slug);
      setPages(remainingPages);
      setSelectedSlug(remainingPages[0]?.slug || '');
      setNotice('تم حذف الصفحة.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الصفحة.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:py-12">
      <header>
        <p className="ak-eyebrow">SITE CONTENT</p>
        <h1 className="mt-2 text-3xl font-black">إدارة صفحات الموقع</h1>
        <p className="mt-2 text-sm text-stone-400">أنشئ صفحات مساعدة أو معلومات، وعدّلها أو احذفها. يعرض المحتوى كنص آمن دون تشغيل HTML.</p>
      </header>

      <nav aria-label="أقسام الإدارة" className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setCreating(true); setSlug(''); setTitle(''); setContent(''); }} className="rounded-lg border border-ak-amber/30 px-4 py-2 text-sm text-ak-honey">صفحة جديدة</button>
        {pages.map((page) => (
          <button key={page.slug} type="button" onClick={() => { setCreating(false); setSelectedSlug(page.slug); setTitle(page.title); setContent(page.content); }} className={`rounded-lg border px-4 py-2 text-sm ${selectedSlug === page.slug && !creating ? 'border-ak-amber/40 bg-ak-brand-soft text-ak-honey' : 'border-ak-line text-stone-300'}`}>
            {page.title}
          </button>
        ))}
      </nav>

      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}
      {loading ? <p aria-busy="true">جارٍ تحميل الصفحات...</p> : (creating || selected) ? (
        <form onSubmit={(event) => void savePage(event)} className="ak-panel space-y-4 p-5">
          {creating && (
            <label className="block text-sm font-semibold">رابط الصفحة (إنجليزي)
              <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={64} value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="help-center" className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
            </label>
          )}
          <label className="block text-sm font-semibold">عنوان الصفحة
            <input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
          </label>
          <label className="block text-sm font-semibold">المحتوى
            <textarea required maxLength={20000} rows={12} value={content} onChange={(event) => setContent(event.target.value)} className="mt-2 w-full rounded-lg border border-ak-line bg-ak-ink px-3 py-2 text-white" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={pending} className="rounded-lg bg-ak-brand px-5 py-2 font-bold text-white disabled:opacity-50">{pending ? 'جارٍ الحفظ...' : creating ? 'إنشاء الصفحة' : 'حفظ التعديلات'}</button>
            {!creating && selected && <a href={`/pages/${encodeURIComponent(selected.slug)}`} target="_blank" rel="noreferrer" className="rounded-lg border border-ak-line px-4 py-2 text-sm">فتح الصفحة العامة</a>}
            {!creating && selected && <button type="button" disabled={pending} onClick={() => void deletePage()} className="rounded-lg border border-rose-400/30 px-4 py-2 text-sm text-rose-200 disabled:opacity-50">حذف</button>}
          </div>
        </form>
      ) : <p className="ak-panel p-5 text-sm text-stone-400">لا توجد صفحات بعد. أنشئ صفحة جديدة للبدء.</p>}
    </main>
  );
}
