import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from 'framer-motion';
import { FaBars, FaXmark, FaMagnifyingGlass } from 'react-icons/fa6';
import { useWatch } from '../context/WatchContext';
import { TOTAL_ENTRIES } from '../data/mcuData';
import './NavBar.css';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/browse', label: 'Archive' },
  { to: '/timeline', label: 'Timeline' },
];

const NavBar = ({ onOpenSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { pathname } = useLocation();
  const { watched } = useWatch();
  const menuButtonRef = useRef(null);

  const { scrollY, scrollYProgress } = useScroll();
  // Spring-smoothed so the reading-progress bar glides instead of stepping.
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  // Motion value subscription — no React re-render per scroll frame.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled((prev) => {
      const next = y > 40;
      return prev === next ? prev : next;
    });
  });

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent));
  }, []);

  // Close the mobile sheet on navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Close on resize past the breakpoint, and on Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const mq = window.matchMedia('(min-width: 861px)');
    const onChange = (e) => e.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  const pct = TOTAL_ENTRIES ? Math.round((watched.length / TOTAL_ENTRIES) * 100) : 0;

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <motion.div className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />

      <div className="nav__inner">
        <Link to="/" className="nav__brand" aria-label="The Sacred Timeline — home">
          <span className="nav__brand-mark" aria-hidden="true" />
          <span className="nav__brand-text">
            The <em>Sacred</em> Timeline
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="nav__underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button type="button" className="nav__search" onClick={onOpenSearch} aria-label="Search the archive">
            <FaMagnifyingGlass aria-hidden="true" />
            <span className="nav__search-text">Search</span>
            <kbd className="nav__search-kbd">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>

          <Link to="/timeline" className="nav__progress-chip" title={`${watched.length} of ${TOTAL_ENTRIES} watched`}>
            <span className="nav__progress-ring" style={{ '--pct': pct }} aria-hidden="true" />
            <span className="nav__progress-value">{pct}%</span>
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className="nav__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FaXmark /> : <FaBars />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nav-sheet"
            className="nav__sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav__sheet-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
            <a
              className="nav__sheet-link"
              href="https://www.marvel.com/movies/avengers-doomsday"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Site ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
