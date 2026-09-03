import { useState, useEffect, useMemo, useRef, useCallback, useDeferredValue } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagnifyingGlass, FaArrowRight } from 'react-icons/fa6';
import Fuse from 'fuse.js';
import { entries, SAGAS } from '../data/mcuData';
import { useWatch } from '../context/WatchContext';
import { useSmoothScroll } from './SmoothScroll';
import { panel } from '../lib/motion';
import './CommandPalette.css';

const MAX_RESULTS = 8;

/** Built the first time the palette opens, then cached for the session. */
let fuseIndex = null;
const getFuse = () => {
  if (!fuseIndex) {
    fuseIndex = new Fuse(entries, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'synopsis', weight: 1 },
        { name: 'group', weight: 0.5 },
      ],
      threshold: 0.34,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }
  return fuseIndex;
};

const CommandPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const { lock, unlock } = useSmoothScroll();
  const { isWatched } = useWatch();

  // Keeps typing responsive on long lists — the input never waits on search.
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const q = deferredQuery.trim();
    if (!q) {
      return entries.filter((e) => e.status === 'upcoming').slice(0, MAX_RESULTS);
    }
    return getFuse()
      .search(q, { limit: MAX_RESULTS })
      .map((r) => r.item);
  }, [deferredQuery]);

  useEffect(() => setCursor(0), [deferredQuery]);

  // Freeze the page behind the palette.
  useEffect(() => {
    if (!open) return undefined;
    lock();
    setQuery('');
    setCursor(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      unlock();
    };
  }, [open, lock, unlock]);

  const go = useCallback(
    (entry) => {
      if (!entry) return;
      onClose();
      navigate(`/entry/${entry.id}`);
    },
    [navigate, onClose],
  );

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[cursor]);
    }
  };

  // Keep the highlighted row in view when navigating by keyboard.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search the archive">
          <motion.div
            className="cmdk__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="cmdk__panel"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={onKeyDown}
          >
            <div className="cmdk__field">
              <FaMagnifyingGlass className="cmdk__icon" aria-hidden="true" />
              <input
                ref={inputRef}
                className="cmdk__input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, series, specials…"
                autoComplete="off"
                spellCheck="false"
                aria-controls="cmdk-results"
                aria-activedescendant={results[cursor] ? `cmdk-opt-${results[cursor].id}` : undefined}
              />
              <kbd className="cmdk__kbd">Esc</kbd>
            </div>

            <div className="cmdk__meta">
              {query.trim()
                ? `${results.length} result${results.length === 1 ? '' : 's'}`
                : 'Coming next'}
            </div>

            <ul className="cmdk__results" id="cmdk-results" role="listbox" ref={listRef}>
              {results.map((entry, i) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    id={`cmdk-opt-${entry.id}`}
                    role="option"
                    aria-selected={i === cursor}
                    data-active={i === cursor}
                    className="cmdk__row"
                    onMouseMove={() => setCursor(i)}
                    onClick={() => go(entry)}
                  >
                    <span className="cmdk__year">{entry.year}</span>
                    <span className="cmdk__body">
                      <span className="cmdk__title">{entry.title}</span>
                      <span className="cmdk__sub">
                        {entry.type} · {SAGAS[entry.saga].short}
                        {entry.phase ? ` · Phase ${entry.phase}` : ''}
                        {isWatched(entry.id) ? ' · Watched' : ''}
                      </span>
                    </span>
                    <FaArrowRight className="cmdk__go" aria-hidden="true" />
                  </button>
                </li>
              ))}

              {query.trim() && results.length === 0 && (
                <li className="cmdk__empty">
                  Nothing in the archive matches “{query.trim()}”.
                </li>
              )}
            </ul>

            <footer className="cmdk__footer">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> open
              </span>
              <span>
                <kbd>Esc</kbd> close
              </span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default CommandPalette;
