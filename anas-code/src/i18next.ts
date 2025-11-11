import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const ns = ['translation'];
const supportedLanguages = ['en', 'nl'];

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    debug: false,
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    supportedLngs: supportedLanguages,
    resources: undefined, // use http backend
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
