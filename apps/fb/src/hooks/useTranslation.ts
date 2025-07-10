import { useContext } from 'react';
import { useTranslation as useNextTranslation } from 'next-i18next';

import { TranslationContext } from '@/contexts/TranslationContext';

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  const { t, i18n } = useNextTranslation();

  if (context === undefined) {
    return { t, i18n };
  }

  return context;
};
