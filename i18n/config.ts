// Supported interface languages. The choice is stored in a cookie (no /en or /rw in URLs).
export const LOCALES = ['en', 'rw'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);
