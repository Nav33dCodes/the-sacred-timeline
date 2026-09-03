import { forwardRef } from 'react';
import { getImage, SIZES } from '../lib/images';

/**
 * Responsive <picture> that serves AVIF → WebP → JPEG and lets the browser pick
 * a width. Falls back to a plain <img> for any image that has not been through
 * scripts/optimize-images.mjs yet.
 *
 * `className` always lands on the <img> (so styling works identically whether or
 * not the image has derivatives). Style the wrapper with `pictureClassName`, or
 * with a `.parent picture` selector.
 *
 * Always emits width/height so nothing shifts as the image loads.
 */
const Img = forwardRef(function Img(
  {
    src,
    alt = '',
    sizes = SIZES.full,
    priority = false,
    className,
    pictureClassName,
    ...rest
  },
  ref,
) {
  const data = getImage(src);

  const imgProps = {
    alt,
    className,
    decoding: 'async',
    // The LCP image must not be lazy, and should outrank everything else.
    loading: priority ? 'eager' : 'lazy',
    fetchpriority: priority ? 'high' : undefined,
    ...rest,
  };

  if (!data) {
    return <img ref={ref} src={src} {...imgProps} />;
  }

  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={data.sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={data.sources.webp} sizes={sizes} />
      <img
        ref={ref}
        src={data.fallback}
        srcSet={data.sources.jpg}
        sizes={sizes}
        width={data.width}
        height={data.height}
        {...imgProps}
      />
    </picture>
  );
});

export default Img;
