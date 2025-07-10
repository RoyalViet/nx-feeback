/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vn'],
  },
  interpolation: {
    prefix: '{',
    suffix: '}',
    escapeValue: false,
  },
  ssg: true, // Important for static pages
  fallbackLng: 'en',
  nonExplicitSupportedLngs: true,
  reloadOnPrerender: true,
};
