'use client';

import { useState, type FormEvent } from 'react';

type Country = { id: string; name: string; code: string; _count: { cities: number; suppliers: number } };
type City = { id: string; name: string; countryId: string; country: { name: string; code: string }; _count: { suppliers: number } };

export default function LocationsClient({ initialCountries, initialCities }: { initialCountries: Country[]; initialCities: City[] }) {
  const [countries, setCountries] = useState(initialCountries);
  const [cities, setCities] = useState(initialCities);
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryEditId, setCountryEditId] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityCountryId, setCityCountryId] = useState(initialCountries[0]?.id || '');
  const [cityEditId, setCityEditId] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function request(path: string, method: string, body?: Record<string, unknown>) {
    const response = await fetch(path, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'تعذر تنفيذ العملية.');
    return payload;
  }

  async function saveCountry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError(''); setNotice('');
    try {
      const payload = await request(countryEditId ? `/api/admin/countries/${encodeURIComponent(countryEditId)}` : '/api/admin/countries', countryEditId ? 'PATCH' : 'POST', { name: countryName, code: countryCode.toUpperCase() });
      const country = payload.country as Country;
      setCountries((current) => (countryEditId ? current.map((item) => item.id === countryEditId ? country : item) : [...current, country]).sort((a, b) => a.name.localeCompare(b.name)));
      setCountryName(''); setCountryCode(''); setCountryEditId('');
      if (!cityCountryId) setCityCountryId(country.id);
      setNotice('تم حفظ البلد.');
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر حفظ البلد.'); }
    finally { setPending(false); }
  }

  async function deleteCountry(country: Country) {
    if (!window.confirm(`حذف البلد «${country.name}»؟`)) return;
    setPending(true); setError(''); setNotice('');
    try {
      await request(`/api/admin/countries/${encodeURIComponent(country.id)}`, 'DELETE');
      setCountries((current) => current.filter((item) => item.id !== country.id));
      setCities((current) => current.filter((item) => item.countryId !== country.id));
      if (cityCountryId === country.id) setCityCountryId('');
      if (countryEditId === country.id) { setCountryEditId(''); setCountryName(''); setCountryCode(''); }
      setNotice('تم حذف البلد.');
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر حذف البلد.'); }
    finally { setPending(false); }
  }

  async function saveCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError(''); setNotice('');
    try {
      const payload = await request(cityEditId ? `/api/admin/cities/${encodeURIComponent(cityEditId)}` : '/api/admin/cities', cityEditId ? 'PATCH' : 'POST', { name: cityName, countryId: cityCountryId });
      const city = payload.city as City;
      setCities((current) => (cityEditId ? current.map((item) => item.id === cityEditId ? city : item) : [...current, city]).sort((a, b) => a.country.name.localeCompare(b.country.name) || a.name.localeCompare(b.name)));
      setCityName(''); setCityEditId('');
      setNotice('تم حفظ المدينة.');
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر حفظ المدينة.'); }
    finally { setPending(false); }
  }

  async function deleteCity(city: City) {
    if (!window.confirm(`حذف المدينة «${city.name}»؟`)) return;
    setPending(true); setError(''); setNotice('');
    try {
      await request(`/api/admin/cities/${encodeURIComponent(city.id)}`, 'DELETE');
      setCities((current) => current.filter((item) => item.id !== city.id));
      if (cityEditId === city.id) { setCityEditId(''); setCityName(''); }
      setNotice('تم حذف المدينة.');
    } catch (e) { setError(e instanceof Error ? e.message : 'تعذر حذف المدينة.'); }
    finally { setPending(false); }
  }

  return <div className="space-y-7">
    {error ? <p role="alert" className="rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-200">{error}</p> : null}
    {notice ? <p role="status" className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-3 text-sm text-emerald-200">{notice}</p> : null}
    <section className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={saveCountry} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
        <h2 className="text-lg font-bold">{countryEditId ? 'تعديل البلد' : 'إضافة بلد'}</h2>
        <label className="mt-4 block text-sm text-slate-300">اسم البلد<input required maxLength={100} value={countryName} onChange={(e) => setCountryName(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
        <label className="mt-4 block text-sm text-slate-300">رمز ISO من حرفين<input required maxLength={2} minLength={2} pattern="[A-Za-z]{2}" value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase())} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 uppercase text-white" placeholder="NL" /></label>
        <div className="mt-4 flex gap-2"><button disabled={pending || !countryName.trim() || !/^[A-Z]{2}$/.test(countryCode)} className="rounded-xl bg-amber-200 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40">{pending ? 'جارٍ الحفظ…' : countryEditId ? 'حفظ البلد' : 'إضافة البلد'}</button>{countryEditId ? <button type="button" disabled={pending} onClick={() => { setCountryEditId(''); setCountryName(''); setCountryCode(''); }} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm">إلغاء</button> : null}</div>
      </form>

      <form onSubmit={saveCity} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
        <h2 className="text-lg font-bold">{cityEditId ? 'تعديل المدينة' : 'إضافة مدينة'}</h2>
        <label className="mt-4 block text-sm text-slate-300">اسم المدينة<input required maxLength={100} value={cityName} onChange={(e) => setCityName(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
        <label className="mt-4 block text-sm text-slate-300">البلد<select required value={cityCountryId} onChange={(e) => setCityCountryId(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white"><option value="">اختر بلدًا</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name} ({country.code})</option>)}</select></label>
        <div className="mt-4 flex gap-2"><button disabled={pending || !cityName.trim() || !cityCountryId} className="rounded-xl bg-amber-200 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40">{pending ? 'جارٍ الحفظ…' : cityEditId ? 'حفظ المدينة' : 'إضافة المدينة'}</button>{cityEditId ? <button type="button" disabled={pending} onClick={() => { setCityEditId(''); setCityName(''); }} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm">إلغاء</button> : null}</div>
      </form>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <div><h2 className="mb-3 text-lg font-bold">البلدان ({countries.length})</h2><div className="space-y-2">{countries.map((country) => <article key={country.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#11182a] p-4"><div><p className="font-semibold">{country.name} <span className="text-xs text-amber-200">{country.code}</span></p><p className="mt-1 text-xs text-slate-500">{country._count.cities} مدينة · {country._count.suppliers} مورد</p></div><div className="flex gap-2"><button type="button" disabled={pending} onClick={() => { setCountryEditId(country.id); setCountryName(country.name); setCountryCode(country.code); }} className="rounded-lg border border-white/15 px-3 py-2 text-xs">تعديل</button><button type="button" disabled={pending} onClick={() => void deleteCountry(country)} className="rounded-lg border border-red-300/20 px-3 py-2 text-xs text-red-200">حذف</button></div></article>)}{!countries.length ? <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-500">أضف أول بلد لتتمكن من تسجيل المدن والموردين.</p> : null}</div></div>
      <div><h2 className="mb-3 text-lg font-bold">المدن ({cities.length})</h2><div className="space-y-2">{cities.map((city) => <article key={city.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#11182a] p-4"><div><p className="font-semibold">{city.name}</p><p className="mt-1 text-xs text-slate-500">{city.country.name} ({city.country.code}) · {city._count.suppliers} مورد</p></div><div className="flex gap-2"><button type="button" disabled={pending} onClick={() => { setCityEditId(city.id); setCityName(city.name); setCityCountryId(city.countryId); }} className="rounded-lg border border-white/15 px-3 py-2 text-xs">تعديل</button><button type="button" disabled={pending} onClick={() => void deleteCity(city)} className="rounded-lg border border-red-300/20 px-3 py-2 text-xs text-red-200">حذف</button></div></article>)}{!cities.length ? <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-500">لا توجد مدن مسجلة.</p> : null}</div></div>
    </section>
  </div>;
}
