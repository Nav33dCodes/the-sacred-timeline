import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from './SmoothScroll';

/**
 * Resets scroll on navigation. Goes through Lenis when it is running so the
 * smooth-scroll instance and the real scroll position never disagree.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
