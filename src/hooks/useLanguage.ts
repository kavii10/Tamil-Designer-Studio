import { useState, useCallback, useEffect } from 'react';
import { Lang, TranslationKey, translations } from '../i18n/translations';

const STORAGE_KEY = 'tds_language_preference';

/** Returns the stored language, or null if none chosen yet */
export function getStoredLanguage(): Lang | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'en' || val === 'ta') return val;
    return null;
  } catch {
    return null;
  }
}

export function storeLanguage(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = getStoredLanguage();
    return stored ?? 'en'; // default — real pick happens on first-open screen
  });

  // Sync html lang attribute and css typography classes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      if (lang === 'ta') {
        document.documentElement.classList.add('lang-ta');
        document.documentElement.classList.remove('lang-en');
        document.body.classList.add('lang-ta');
        document.body.classList.remove('lang-en');
      } else {
        document.documentElement.classList.add('lang-en');
        document.documentElement.classList.remove('lang-ta');
        document.body.classList.add('lang-en');
        document.body.classList.remove('lang-ta');
      }
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    storeLanguage(next);
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'ta' : 'en');
  }, [lang, setLang]);

  /** Translate a key */
  const tFn = useCallback(
    (key: TranslationKey): string => translations[lang][key] ?? translations.en[key],
    [lang]
  );

  return { lang, setLang, toggleLang, t: tFn };
}
