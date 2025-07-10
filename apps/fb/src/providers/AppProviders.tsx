/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import { TFunction } from 'next-i18next';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';

import { ReactComponent as AlertFillIcon } from '@/assets/icons/AlertFill.svg';
import { ReactComponent as CloseLineIcon } from '@/assets/icons/CloseLine.svg';
import { ReactComponent as ErrorWarningFillIcon } from '@/assets/icons/ErrorWarningFill.svg';
import { ReactComponent as InformationFillIcon } from '@/assets/icons/InformationFill.svg';
import { ReactComponent as SelectBoxCircleFillIcon } from '@/assets/icons/SelectBoxCircleFill.svg';
import { store } from '@/stores';
import { TranslationProvider } from '@/utils/translation';

export const CommonProviders = ({
  children,
  t,
}: {
  children: React.ReactNode;
  t: TFunction | any;
}) => {
  return (
    <>
      <NuqsAdapter>
        <TranslationProvider t={t as TFunction}>{children}</TranslationProvider>
      </NuqsAdapter>
      <ToastContainer
        hideProgressBar={true}
        position={'bottom-right'}
        transition={Slide}
        closeButton={props => {
          const { closeToast, ...svgProps } = props;
          return (
            <button type="button" onClick={closeToast}>
              <CloseLineIcon {...svgProps} className="text-gray-400" width={20} height={20} />
            </button>
          );
        }}
        icon={({ type }) => {
          if (type === 'success')
            return <SelectBoxCircleFillIcon className="text-success-500" width={20} height={20} />;
          if (type === 'error')
            return <ErrorWarningFillIcon className="text-error-500" width={20} height={20} />;
          if (type === 'warning')
            return <AlertFillIcon className="text-warning-500" width={20} height={20} />;
          if (type === 'info')
            return <InformationFillIcon className="text-brand-500" width={20} height={20} />;
          else return <InformationFillIcon className="text-brand-500" width={20} height={20} />;
        }}
      />
    </>
  );
};

const AppProviders = ({
  children,
  stabilityCheck = 'never',
  t,
}: {
  children: React.ReactNode;
  stabilityCheck?: 'always' | 'never' | 'once';
  t: TFunction | any;
}) => {
  return (
    <ReduxProvider store={store} stabilityCheck={stabilityCheck}>
      <CommonProviders t={t}>{children}</CommonProviders>
    </ReduxProvider>
  );
};

export default AppProviders;
