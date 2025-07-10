import { createContext, FC, PropsWithChildren } from 'react';
import { i18n as II18n } from 'i18next';
import { TFunction } from 'next-i18next';

import { i18n } from '@/utils/translation';

interface TranslationContextValues {
  t: TFunction;
  i18n: II18n;
}

export const TranslationContext = createContext<undefined | TranslationContextValues>(undefined);

export const TranslationProvider: FC<PropsWithChildren<{ t: TFunction }>> = ({ t, children }) => {
  return <TranslationContext.Provider value={{ t, i18n }}>{children}</TranslationContext.Provider>;
};
