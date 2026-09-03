import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Lenis-powered inertial scrolling.
 *
 * Lenis drives the real window scroll position, so `window.scrollY`,
 * IntersectionObserver and Framer Motion's `useScroll` all keep working.
 *
 * Exposes a `lock`/`unlock` pair so modals can freeze the page without the
 * classic `body { overflow: hidden }` scrollbar jump.
 */

const SmoothScrollContext = createContext({
  lenis: null,
  lock: () => {},
  unlock: () => {},
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

const SmoothScroll = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef(null);
  const lockCount = useRef(0);
  const [api, setApi] = useState(null);

  useEffect(() => {
    // Honour the OS setting: no interpolated scrolling at all.
    if (prefersReducedMotion) {
      setApi({
        lenis: null,
        lock: () => {
          document.documentElement.style.overflow = 'hidden';
        },
        unlock: () => {
          document.documentElement.style.overflow = '';
        },
        scrollTo: (target) => {
          const el = typeof target === 'string' ? document.querySelector(target) : target;
          el?.scrollIntoView({ behavior: 'auto', block: 'start' });
        },
      });
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      // Native touch scrolling feels better than an emulated one on mobile.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    setApi({
      lenis,
      lock: () => {
        lockCount.current += 1;
        if (lockCount.current === 1) lenis.stop();
      },
      unlock: () => {
        lockCount.current = Math.max(0, lockCount.current - 1);
        if (lockCount.current === 0) lenis.start();
      },
      scrollTo: (target, options) => lenis.scrollTo(target, { offset: -80, ...options }),
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  return (
    <SmoothScrollContext.Provider value={api ?? { lenis: null, lock: () => {}, unlock: () => {}, scrollTo: () => {} }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScroll;
