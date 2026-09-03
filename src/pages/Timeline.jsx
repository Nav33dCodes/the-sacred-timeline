import { useState, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { FaCheck, FaChevronRight, FaArrowRight, FaRotateLeft } from 'react-icons/fa6';
import PageTransition from '../components/PageTransition';
import Reveal from '../components/Reveal';
import { watchOrderGroups, entries, SAGAS } from '../data/mcuData';
import { useWatch } from '../context/WatchContext';
import { EASE_OUT } from '../lib/motion';
import './Timeline.css';

const ORDERS = [
  { key: 'release', label: 'Release order' },
  { key: 'chrono', label: 'Chronological' },
];

/* ---------- Row ---------- */
const Row = memo(function Row({ entry, position, watched, onToggle }) {
  return (
    <li className={`trow ${watched ? 'is-watched' : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={watched}
        className="trow__check"
        onClick={() => onToggle(entry.id)}
      >
        <span className="trow__box" aria-hidden="true">
          <FaCheck />
        </span>
        <span className="trow__index" aria-hidden="true">
          {String(position).padStart(2, '0')}
        </span>
        <span className="trow__title">{entry.title}</span>
        <span className="trow__tags" aria-hidden="true">
          <span className="trow__year">{entry.year}</span>
          <span className={`badge ${entry.status === 'upcoming' ? 'badge-upcoming' : ''}`}>
            {entry.status === 'upcoming' ? 'Upcoming' : entry.type}
          </span>
        </span>
      </button>

      <Link to={`/entry/${entry.id}`} className="trow__more" aria-label={`Open ${entry.title}`}>
        <FaArrowRight aria-hidden="true" />
      </Link>
    </li>
  );
});

/* ---------- Group ---------- */
const Group = ({ group, order, open, onOpenChange }) => {
  const { isWatched, toggleWatched, toggleMany, countFor } = useWatch();

  const ordered = useMemo(() => {
    const list = [...group.entries];
    return order === 'chrono'
      ? list.sort((a, b) => a.chrono - b.chrono)
      : list.sort((a, b) => a.release - b.release);
  }, [group.entries, order]);

  const ids = useMemo(() => ordered.map((e) => e.id), [ordered]);
  const done = countFor(ordered);
  const total = ordered.length;
  const pct = Math.round((done / total) * 100);
  const complete = done === total;

  return (
    <section className="tgroup">
      <header className="tgroup__head">
        <button
          type="button"
          className="tgroup__toggle"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
        >
          <motion.span
            className="tgroup__chevron"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            aria-hidden="true"
          >
            <FaChevronRight />
          </motion.span>
          <span className="tgroup__name">{group.group}</span>
          <span className="tgroup__count">
            {done}/{total}
          </span>
        </button>

        <button
          type="button"
          className="tgroup__all"
          onClick={() => toggleMany(ids)}
          aria-label={complete ? `Clear all in ${group.group}` : `Mark all in ${group.group} watched`}
        >
          {complete ? 'Clear all' : 'Mark all'}
        </button>
      </header>

      <p className="tgroup__blurb">{group.blurb}</p>

      <div className="tgroup__bar" aria-hidden="true">
        <motion.span
          className="tgroup__fill"
          initial={false}
          animate={{ scaleX: pct / 100 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            style={{ overflow: 'hidden' }}
          >
            <ul className="tgroup__list">
              {ordered.map((entry, i) => (
                <Row
                  key={entry.id}
                  entry={entry}
                  position={i + 1}
                  watched={isWatched(entry.id)}
                  onToggle={toggleWatched}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ---------- Page ---------- */
const Timeline = () => {
  const { watched, clearAll, progressFor } = useWatch();
  const [order, setOrder] = useState('release');
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(watchOrderGroups.map((g) => [g.group, true])),
  );
  const [confirmReset, setConfirmReset] = useState(false);

  const total = entries.length;
  const pct = progressFor(entries);

  const setOpen = useCallback((name, value) => {
    setOpenGroups((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    clearAll();
    setConfirmReset(false);
  };

  return (
    <PageTransition>
      <div className="tl">
        <header className="tl__hero">
          <div className="container tl__hero-grid">
            <Reveal>
              <p className="eyebrow">Watch order</p>
              <h1 className="tl__title">Master timeline</h1>
              <p className="lead">
                Every title across five continuities. Tick them off as you go — progress is saved to
                this device.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="tl__meter">
              <div
                className="tl__ring"
                style={{ '--pct': pct }}
                role="img"
                aria-label={`${pct} percent complete`}
              >
                <span className="tl__ring-value">{pct}%</span>
              </div>
              <p className="tl__ring-caption">
                <strong>{watched.length}</strong> of {total} watched
              </p>
            </Reveal>
          </div>
        </header>

        <div className="container tl__controls">
          <LayoutGroup id="order">
            <div className="segmented" role="group" aria-label="Sort order">
              {ORDERS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className={`segmented__btn ${order === o.key ? 'is-active' : ''}`}
                  onClick={() => setOrder(o.key)}
                  aria-pressed={order === o.key}
                >
                  {order === o.key && (
                    <motion.span
                      layoutId="segmented-pill"
                      className="segmented__pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          <div className="tl__control-actions">
            <Link to="/browse" className="tl__link">
              Browse as grid
            </Link>
            <button
              type="button"
              className={`tl__reset ${confirmReset ? 'is-confirm' : ''}`}
              onClick={reset}
              disabled={watched.length === 0}
            >
              <FaRotateLeft aria-hidden="true" />
              {confirmReset ? 'Tap again to confirm' : 'Reset progress'}
            </button>
          </div>
        </div>

        <div className="container tl__groups">
          {watchOrderGroups.map((group) => (
            <Group
              key={group.group}
              group={group}
              order={order}
              open={openGroups[group.group]}
              onOpenChange={(v) => setOpen(group.group, v)}
            />
          ))}
        </div>

        <div className="container tl__legend">
          {Object.values(SAGAS).map((s) => (
            <span className="badge" key={s.key}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Timeline;
