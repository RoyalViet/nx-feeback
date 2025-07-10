import { useMemo } from 'react';
import { default as useWindowSizeLib } from 'react-use/lib/useWindowSize';

import { RESPONSIVE_WIDTH } from '@/constants/common.constant';

import { useClient } from './useClient';

const useWindowSize = () => {
  const windowSize = useWindowSizeLib();
  const { isClient } = useClient();

  const isDesktop = useMemo(() => {
    if (!isClient || typeof windowSize.width !== 'number') {
      return false;
    }
    return windowSize.width >= RESPONSIVE_WIDTH.DESKTOP;
  }, [windowSize.width, isClient]);

  const isMobile = useMemo(() => {
    if (!isClient || typeof windowSize.width !== 'number') {
      return false;
    }
    return windowSize.width < RESPONSIVE_WIDTH.MOBILE;
  }, [windowSize.width, isClient]);

  return { ...windowSize, isDesktop, isMobile };
};

export default useWindowSize;
