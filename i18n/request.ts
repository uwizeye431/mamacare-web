import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from './config';

// Picks the interface language for each request from the language cookie.
// Kinyarwanda strings missing from rw.json fall back to English.
export default getRequestConfig(async () => {
  const cookieValue = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieValue) ? cookieValue : DEFAULT_LOCALE;

  const english = (await import('../messages/en.json')).default;
  const messages = locale === 'en' ? english : deepMerge(english, (await import(`../messages/${locale}.json`)).default);
  return { locale, messages };
});

type Messages = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Messages =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Kinyarwanda overrides English key by key; lists (e.g. danger signs) are replaced as a whole
const deepMerge = (base: Messages, override: Messages): Messages => {
  const result: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    result[key] = isPlainObject(value) && isPlainObject(current) ? deepMerge(current, value) : value;
  }
  return result;
};
