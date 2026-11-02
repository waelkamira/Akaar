'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);
export const SUPPORTED_LANGUAGES = [
  { code: 'ar', label: 'العربية', direction: 'rtl' },
  { code: 'en', label: 'English', direction: 'ltr' },
];

function normalizeLanguage(value) {
  return SUPPORTED_LANGUAGES.some((item) => item.code === value) ? value : 'ar';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('ar');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cookieValue = document.cookie.split('; ').find((part) => part.startsWith('akaar_language='))?.split('=').slice(1).join('=');
    const saved = normalizeLanguage(cookieValue || window.localStorage.getItem('akaar_language'));
    setLanguageState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    const current = SUPPORTED_LANGUAGES.find((item) => item.code === language) || SUPPORTED_LANGUAGES[0];
    document.documentElement.lang = current.code;
    document.documentElement.dir = current.direction;
    document.cookie = `akaar_language=${current.code}; Path=/; Max-Age=31536000; SameSite=Lax`;
    if (ready) window.localStorage.setItem('akaar_language', current.code);
  }, [language, ready]);

  const setLanguage = useCallback((value) => setLanguageState(normalizeLanguage(value)), []);
  const value = useMemo(() => ({
    language,
    direction: language === 'ar' ? 'rtl' : 'ltr',
    setLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
