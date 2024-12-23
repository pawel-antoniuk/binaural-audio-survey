
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './translations/en-GB.json';
import plTranslations from './translations/pl.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-GB': {
        'translation': enTranslations,
      },
      'pl': {
        'translation': plTranslations,
      },
    },
    debug: import.meta.env.DEV,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;