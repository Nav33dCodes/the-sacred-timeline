import { useState, useCallback } from 'react';
import { FaPlay } from 'react-icons/fa6';
import './LiteYouTube.css';

/**
 * A YouTube facade.
 *
 * The real player is ~1.2MB of JS per embed. This renders a static thumbnail
 * and only mounts the <iframe> after the user actually asks for it — which is
 * the difference between six players booting on page load and zero.
 *
 * Hovering warms the connection so the click still feels instant.
 */
const LiteYouTube = ({ id, title, className = '', aspect = '16 / 9', poster }) => {
  const [active, setActive] = useState(false);
  const [warm, setWarm] = useState(false);

  const warmUp = useCallback(() => setWarm(true), []);

  // maxresdefault isn't guaranteed to exist; hqdefault always is.
  const thumb = poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const fallbackThumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className={`lite-yt ${active ? 'is-active' : ''} ${className}`} style={{ aspectRatio: aspect }}>
      {warm && !active && (
        <>
          <link rel="preconnect" href="https://www.youtube-nocookie.com" />
          <link rel="preconnect" href="https://www.google.com" />
        </>
      )}

      {active ? (
        <iframe
          className="lite-yt__frame"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="lite-yt__trigger"
          onClick={() => setActive(true)}
          onMouseEnter={warmUp}
          onFocus={warmUp}
          onTouchStart={warmUp}
          aria-label={`Play ${title}`}
        >
          <img
            className="lite-yt__thumb"
            src={thumb}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (e.currentTarget.src !== fallbackThumb) e.currentTarget.src = fallbackThumb;
            }}
          />
          <span className="lite-yt__scrim" aria-hidden="true" />
          <span className="lite-yt__play" aria-hidden="true">
            <FaPlay />
          </span>
          <span className="lite-yt__label">{title}</span>
        </button>
      )}
    </div>
  );
};

export default LiteYouTube;
