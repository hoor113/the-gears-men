import { useTranslation as useNTranslation } from 'react-i18next';

import { i18nKeys } from '@/i18n';

function useTranslation() {
  const { t, ...rest } = useNTranslation();
  return {
    // debug check i18nKeys
    t: (key: keyof typeof i18nKeys) => t(i18nKeys[key]),
    // t: (key: string) => t(key),
    ...rest,
  };
}

export default useTranslation;
