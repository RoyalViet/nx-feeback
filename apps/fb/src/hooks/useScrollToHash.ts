import { useEffect } from 'react';

const useScrollToHash = (
  sectionId: string,
  options: {
    scrollIntoView?: boolean | ScrollIntoViewOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies?: any[];
  } = {}
) => {
  const { scrollIntoView, dependencies = [] } = options;

  useEffect(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView(scrollIntoView || { behavior: 'smooth' });
    }
  }, [dependencies, sectionId, scrollIntoView]);
};

export default useScrollToHash;
