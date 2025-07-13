import { useEffect, useState } from 'react';

import { FOOTER_ID } from '@/layouts/common/Footer';
import { HEADER_ID } from '@/layouts/common/Header';

interface LayoutHeights {
  footerHeight: number;
  headerHeight: number;
  totalHeight: number;
}

const getTotalHeight = (element: HTMLElement): number => {
  return element.getBoundingClientRect().height;
};

export const useLayoutHeights = (): LayoutHeights => {
  const [heights, setHeights] = useState<LayoutHeights>({
    footerHeight: 0,
    headerHeight: 56,
    totalHeight: 112,
  });

  useEffect(() => {
    const footer = document.getElementById(FOOTER_ID);
    const header = document.getElementById(HEADER_ID);

    const resizeObserver = new ResizeObserver(entries => {
      const newHeights = { ...heights };

      for (const entry of entries) {
        if (entry.target === footer) {
          newHeights.footerHeight = getTotalHeight(footer);
        } else if (entry.target === header) {
          newHeights.headerHeight = getTotalHeight(header);
        }
      }

      newHeights.totalHeight = newHeights.footerHeight + newHeights.headerHeight;
      setHeights(newHeights);
    });

    if (footer) {
      resizeObserver.observe(footer);
    }
    if (header) {
      resizeObserver.observe(header);
    }

    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return heights;
};

export default useLayoutHeights;
