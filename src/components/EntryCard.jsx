import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import { SAGAS } from '../data/mcuData';
import { useWatch } from '../context/WatchContext';
import './EntryCard.css';

/**
 * Archive grid card. Memoised because Browse renders ~100 of these and only
 * the toggled card's `watched` prop actually changes.
 */
const EntryCard = memo(function EntryCard({ entry, index = 0 }) {
  const { isWatched, toggleWatched } = useWatch();
  const watched = isWatched(entry.id);
  const upcoming = entry.status === 'upcoming';

  return (
    <article className={`ecard ${watched ? 'is-watched' : ''}`} style={{ '--i': index }}>
      <Link to={`/entry/${entry.id}`} className="ecard__link">
        <header className="ecard__head">
          <span className="ecard__year">{entry.year}</span>
          <span className={`badge ${upcoming ? 'badge-upcoming' : ''}`}>
            {upcoming ? 'Upcoming' : entry.type}
          </span>
        </header>

        <h3 className="ecard__title">{entry.title}</h3>
        <p className="ecard__synopsis">{entry.synopsis}</p>

        <footer className="ecard__foot">
          <span className="ecard__meta">{SAGAS[entry.saga].short}</span>
          {entry.phase && <span className="ecard__meta">Phase {entry.phase}</span>}
          <span className="ecard__meta">{entry.type}</span>
        </footer>
      </Link>

      <button
        type="button"
        className="ecard__toggle"
        onClick={() => toggleWatched(entry.id)}
        aria-pressed={watched}
        aria-label={watched ? `Mark ${entry.title} as unwatched` : `Mark ${entry.title} as watched`}
      >
        {watched ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
      </button>

      <span className="ecard__glow" aria-hidden="true" />
    </article>
  );
});

export default EntryCard;
