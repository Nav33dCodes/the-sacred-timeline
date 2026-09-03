import { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar';
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import ErrorBoundary from './components/ErrorBoundary';
import { WatchProvider } from './context/WatchContext';

// Fuse.js and the palette's CSS are ~10KB gzipped that most visits never open,
// so they load on demand — prefetched at idle so the first open is still instant.
const loadPalette = () => import('./components/CommandPalette');
const CommandPalette = lazy(loadPalette);

// Route-level code splitting — the home page never ships the archive's code.
const Home = lazy(() => import('./pages/Home'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Browse = lazy(() => import('./pages/Browse'));
const EntryDetail = lazy(() => import('./pages/EntryDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteLoader = () => (
  <div className="route-loader">
    <div className="route-loader__bar" />
    <p className="route-loader__label">Accessing archive…</p>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<RouteLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/timeline" element={<Timeline />} />
          {/* Legacy URL from the previous version. */}
          <Route path="/watch-order" element={<Timeline />} />
          <Route path="/entry/:id" element={<EntryDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const Shell = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  // Stays true after the first open so AnimatePresence can play the exit.
  const [paletteMounted, setPaletteMounted] = useState(false);

  const openSearch = useCallback(() => {
    setPaletteMounted(true);
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Warm the palette chunk once the page is idle.
  useEffect(() => {
    const schedule = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const handle = schedule(() => loadPalette());
    return () => cancel(handle);
  }, []);

  // Global Cmd/Ctrl+K and "/" shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target.matches?.('input, textarea, [contenteditable]');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteMounted(true);
        setSearchOpen((v) => !v);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        setPaletteMounted(true);
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollToTop />
      <div className="layout-container">
        <NavBar onOpenSearch={openSearch} />
        <main className="content-area" id="main">
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </main>
      </div>
      {paletteMounted && (
        <Suspense fallback={null}>
          <CommandPalette open={searchOpen} onClose={closeSearch} />
        </Suspense>
      )}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <WatchProvider>
      <SmoothScroll>
        <Shell />
      </SmoothScroll>
    </WatchProvider>
  </BrowserRouter>
);

export default App;
