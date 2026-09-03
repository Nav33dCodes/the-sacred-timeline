import manifest from '../data/imageManifest.json';

/**
 * Look up the responsive derivatives for a master image path.
 *
 * Returns null when the image hasn't been processed yet (someone dropped a new
 * file into public/assets/ without running `node scripts/optimize-images.mjs`),
 * so every consumer can fall back to the plain <img src> and still render.
 */
export const getImage = (src) => manifest[src] ?? null;

/** Common `sizes` values, kept here so they stay consistent across pages. */
export const SIZES = {
  full: '100vw',
  poster: '(max-width: 620px) 88vw, (max-width: 1100px) 44vw, 300px',
  overview: '(max-width: 900px) 340px, 38vw',
  lightbox: '(max-width: 700px) 92vw, 620px',
};

// 1x1 AVIF used to feature-detect support, so warm-up requests fetch the same
// format the <picture> will actually render. Preloading WebP while the browser
// renders AVIF would download every wallpaper twice.
const AVIF_PROBE = 'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAABwAAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAkbWRhdBIACgc4AAaQENBpMg8f8mKE4AAWAACQNY48ftw=';

let avifSupport = null;

export const supportsAvif = () => {
  if (avifSupport) return avifSupport;
  avifSupport = new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => resolve(probe.width === 1);
    probe.onerror = () => resolve(false);
    probe.src = AVIF_PROBE;
  });
  return avifSupport;
};

/** Warm the browser cache for an image it is about to crossfade to. */
export const preloadImage = (src, sizes = SIZES.full) => {
  const data = getImage(src);
  if (!data) return;
  supportsAvif().then((avif) => {
    const img = new Image();
    img.sizes = sizes;
    img.srcset = avif ? data.sources.avif : data.sources.webp;
    img.src = data.fallback;
  });
};
