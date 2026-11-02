'use client';

import { useState, type FormEvent } from 'react';

type ProductOption = { id: string; title: string };
type Discount = { id: string; productId: string; code: string; percentage: number; validFrom: string; validTo: string; product: { title: string }; _count: { orders: number } };

function toLocalInput(value: string) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
function initialDate(offsetDays: number) {
  const date = new Date(Date.now() + offsetDays * 86_400_000);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export default function DiscountsClient({ initialDiscounts, products }: { initialDiscounts: Discount[]; products: ProductOption[] }) {
  const [items, setItems] = useState(initialDiscounts);
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [code, setCode] = useState('');
  const [percentage, setPercentage] = useState('10');
  const [validFrom, setValidFrom] = useState(initialDate(0));
  const [validTo, setValidTo] = useState(initialDate(30));
  const [editingId, setEditingId] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function reset() {
    setEditingId('');
    setProductId(products[0]?.id || '');
    setCode('');
    setPercentage('10');
    setValidFrom(initialDate(0));
    setValidTo(initialDate(30));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingId ? `/api/admin/discounts/${encodeURIComponent(editingId)}` : '/api/admin/discounts', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, code, percentage: Number(percentage), validFrom: new Date(validFrom).toISOString(), validTo: new Date(validTo).toISOString() }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر حفظ الخصم.');
      const discount = payload.discount as Discount;
      setItems((current) => editingId
        ? current.map((item) => item.id === editingId ? discount : item).sort((a, b) => b.validFrom.localeCompare(a.validFrom))
        : [discount, ...current]);
      reset();
      setNotice(editingId ? 'تم تحديث الخصم.' : 'تم إنشاء الخصم.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ الخصم.');
    } finally {
      setPending(false);
    }
  }

  async function remove(item: Discount) {
    if (!window.confirm(`حذف رمز الخصم ${item.code}؟`)) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/discounts/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر حذف الخصم.');
      setItems((current) => current.filter((discount) => discount.id !== item.id));
      if (editingId === item.id) reset();
      setNotice('تم حذف الخصم.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الخصم.');
    } finally {
      setPending(false);
    }
  }

  return <div className="space-y-6">
    <form onSubmit={save} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
      <h2 className="text-lg font-bold">{editingId ? 'تعديل الخصم' : 'إنشاء خصم لمنتج'}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-300 sm:col-span-2">المنتج<select required value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white"><option value="" disabled>اختر منتجًا</option>{products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}</select></label>
        <label className="text-sm text-slate-300">رمز الخصم<input required minLength={3} maxLength={40} pattern="[A-Za-z0-9_-]+" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 uppercase text-white" placeholder="WELCOME10" /></label>
        <label className="text-sm text-slate-300">نسبة الخصم (%)<input required type="number" min="1" max="100" step="1" value={percentage} onChange={(event) => setPercentage(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
        <label className="text-sm text-slate-300">يبدأ في<input required type="datetime-local" value={validFrom} onChange={(event) => setValidFrom(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
        <label className="text-sm text-slate-300">ينتهي في<input required type="datetime-local" value={validTo} onChange={(event) => setValidTo(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
      </div>
      <p className="mt-3 text-xs leading-6 text-amber-100/70">وفق مخطط Prisma الحالي، كل رمز خصم مرتبط بمنتج واحد، ولا يحتوي النموذج على حد استخدام أو نطاق عملة أو فئة عملاء.</p>
      {error ? <p role="alert" className="mt-4 text-sm text-red-200">{error}</p> : null}
      {notice ? <p role="status" className="mt-4 text-sm text-emerald-200">{notice}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2"><button type="submit" disabled={pending || !productId || !code.trim() || !validFrom || !validTo} className="rounded-xl bg-amber-200 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40">{pending ? 'جارٍ الحفظ…' : editingId ? 'حفظ التعديلات' : 'إنشاء الخصم'}</button>{editingId ? <button type="button" disabled={pending} onClick={reset} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm">إلغاء</button> : null}</div>
    </form>

    <section>
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">الخصومات المسجلة</h2><span className="text-xs text-slate-400">{items.length} خصم</span></div>
      {items.length ? <div className="space-y-3">{items.map((item) => {
        const now = Date.now();
        const from = new Date(item.validFrom).getTime();
        const to = new Date(item.validTo).getTime();
        const state = now < from ? 'لم يبدأ' : now > to ? 'منتهي' : 'ساري زمنيًا';
        return <article key={item.id} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-white">{item.code} <span className="text-amber-200">-{item.percentage}%</span></h3><p className="mt-1 text-sm text-slate-300">{item.product.title}</p><p className="mt-2 text-xs text-slate-500">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.validFrom))} — {new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.validTo))}</p><p className="mt-1 text-xs text-slate-500">مرتبط بـ {item._count.orders} طلب · {state}</p></div><div className="flex gap-2"><button type="button" disabled={pending} onClick={() => { setEditingId(item.id); setProductId(item.productId); setCode(item.code); setPercentage(String(item.percentage)); setValidFrom(toLocalInput(item.validFrom)); setValidTo(toLocalInput(item.validTo)); setError(''); setNotice(''); }} className="rounded-lg border border-white/15 px-3 py-2 text-xs disabled:opacity-40">تعديل</button><button type="button" disabled={pending} onClick={() => void remove(item)} className="rounded-lg border border-red-300/20 px-3 py-2 text-xs text-red-200 disabled:opacity-40">حذف</button></div></div>
        </article>;
      })}</div> : <p className="rounded-2xl border border-white/10 bg-[#11182a] p-6 text-sm text-slate-400">لا توجد خصومات مسجلة.</p>}
    </section>
  </div>;
}
