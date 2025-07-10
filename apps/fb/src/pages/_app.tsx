/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';

import { appWithTranslation } from 'next-i18next';
import { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { ComponentStatic, NextPageWithData } from '@/models/common';
import AppProviders from '@/providers/AppProviders';
import '@/utils/nprogress';
import { getTranslationFromApi, initI18n, t as tFunc } from '@/utils/translation';

import nextI18nextConfig from '../../next-i18next.config';

import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import '../assets/styles/styles.css';

type AppPropsWithData = AppProps & {
  Component: NextPageWithData & ComponentStatic;
};

const App = ({ Component, pageProps }: AppPropsWithData) => {
  const [updateKey, setUpdateKey] = useState(0);

  const handleForceUpdate = useCallback(() => {
    setUpdateKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) {
        window.scrollTo(0, 0);
      }
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getTranslationFromApi('en', 'common')
        .then(() => {
          handleForceUpdate();
        })
        .catch(console.error);
    }
  }, [handleForceUpdate]);

  const t = (key: string, options?: any) => {
    const value = (pageProps as any)?.translation?.[key];
    if (typeof value === 'string') {
      let result = value || key;
      if (options) {
        Object.entries(options).forEach(([optionKey, optionValue]) => {
          const regex = new RegExp(`{{${optionKey}}}`, 'g');
          result = result.replace(regex, String(optionValue));
        });
      }
      return result;
    }
    return tFunc(key, options);
  };

  const renderApp = () => {
    const C = Component;
    const { renderLayout } = C;

    if (renderLayout) {
      return renderLayout({
        children: <C {...pageProps} />,
        dynamicLayout: C.dynamicLayout,
      });
    }
    return <C {...pageProps} />;
  };
  return (
    <>
      <Head>
        <title>Welcome to fb!</title>
      </Head>
      <AppProviders t={t}>
        <main className="app" id={`next-app-${updateKey}`}>
          {renderApp()}
        </main>
      </AppProviders>
    </>
  );
};

const getInitialProps = async (props: AppContext & { locale?: string }) => {
  const { Component, ctx, locale } = props;

  const translationProps = await initI18n(locale || 'en', 'common', {
    keysMultiLanguage: (Component as NextPageWithData)?.keysMultiLanguage,
  });

  return {
    pageProps: {
      ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
      translation: translationProps,
    },
  };
};

App.getInitialProps = getInitialProps;

export default appWithTranslation(App, nextI18nextConfig);
