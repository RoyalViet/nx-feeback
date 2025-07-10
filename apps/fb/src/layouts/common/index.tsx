import React from 'react';

import { useLayoutHeights } from '@/hooks/useLayoutHeights';
import useWindowSize from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils';
import { LayoutProps } from '@/models/common';

import Footer from './Footer';
import Header from './Header';
import { Navigation } from './Navigation';

const CommonLayout: React.FC<LayoutProps> = ({ children }) => {
  const { isDesktop } = useWindowSize();
  const { headerHeight, footerHeight } = useLayoutHeights();
  return (
    <div className="min-h-dvh w-full">
      <Header />
      <Navigation />

      <div
        style={{
          height: isDesktop ? `calc(100vh - ${headerHeight + footerHeight}px)` : 'auto',
        }}
        className={cn('w-full flex-1 overflow-auto', {})}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export function renderCommonLayout({ children }: LayoutProps) {
  return <CommonLayout>{children}</CommonLayout>;
}
export { CommonLayout };
