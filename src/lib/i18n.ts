import fr from '@/locales/fr.json';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type Language = 'fr' | 'en' | 'ar';

export const translations = {
  fr,
  en,
  ar
} as const;

export type TranslationKey = keyof typeof fr;

export function getTranslation(lang: Language = 'fr') {
  return translations[lang];
}

export function t(key: string, lang: Language = 'fr'): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
