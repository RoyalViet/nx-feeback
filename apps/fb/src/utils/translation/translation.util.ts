/* eslint-disable no-restricted-imports */
import { initReactI18next } from 'react-i18next';
import { createInstance, i18n as II18n } from 'i18next';

import { getTranslationApi } from '@/apis/common.api';

import nextI18nextConfig from '../../../next-i18next.config';
import commonTranslates from '../../../public/locales/en/common.json';

// Create a singleton i18n instance
const i18n: II18n = createInstance();

i18n.use(initReactI18next).init({
  lng: nextI18nextConfig.i18n.defaultLocale,
  fallbackLng: nextI18nextConfig.fallbackLng,
  interpolation: nextI18nextConfig.interpolation,
  ns: 'common',
  defaultNS: 'common',
  fallbackNS: 'common',
  load: 'currentOnly',
  backend: {
    loadPath: '/public/locales/{{lng}}/{{ns}}.json',
  },
  resources: {
    en: {
      common: commonTranslates,
    },
  },
});
interface CacheEntry {
  translations: { [key: string]: string };
  timestamp: number;
}

// const CACHE_EXPIRY_MS = 24 * 3600000; // 1 day in milliseconds
const CACHE_EXPIRY_MS = 1000;
const translationCache: { [locale: string]: CacheEntry } = {
  //
};

export const getTranslationFromApi = async (currentLocale: string, ns = 'common') => {
  const locale = currentLocale || 'en';
  try {
    // const response = await getTranslationApi({ locale });
    const response = {
      data: {
        translates: {
          FB_EN: 'FB_EN',
          BACK_TO_HOME: 'BACK_TO_HOME',
          '404.TITLE': 'Page not found',
          '404.DESCRIPTION1': 'The page you are looking for does not exist.',
          '404.DESCRIPTION2': 'Please check the URL or go back to the home page.',
        },
      },
    };
    const translates = response?.data?.translates || {};

    translationCache[currentLocale] = {
      translations: { ...commonTranslates, ...translates },
      timestamp: Date.now(),
    };

    await i18n.addResourceBundle(locale, ns, translationCache[locale].translations, true, true);

    return translationCache[locale].translations;
  } catch (e) {
    console.error('Error loading translations:', e);
    if (translationCache[locale]) {
      return translationCache[locale].translations;
    }
    return commonTranslates;
  }
};

const initI18n = async (
  locale: string,
  ns = 'common',
  options?: Partial<{ keysMultiLanguage: string[] }>
) => {
  const currentLocale = locale || 'en';
  const cacheEntry = translationCache[currentLocale];
  const cacheValid = cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_EXPIRY_MS;

  const filterTranslations = (translations: Record<string, string>) => {
    if (process.env.NODE_ENV === 'production') {
      return translations;
    }
    // for development testing
    const keys = options?.keysMultiLanguage?.filter(i => i.length) || ['FB_EN'];
    return Object.fromEntries(
      Object.entries(translations).filter(([key]) =>
        [...(keys.length ? keys : ['FB_EN'])].some(prefix => key.includes(prefix))
      )
    );
  };

  if (cacheValid) {
    return filterTranslations(cacheEntry.translations);
  }

  try {
    const response = await getTranslationFromApi(currentLocale, ns);
    return filterTranslations(response || {});
  } catch (e) {
    console.error('Error loading translations:', e);
    return translationCache[currentLocale]?.translations || commonTranslates;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const t = <T = string>(key: string, options?: any) => {
  const cachedTranslates = translationCache?.['en']?.translations || commonTranslates;
  const value = cachedTranslates?.[key];
  if (typeof value === 'string') {
    let result = value || key;
    if (options) {
      Object.entries(options).forEach(([optionKey, optionValue]) => {
        const regex = new RegExp(`{${optionKey}}`, 'g');
        result = result.replace(regex, String(optionValue));
      });
    }
    return result;
  }
  return i18n.t(key, options) as T;
};

export { i18n, initI18n, t };
