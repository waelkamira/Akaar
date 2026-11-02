'use client';

import { useLanguage } from './language-context';

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-ak-line bg-ak-surface/70 px-3 py-2 text-xs text-white">
      <span className="sr-only">لغة المتجر</span>
      {!compact && <span className="text-ak-muted">اللغة</span>}
      <select
        aria-label="لغة المتجر"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="max-w-28 bg-transparent font-semibold text-white outline-none"
      >
        {supportedLanguages.map((item) => <option key={item.code} value={item.code} className="bg-[#202725] text-white">{item.label}</option>)}
      </select>
    </label>
  );
}
