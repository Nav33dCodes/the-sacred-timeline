import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { FaXmark, FaDownload, FaArrowRight, FaChevronDown } from 'react-icons/fa6';
import PageTransition from '../components/PageTransition';
import LiteYouTube from '../components/LiteYouTube';
import Img from '../components/Img';
import Reveal, { RevealItem } from '../components/Reveal';
import { useSmoothScroll } from '../components/SmoothScroll';
import { HOME_CONFIG, SOCIAL_LINKS } from '../config/siteConfig';
import { ARCHIVE_STATS, PHASES, SAGAS, entries } from '../data/mcuData';
import { stagger, charRise, EASE_OUT } from '../lib/motion';
import { SIZES, preloadImage } from '../lib/images';
import './Home.css';

const RELEASE_DATE = new Date('2026-12-18T00:00:00');

/* ============================================================
   COUNTDOWN
   Isolated so its 1Hz tick never re-renders the rest of the page.
   ============================================================ */
const useCountdown = (target) => {
  const [t, setT] = useState(() => ({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }));

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      if (target - now <= 0) {
        setT({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
      const probe = new Date(now);
      probe.setMonth(probe.getMonth() + months);
      if (probe > target) months -= 1;

      const base = new Date(now);
      base.setMonth(base.getMonth() + months);
      const rem = target - base;

      setT({
        months,
        days: Math.floor(rem / 86400000),
        hours: Math.floor((rem % 86400000) / 3600000),
        minutes: Math.floor((rem % 3600000) / 60000),
        seconds: Math.floor((rem % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return t;
};

const pad = (n) => String(n).padStart(2, '0');

const Countdown = ({ compact = false }) => {
  const t = useCountdown(RELEASE_DATE);
  const units = [
    { value: pad(t.months), label: 'Mo' },
    { value: pad(t.days), label: 'Days' },
    { value: pad(t.hours), label: 'Hrs' },
    { value: pad(t.minutes), label: 'Min' },
    { value: pad(t.seconds), label: 'Sec' },
  ];

  return (
    <div className={`countdown ${compact ? 'countdown--compact' : ''}`} role="timer" aria-label="Time until release">
      {units.map(({ value, label }, i) => (
        <div className="countdown__unit" key={label}>
          <div className="countdown__value">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={value}
                initial={{ y: '-70%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '70%', opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
              >
                {value}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="countdown__label">{label}</span>
          {i < units.length - 1 && <span className="countdown__sep" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   HERO
   ============================================================ */
const Hero = ({ onScrollToMedia }) => {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Transform-only parallax. `background-attachment: fixed` is what used to
  // make this page stutter; compositor transforms cost nothing.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-38%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const wallpapers = HOME_CONFIG.wallpapers;

  // Depends on `index`, so the countdown restarts on manual dot clicks too —
  // otherwise a click could be overridden by an already-running interval.
  useEffect(() => {
    if (wallpapers.length <= 1) return undefined;
    const id = setTimeout(() => setIndex((i) => (i + 1) % wallpapers.length), 8000);
    return () => clearTimeout(id);
  }, [index, wallpapers.length]);

  // Warm the next wallpaper so the crossfade never reveals an unloaded image.
  useEffect(() => {
    if (wallpapers.length <= 1) return;
    preloadImage(wallpapers[(index + 1) % wallpapers.length], SIZES.full);
  }, [index, wallpapers]);

  const lines = [HOME_CONFIG.heroTitleLine1, HOME_CONFIG.heroTitleLine2];

  return (
    <section className="hero" ref={ref}>
      <div className="hero__stage" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="hero__layer"
            style={{ y: reduced ? 0 : bgY, scale: reduced ? 1 : bgScale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            <Img
              src={wallpapers[index]}
              alt=""
              sizes={SIZES.full}
              priority={index === 0}
              className="hero__img"
            />
          </motion.div>
        </AnimatePresence>
        <div className="hero__grain" />
        <div className="hero__scrim" />
      </div>

      <motion.div className="hero__content" style={{ y: reduced ? 0 : contentY, opacity: reduced ? 1 : contentOpacity }}>
        <div className="container hero__grid">
          <div className="hero__lead">
            <motion.p
              className="hero__eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
            >
              {HOME_CONFIG.heroEyebrow}
            </motion.p>

            <motion.h1 className="hero__title" variants={stagger(0.035, 0.25)} initial="hidden" animate="visible">
              {lines.map((line, li) => (
                <span className="hero__title-line" key={li}>
                  {line.split('').map((ch, ci) => (
                    <span className="hero__char-mask" key={`${li}-${ci}`}>
                      <motion.span className="hero__char" variants={charRise}>
                        {ch === ' ' ? ' ' : ch}
                      </motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease: EASE_OUT }}
            >
              <Link to="/timeline" className="btn btn-primary btn-sheen">
                Enter the timeline
                <FaArrowRight aria-hidden="true" />
              </Link>
              <button type="button" className="btn btn-ghost btn-sheen" onClick={onScrollToMedia}>
                Watch the trailer
              </button>
            </motion.div>
          </div>

          <motion.div
            className="hero__aside"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25, ease: EASE_OUT }}
          >
            <p className="hero__aside-label">Arrives in theaters</p>
            <Countdown />
            <p className="hero__aside-date">December 18, 2026</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="hero__dots" role="tablist" aria-label="Hero artwork">
        {wallpapers.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Artwork ${i + 1}`}
            className={`hero__dot ${i === index ? 'is-active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <motion.button
        type="button"
        className="hero__cue"
        style={{ opacity: cueOpacity }}
        onClick={onScrollToMedia}
        aria-label="Scroll to content"
      >
        <FaChevronDown aria-hidden="true" />
      </motion.button>
    </section>
  );
};

/* ============================================================
   STAT TICKER
   ============================================================ */
const StatStrip = () => {
  const stats = [
    { value: ARCHIVE_STATS.total, label: 'Titles archived' },
    { value: ARCHIVE_STATS.movies, label: 'Feature films' },
    { value: ARCHIVE_STATS.series, label: 'Series' },
    { value: ARCHIVE_STATS.specials, label: 'Specials & animation' },
    { value: 6, label: 'Phases' },
    { value: ARCHIVE_STATS.years, label: 'Years covered', wide: true },
  ];

  return (
    <Reveal stagger className="statstrip" as={motion.section} aria-label="Archive at a glance">
      <div className="container statstrip__grid">
        {stats.map((s) => (
          <RevealItem className={`statstrip__cell ${s.wide ? 'is-wide' : ''}`} key={s.label}>
            <span className="statstrip__value">{s.value}</span>
            <span className="statstrip__label">{s.label}</span>
          </RevealItem>
        ))}
      </div>
    </Reveal>
  );
};

/* ============================================================
   3D TILT POSTER
   ============================================================ */
const TiltPoster = ({ poster, onOpen }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 260, damping: 26, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), spring);

  const onMove = useCallback(
    (e) => {
      if (reduced) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my, reduced],
  );

  const reset = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.button
      ref={ref}
      type="button"
      className="poster"
      style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => onOpen(poster)}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      aria-label={`View ${poster.title}`}
    >
      <Img
        src={poster.url}
        alt={poster.title}
        sizes={SIZES.poster}
        className="poster__img"
      />
      <span className="poster__sheen" aria-hidden="true" />
      <span className="poster__cta">View full poster</span>
    </motion.button>
  );
};

/* ============================================================
   PHASE RAIL
   ============================================================ */
const PhaseRail = () => {
  const counts = useMemo(() => {
    const map = new Map();
    entries.forEach((e) => e.phase && map.set(e.phase, (map.get(e.phase) ?? 0) + 1));
    return map;
  }, []);

  return (
    <section className="phases section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">The Sacred Timeline</p>
          <h2 className="section-title">Six phases, one continuity</h2>
          <p className="lead">
            From Tony Stark&rsquo;s cave to the collapse of the multiverse — every phase, with the
            titles that define it.
          </p>
        </Reveal>

        <Reveal stagger className="phases__rail" amount={0.1}>
          {PHASES.map((phase) => (
            <RevealItem key={phase.id}>
              <Link to={`/browse?phase=${phase.id}`} className="phasecard">
                <span className="phasecard__num">{String(phase.id).padStart(2, '0')}</span>
                <span className="phasecard__body">
                  <span className="phasecard__label">{phase.label}</span>
                  <span className="phasecard__years">{phase.years}</span>
                </span>
                <span className="phasecard__foot">
                  <span>{counts.get(phase.id) ?? 0} titles</span>
                  <span>{SAGAS[phase.saga].short}</span>
                </span>
                <span className="phasecard__arrow" aria-hidden="true">
                  <FaArrowRight />
                </span>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

/* ============================================================
   HOME
   ============================================================ */
const Home = () => {
  const [activePoster, setActivePoster] = useState(null);
  const { lock, unlock, scrollTo } = useSmoothScroll();
  const mediaRef = useRef(null);

  // Route through Lenis when it is running; native smooth scroll fights it.
  const scrollToMedia = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (scrollTo) scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [scrollTo]);

  useEffect(() => {
    if (!activePoster) return undefined;
    lock();
    const onKey = (e) => e.key === 'Escape' && setActivePoster(null);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlock();
    };
  }, [activePoster, lock, unlock]);

  return (
    <PageTransition>
      <Hero onScrollToMedia={scrollToMedia} />

      <StatStrip />

      {/* ---------- Overview ---------- */}
      <section className="overview on-paper section">
        <div className="container overview__grid">
          <Reveal stagger className="overview__text">
            <RevealItem>
              <p className="eyebrow">Overview</p>
            </RevealItem>
            <RevealItem>
              <h2 className="overview__heading">Avengers: Doomsday</h2>
            </RevealItem>
            <RevealItem>
              <p className="overview__synopsis">
                Beloved heroes from three distinct universes are set on a deadly collision course and
                face an existential threat unlike anything they have ever encountered.
              </p>
            </RevealItem>

            <RevealItem>
              <dl className="overview__meta">
                <div>
                  <dt>Directors</dt>
                  <dd>Joe Russo and Anthony Russo</dd>
                </div>
                <div>
                  <dt>Producers</dt>
                  <dd>Kevin Feige, Louis D&rsquo;Esposito, Jonathan Schwartz</dd>
                </div>
                <div className="overview__meta-wide">
                  <dt>Cast</dt>
                  <dd>
                    Robert Downey Jr., Chris Evans, Chris Hemsworth, Pedro Pascal, Paul Rudd, Anthony
                    Mackie, Florence Pugh, Vanessa Kirby, Wyatt Russell, Channing Tatum, Simu Liu,
                    Ian McKellen, Tom Hiddleston, James Marsden, Patrick Stewart, Joseph Quinn,
                    Sebastian Stan, David Harbour, Letitia Wright, Lewis Pullman, Kelsey Grammer,
                    Kathryn Newton
                  </dd>
                </div>
                <div className="overview__meta-wide">
                  <dt>Time until Doomsday</dt>
                  <dd>
                    <Countdown compact />
                  </dd>
                </div>
              </dl>
            </RevealItem>

            <RevealItem>
              <div className="overview__formats">
                {['December 18, 2026', 'IMAX', 'Dolby Vision', 'ScreenX', '4DX'].map((f) => (
                  <span className="overview__format" key={f}>
                    {f}
                  </span>
                ))}
              </div>
            </RevealItem>
          </Reveal>

          <Reveal className="overview__art" delay={0.1}>
            <Img
              src={HOME_CONFIG.posters[0]?.url}
              alt="Avengers: Doomsday teaser poster"
              sizes={SIZES.overview}
              className="overview__poster"
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- Trailers ---------- */}
      <section className="media section" id="media-section" ref={mediaRef}>
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Latest drops</p>
            <h2 className="section-title">Watch now</h2>
          </Reveal>

          <div className="media__stack">
            {HOME_CONFIG.latestDrops.map((drop, i) => (
              <Reveal key={drop.id} delay={i * 0.06}>
                <p className="media__caption">
                  <span>{drop.title}</span>
                  <span>{drop.subtitle}</span>
                </p>
                <LiteYouTube id={drop.id} title={drop.title} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Returns ---------- */}
      <section className="returns section">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Announcements</p>
            <h2 className="section-title">They will return</h2>
            <p className="lead">Character return reveals for Avengers: Doomsday.</p>
          </Reveal>

          <Reveal stagger className="returns__grid" amount={0.1}>
            {HOME_CONFIG.characterReturns.map((clip) => (
              <RevealItem key={clip.id}>
                <LiteYouTube id={clip.id} title={clip.title} />
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <PhaseRail />

      {/* ---------- Posters ---------- */}
      <section className="posters on-paper section">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Key art</p>
            <h2 className="section-title">Posters</h2>
          </Reveal>

          <Reveal stagger className="posters__grid" amount={0.1}>
            {HOME_CONFIG.posters.map((poster) => (
              <RevealItem key={poster.id}>
                <TiltPoster poster={poster} onOpen={setActivePoster} />
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta">
        <div className="container cta__inner">
          <Reveal>
            <p className="eyebrow">Your progress</p>
            <h2 className="cta__title">
              {ARCHIVE_STATS.total} titles.
              <br />
              One checklist.
            </h2>
            <p className="lead">
              Track everything you have watched across the MCU, the Defenders Saga, the Fox mutants,
              Sony&rsquo;s Spider-Man universe and the legacy films. Saved to this device
              automatically.
            </p>
            <div className="cta__actions">
              <Link to="/timeline" className="btn btn-primary btn-sheen">
                Start tracking
                <FaArrowRight aria-hidden="true" />
              </Link>
              <Link to="/browse" className="btn btn-ghost btn-sheen">
                Browse the archive
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__top">
            <Link to="/" className="footer__brand">
              The <em>Sacred</em> Timeline
            </Link>
            <nav className="footer__nav" aria-label="Footer">
              <Link to="/browse">Archive</Link>
              <Link to="/timeline">Timeline</Link>
              <a href="https://www.marvel.com" target="_blank" rel="noopener noreferrer">
                Marvel.com ↗
              </a>
            </nav>
            <div className="footer__socials">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Marvel on ${name}`}
                  title={name}
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <hr className="rule" />

          <div className="footer__bottom">
            <p>
              Engineered by <span>Naveed Ahmed</span>
            </p>
            <a href="mailto:iamnaveed.cs@gmail.com">iamnaveed.cs@gmail.com</a>
            <p className="footer__legal">
              A fan-made reference project. Not affiliated with Marvel Studios or The Walt Disney
              Company.
            </p>
          </div>
        </div>
      </footer>

      {/* ---------- Poster lightbox ---------- */}
      <AnimatePresence>
        {activePoster && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActivePoster(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activePoster.title}
          >
            <motion.div
              className="lightbox__panel"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="lightbox__close"
                onClick={() => setActivePoster(null)}
                aria-label="Close"
                autoFocus
              >
                <FaXmark />
              </button>
              <Img
                src={activePoster.url}
                alt={activePoster.title}
                sizes={SIZES.lightbox}
                priority
                className="lightbox__img"
              />
              <a href={activePoster.url} download className="btn btn-primary btn-sheen lightbox__dl">
                <FaDownload aria-hidden="true" />
                Download
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Home;
