import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { renderCommonLayout } from '@/layouts/common';
import { NextPageWithData } from '@/models/common';
import { ROUTER_PATHS } from '@/routers/router.constant';

const Page: NextPageWithData = () => {
  const router = useRouter();
  // const { token } = useAuth();
  const token = '__fake_token__';
  const [shouldRender, setShouldRender] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (['/'].includes(currentPath)) {
      const queryString = window.location.search;
      const queryParams = Object.fromEntries(new URLSearchParams(queryString));
      router.push({
        pathname: ROUTER_PATHS.ROOT,
        query: queryParams,
      });
    } else {
      setShouldRender(true);
    }
  }, [router]);

  if (!shouldRender) {
    return <div />;
  }

  return (
    <div className="m-auto flex h-full max-w-[470px] flex-col items-center justify-center gap-8">
      <div className="flex w-full flex-col justify-center gap-4">
        <h1 className="mx-auto text-xl font-bold">{t('404.TITLE')}</h1>
        <p className="text-center">{t('404.DESCRIPTION1')}</p>
        <p className="text-center">{t('404.DESCRIPTION2')}</p>
      </div>
      <Button
        className="w-full"
        onClick={() => {
          if (token) {
            router.push({
              pathname: ROUTER_PATHS.ROOT,
            });
          }
        }}
      >
        {t('BACK_TO_HOME')}
      </Button>
    </div>
  );
};

Page.renderLayout = ({ children }) => {
  return renderCommonLayout({
    children,
  });
};

export default Page;
