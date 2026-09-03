import { useMemo, useState, useDeferredValue, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import PageTransition from '../components/PageTransition';
import EntryCard from '../components/EntryCard';
import Reveal from '../components/Reveal';
import { entries, PHASES, SAGAS, TYPES } from '../data/mcuData';
import { useWatch } from '../context/WatchContext';
import { EASE_OUT } from '../lib/motion';
import './Browse.css';

const SORTS = [
  { key: 'year-asc', label: 'Oldest' },
  { key: 'year-desc', label: 'Newest' },
  { key: 'title', label: 'A–Z' },
];

const Browse = () => {
  const [params, setParams] = useSearchParams();
  const { isWatched } = useWatch();
  const [rawQuery, setRawQuery] = useState('');
  const query = useDeferredValue(rawQuery);

  const saga = params.get('saga') ?? 'all';
  const type = params.get('type') ?? 'all';
  const phase = params.get('phase') ?? 'all';
  const status = params.get('status') ?? 'all';
  const sort = params.get('sort') ?? 'year-asc';

  const setParam = useCallback(
    (key, value) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === 'all' || value == null) next.delete(key);
          else next.set(key, String(value));
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const clearAll = useCallback(() => {
    setRawQuery('');
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = entries.filter((e) => {
      if (saga !== 'all' && e.saga !== saga) return false;
      if (type !== 'all' && e.type !== type) return false;
      if (phase !== 'all' && String(e.phase) !== phase) return false;
      if (status === 'watched' && !isWatched(e.id)) return false;
      if (status === 'unwatched' && isWatched(e.id)) return false;
      if (status === 'upcoming' && e.status !== 'upcoming') return false;
      if (q && !`${e.title} ${e.synopsis}`.toLowerCase().includes(q)) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'year-desc') return b.year - a.year || a.title.localeCompare(b.title);
      return a.year - b.year || a.title.localeCompare(b.title);
    });
  }, [query, saga, type, phase, status, sort, isWatched]);

  const activeFilters =
    (saga !== 'all') + (type !== 'all') + (phase !== 'all') + (status !== 'all') + (query.trim() ? 1 : 0);

  const chipGroups = [
    {
      label: 'Universe',
      key: 'saga',
      value: saga,
      options: [{ v: 'all', l: 'All' }, ...Object.values(SAGAS).map((s) => ({ v: s.key, l: s.short }))],
    },
    {
      label: 'Format',
      key: 'type',
      value: type,
      options: [{ v: 'all', l: 'All' }, ...TYPES.map((t) => ({ v: t, l: t }))],
    },
    {
      label: 'Phase',
      key: 'phase',
      value: phase,
      options: [{ v: 'all', l: 'All' }, ...PHASES.map((p) => ({ v: String(p.id), l: `0${p.id}` }))],
    },
    {
      label: 'Status',
      key: 'status',
      value: status,
      options: [
        { v: 'all', l: 'All' },
        { v: 'watched', l: 'Watched' },
        { v: 'unwatched', l: 'Unwatched' },
        { v: 'upcoming', l: 'Upcoming' },
      ],
    },
  ];

  return (
    <PageTransition>
      <div className="browse">
        <header className="browse__hero">
          <div className="container">
            <Reveal>
              <p className="eyebrow">The archive</p>
              <h1 className="browse__title">Every title, filtered</h1>
              <p className="lead">
                {entries.length} entries spanning five continuities. Filter by universe, format,
                phase or what you have already seen.
              </p>
            </Reveal>
          </div>
        </header>

        <div className="container browse__toolbar">
          <div className="browse__search">
            <FaMagnifyingGlass aria-hidden="true" />
            <input
              type="search"
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              placeholder="Filter by title or synopsis…"
              aria-label="Filter titles"
            />
            {rawQuery && (
              <button type="button" onClick={() => setRawQuery('')} aria-label="Clear filter text">
                <FaXmark />
              </button>
            )}
          </div>

          <div className="browse__sort">
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`browse__sort-btn ${sort === s.key ? 'is-active' : ''}`}
                onClick={() => setParam('sort', s.key === 'year-asc' ? 'all' : s.key)}
                aria-pressed={sort === s.key}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <LayoutGroup id="browse-filters">
          <div className="container browse__filters">
            {chipGroups.map((group) => (
              <div className="browse__filter" key={group.key}>
                <span className="browse__filter-label">{group.label}</span>
                <div className="browse__chips">
                  {group.options.map((opt) => {
                    const active = group.value === opt.v;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        className={`chip ${active ? 'is-active' : ''}`}
                        onClick={() => setParam(group.key, opt.v)}
                        aria-pressed={active}
                      >
                        {active && (
                          <motion.span
                            layoutId={`chip-${group.key}`}
                            className="chip__pill"
                            transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                          />
                        )}
                        <span>{opt.l}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </LayoutGroup>

        <div className="container browse__meta">
          <p>
            <strong>{results.length}</strong> {results.length === 1 ? 'title' : 'titles'}
          </p>
          {activeFilters > 0 && (
            <button type="button" className="browse__clear" onClick={clearAll}>
              Clear filters ({activeFilters})
            </button>
          )}
        </div>

        <div className="container browse__results">
          {results.length > 0 ? (
            <div className="entry-grid">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.24, ease: EASE_OUT }}
                  >
                    <EntryCard entry={entry} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="browse__empty">
              <p className="browse__empty-title">No titles match those filters</p>
              <button type="button" className="btn btn-ghost" onClick={clearAll}>
                Reset everything
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Browse;
