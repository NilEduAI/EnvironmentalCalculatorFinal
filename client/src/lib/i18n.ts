import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

const resources = {
  es: { translation: translations.es },
  ca: { translation: translations.ca },
  en: { translation: translations.en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
