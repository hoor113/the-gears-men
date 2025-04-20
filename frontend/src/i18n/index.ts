import { getTranslationKeys } from 'i18n-keys';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './lang/en';
import { vi } from './lang/vi';

const initLang = async () => {
  i18n.use(initReactI18next).init({
    initImmediate: false,
    compatibilityJSON: 'v3',
    fallbackLng: 'vi',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
    react: {
      useSuspense: false,
    },
  });
};

initLang();

export const i18nKeys = getTranslationKeys(vi);
export default i18n;
