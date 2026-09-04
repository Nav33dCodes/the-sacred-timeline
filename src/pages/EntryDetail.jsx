import { useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import PageTransition from '../components/PageTransition';
import Reveal from '../components/Reveal';
import { getEntry, watchOrderGroups, SAGAS, PHASES } from '../data/mcuData';
import { useWatch } from '../context/WatchContext';
import NotFound from './NotFound';
import './EntryDetail.css';

const EntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWatched, toggleWatched } = useWatch();

  const entry = getEntry(id);

  const siblings = useMemo(() => {
    if (!entry) return { prev: null, next: null, group: null };
    const group = watchOrderGroups.find((g) => g.group === entry.group);
    const list = [...group.entries].sort((a, b) => a.release - b.release);
    const i = list.findIndex((e) => e.id === entry.id);
    return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null, group };
  }, [entry]);

  // Keep the tab title in sync with the entry being read.
  useEffect(() => {
    if (!entry) return undefined;
    const previous = document.title;
    document.title = `${entry.title} · The Sacred Timeline`;
    return () => {
      document.title = previous;
    };
  }, [entry]);

  // Left/right arrows walk the group.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target?.matches?.('input, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowLeft' && siblings.prev) navigate(`/entry/${siblings.prev.id}`);
      if (e.key === 'ArrowRight' && siblings.next) navigate(`/entry/${siblings.next.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [siblings, navigate]);

  if (!entry) return <NotFound />;

  const watched = isWatched(entry.id);
  const saga = SAGAS[entry.saga];
  const phase = PHASES.find((p) => p.id === entry.phase);

  const releaseDate = entry.date
    ? new Date(`${entry.date}T00:00:00`).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : entry.year;

  const facts = [
    { label: 'Release date', value: releaseDate },
    { label: 'Format', value: entry.type },
    { label: 'Universe', value: saga.label },
    phase && { label: 'Phase', value: `${phase.label} · ${phase.years}` },
    { label: 'Release position', value: `#${entry.release} in ${entry.group}` },
    { label: 'Chronological position', value: `#${entry.chrono} in ${entry.group}` },
    { label: 'Status', value: entry.status === 'upcoming' ? 'Not yet released' : 'Released' },
  ].filter(Boolean);

  return (
    <PageTransition>
      <article className="detail">
        <header className="detail__hero">
          <div className="container">
            <Link to="/browse" className="detail__back">
              <FaArrowLeft aria-hidden="true" />
              Back to archive
            </Link>

            <Reveal>
              <div className="detail__tags">
                <span className={`badge ${entry.status === 'upcoming' ? 'badge-upcoming' : 'badge-accent'}`}>
                  {entry.status === 'upcoming' ? 'Upcoming' : entry.type}
                </span>
                <span className="badge">{saga.label}</span>
                {phase && <span className="badge">{phase.label}</span>}
              </div>

              <h1 className="detail__title">{entry.title}</h1>
              <p className="detail__synopsis">{entry.synopsis}</p>

              <div className="detail__actions">
                <button
                  type="button"
                  className={`btn ${watched ? 'btn-ghost' : 'btn-primary'} btn-sheen`}
                  onClick={() => toggleWatched(entry.id)}
                  aria-pressed={watched}
                >
                  {watched ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
                  {watched ? 'Watched' : 'Mark as watched'}
                </button>
                <Link to="/timeline" className="btn btn-ghost btn-sheen">
                  Open timeline
                </Link>
              </div>
            </Reveal>
          </div>
        </header>

        <section className="container detail__body">
          <Reveal>
            <h2 className="detail__section-title">Details</h2>
            <dl className="detail__facts">
              {facts.map((f) => (
                <div className="detail__fact" key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        <nav className="container detail__nav" aria-label="Adjacent titles">
          {siblings.prev ? (
            <Link to={`/entry/${siblings.prev.id}`} className="detail__nav-link is-prev">
              <span className="detail__nav-label">
                <FaArrowLeft aria-hidden="true" /> Previous
              </span>
              <span className="detail__nav-title">{siblings.prev.title}</span>
            </Link>
          ) : (
            <span />
          )}

          {siblings.next && (
            <Link to={`/entry/${siblings.next.id}`} className="detail__nav-link is-next">
              <span className="detail__nav-label">
                Next <FaArrowRight aria-hidden="true" />
              </span>
              <span className="detail__nav-title">{siblings.next.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </PageTransition>
  );
};

export default EntryDetail;
