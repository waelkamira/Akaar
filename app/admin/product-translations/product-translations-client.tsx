'use client';

import { useState, type FormEvent } from 'react';

type ProductOption = { id: string; title: string };
type Translation = { id: string; productId: string; language: string; title: string; description: string | null; product: { title: string } };

export default function ProductTranslationsClient({ initialTranslations, products }: { initialTranslations: Translation[]; products: ProductOption[] }) {
  const [items, setItems] = useState(initialTranslations);
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [language, setLanguage] = useState('en');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function reset() {
    setEditingId('');
    setProductId(products[0]?.id || '');
    setLanguage('en');
    setTitle('');
    setDescription('');
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingId ? `/api/admin/product-translations/${encodeURIComponent(editingId)}` : '/api/admin/product-translations', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, language: language.trim(), title, description }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر حفظ الترجمة.');
      const translation = payload.translation as Translation;
      setItems((current) => editingId
        ? current.map((item) => item.id === editingId ? translation : item).sort((a, b) => a.language.localeCompare(b.language))
        : [...current, translation].sort((a, b) => a.language.localeCompare(b.language)));
      reset();
      setNotice(editingId ? 'تم تحديث الترجمة.' : 'تمت إضافة الترجمة.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ الترجمة.');
    } finally {
      setPending(false);
    }
  }

  async function remove(item: Translation) {
    if (!window.confirm(`حذف ترجمة «${item.title}»؟`)) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/product-translations/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر حذف الترجمة.');
      setItems((current) => current.filter((translation) => translation.id !== item.id));
      if (editingId === item.id) reset();
      setNotice('تم حذف الترجمة.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الترجمة.');
    } finally {
      setPending(false);
    }
  }

  return <div className="space-y-6">
    <form onSubmit={save} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
      <h2 className="text-lg font-bold">{editingId ? 'تعديل ترجمة المنتج' : 'إضافة ترجمة منتج'}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-300 sm:col-span-2">المنتج<select required value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white"><option value="" disabled>اختر منتجًا</option>{products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}</select></label>
        <label className="text-sm text-slate-300">رمز اللغة (مثل en أو ar أو fr-FR)<input required maxLength={16} value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" placeholder="en" /></label>
        <label className="text-sm text-slate-300">اسم المنتج المترجم<input required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
        <label className="text-sm text-slate-300 sm:col-span-2">الوصف المترجم<textarea maxLength={10000} rows={5} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
      </div>
      <p className="mt-3 text-xs leading-6 text-amber-100/70">يُخزن المخطط ترجمة منفصلة لكل لغة ولكل منتج، ويمنع تكرار اللغة نفسها للمنتج نفسه.</p>
      {error ? <p role="alert" className="mt-4 text-sm text-red-200">{error}</p> : null}
      {notice ? <p role="status" className="mt-4 text-sm text-emerald-200">{notice}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2"><button type="submit" disabled={pending || !productId || !title.trim() || !language.trim()} className="rounded-xl bg-amber-200 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40">{pending ? 'جارٍ الحفظ…' : editingId ? 'حفظ التعديلات' : 'إضافة الترجمة'}</button>{editingId ? <button type="button" disabled={pending} onClick={reset} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm">إلغاء</button> : null}</div>
    </form>

    <section>
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">ترجمات المنتجات</h2><span className="text-xs text-slate-400">{items.length} ترجمة</span></div>
      {items.length ? <div className="space-y-3">{items.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-amber-200">{item.language}</p><h3 className="mt-1 font-semibold text-white">{item.title}</h3><p className="mt-1 text-sm text-slate-400">المنتج الأصلي: {item.product.title}</p>{item.description ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.description}</p> : null}</div><div className="flex gap-2"><button type="button" disabled={pending} onClick={() => { setEditingId(item.id); setProductId(item.productId); setLanguage(item.language); setTitle(item.title); setDescription(item.description || ''); setError(''); setNotice(''); }} className="rounded-lg border border-white/15 px-3 py-2 text-xs disabled:opacity-40">تعديل</button><button type="button" disabled={pending} onClick={() => void remove(item)} className="rounded-lg border border-red-300/20 px-3 py-2 text-xs text-red-200 disabled:opacity-40">حذف</button></div></div>
      </article>)}</div> : <p className="rounded-2xl border border-white/10 bg-[#11182a] p-6 text-sm text-slate-400">لا توجد ترجمات بعد.</p>}
    </section>
  </div>;
}
