// Shared Framer Motion variants + easing.
// Everything here animates transform/opacity/filter only — never layout properties.

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

/** Standard "rise into view" used by <Reveal> and section headers. */
export const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Parent that staggers its children. */
export const stagger = (amount = 0.07, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: amount, delayChildren: delay } },
});

/** Per-character hero title reveal. */
export const charRise = {
  hidden: { opacity: 0, y: '55%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

/** Modal / overlay panel. */
export const panel = {
  hidden: { opacity: 0, scale: 0.96, y: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 32, mass: 0.7 },
  },
  exit: { opacity: 0, scale: 0.97, y: -8, transition: { duration: 0.16, ease: EASE_IN_OUT } },
};

/** Shared viewport config so every scroll reveal behaves identically. */
export const viewportOnce = { once: true, amount: 0.2, margin: '0px 0px -10% 0px' };
