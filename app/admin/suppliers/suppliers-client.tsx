'use client';

import { useMemo, useState, type FormEvent } from 'react';

type CountryOption = { id: string; name: string; code: string };
type CityOption = { id: string; name: string; countryId: string };
type Supplier = { id: string; name: string; email: string; phone: string | null; address: string | null; countryId: string; cityId: string | null; country: { name: string; code: string }; city: { name: string } | null };

export default function SuppliersClient({ initialSuppliers, countries, cities }: { initialSuppliers: Supplier[]; countries: CountryOption[]; cities: CityOption[] }) {
  const [items, setItems] = useState(initialSuppliers);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [countryId, setCountryId] = useState(countries[0]?.id || '');
  const [cityId, setCityId] = useState('');
  const [editingId, setEditingId] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const availableCities = useMemo(() => cities.filter((city) => city.countryId === countryId), [cities, countryId]);

  function reset() {
    setEditingId(''); setName(''); setEmail(''); setPhone(''); setAddress('');
    setCountryId(countries[0]?.id || ''); setCityId('');
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(''); setNotice('');
    try {
      const response = await fetch(editingId ? `/api/admin/suppliers/${encodeURIComponent(editingId)}` : '/api/admin/suppliers', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || null, address: address || null, countryId, cityId: cityId || null }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر حفظ المورد.');
      const supplier = payload.supplier as Supplier;
      setItems((current) => editingId
        ? current.map((item) => item.id === editingId ? supplier : item).sort((a, b) => a.name.localeCompare(b.name))
        : [...current, supplier].sort((a, b) => a.name.localeCompare(b.name)));
      reset(); setNotice(editingId ? 'تم تحديث المورد.' : 'تمت إضافة المورد.');
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر حفظ المورد.'); }
    finally { setPending(false); }
  }

  async function remove(item: Supplier) {
    if (!window.confirm(`حذف المورد «${item.name}»؟`)) return;
    setPending(true); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/admin/suppliers/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر حذف المورد.');
      setItems((current) => current.filter((supplier) => supplier.id !== item.id));
      if (editingId === item.id) reset();
      setNotice('تم حذف المورد.');
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر حذف المورد.'); }
    finally { setPending(false); }
  }

  return <div className="space-y-6">
    <form onSubmit={save} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
      <h2 className="text-lg font-bold">{editingId ? 'تعديل المورد' : 'إضافة مورد'}</h2>
      {!countries.length ? <p className="mt-3 text-sm text-amber-200">أضف بلدًا واحدًا على الأقل من صفحة البلدان والمدن قبل تسجيل الموردين.</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-300">اسم المورد<input required maxLength={150} value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
        <label className="text-sm text-slate-300">البريد الإلكتروني<input required type="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
        <label className="text-sm text-slate-300">الهاتف (اختياري)<input maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
        <label className="text-sm text-slate-300">البلد<select required value={countryId} onChange={(e) => { setCountryId(e.target.value); setCityId(''); }} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white"><option value="">اختر بلدًا</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name} ({country.code})</option>)}</select></label>
        <label className="text-sm text-slate-300">المدينة (اختياري)<select value={cityId} onChange={(e) => setCityId(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white"><option value="">دون تحديد مدينة</option>{availableCities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></label>
        <label className="text-sm text-slate-300 sm:col-span-2">العنوان<input maxLength={500} value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
      </div>
      {error ? <p role="alert" className="mt-4 text-sm text-red-200">{error}</p> : null}
      {notice ? <p role="status" className="mt-4 text-sm text-emerald-200">{notice}</p> : null}
      <div className="mt-4 flex gap-2"><button type="submit" disabled={pending || !countries.length || !name.trim() || !email.trim() || !countryId} className="rounded-xl bg-amber-200 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40">{pending ? 'جارٍ الحفظ…' : editingId ? 'حفظ التعديلات' : 'إضافة المورد'}</button>{editingId ? <button type="button" disabled={pending} onClick={reset} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm">إلغاء</button> : null}</div>
    </form>

    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">الموردون المسجلون</h2><span className="text-xs text-slate-400">{items.length} مورد</span></div>
      {items.length ? <div className="space-y-3">{items.map((item) => <article key={item.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#11182a] p-5"><div><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-sm text-slate-300">{item.email}</p><p className="mt-1 text-xs text-slate-500">{item.phone || 'دون هاتف'} · {item.city?.name ? `${item.city.name}، ` : ''}{item.country.name} ({item.country.code})</p>{item.address ? <p className="mt-2 text-xs text-slate-400">{item.address}</p> : null}</div><div className="flex gap-2"><button type="button" disabled={pending} onClick={() => { setEditingId(item.id); setName(item.name); setEmail(item.email); setPhone(item.phone || ''); setAddress(item.address || ''); setCountryId(item.countryId); setCityId(item.cityId || ''); setError(''); setNotice(''); }} className="rounded-lg border border-white/15 px-3 py-2 text-xs">تعديل</button><button type="button" disabled={pending} onClick={() => void remove(item)} className="rounded-lg border border-red-300/20 px-3 py-2 text-xs text-red-200">حذف</button></div></article>)}</div> : <p className="rounded-xl border border-white/10 p-6 text-sm text-slate-500">لا يوجد موردون مسجلون.</p>}
    </section>
  </div>;
}
