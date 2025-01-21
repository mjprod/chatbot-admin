import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import ms from './locales/ms_MY/translation.json';
import zh_CN from './locales/zh_CN/translation.json';
import zh_TW from './locales/zh_TW/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ms_MY: { translation: ms },
    zh_CN: { translation: zh_CN },
    zh_TW: { translation: zh_TW },
  },
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language if translation is missing
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
