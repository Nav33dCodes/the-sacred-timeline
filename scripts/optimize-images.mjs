/**
 * Responsive image pipeline.
 *
 * Reads every image in public/assets/ (the masters, kept untouched) and emits
 * AVIF + WebP + JPEG derivatives at a ladder of widths into public/assets/derived/,
 * plus src/data/imageManifest.json describing what exists.
 *
 * Idempotent: a derivative is only rebuilt when its master is newer, so the
 * prebuild/predev hooks cost ~nothing after the first run.
 *
 *   node scripts/optimize-images.mjs          # incremental
 *   node scripts/optimize-images.mjs --force  # rebuild everything
 */
import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'public/assets';
const OUT_DIR = 'public/assets/derived';
const MANIFEST = 'src/data/imageManifest.json';

// Never upscale: widths at or above the master's own width are skipped.
const WIDTHS = [480, 768, 1080, 1440, 1920, 2560];

const FORMATS = [
  { ext: 'avif', options: { quality: 46, effort: 4 } },
  { ext: 'webp', options: { quality: 74, effort: 4 } },
  { ext: 'jpg', options: { quality: 78, mozjpeg: true } },
];

const force = process.argv.includes('--force');
const isImage = (f) => /\.(jpe?g|png)$/i.test(f);

const bytes = (n) => `${(n / 1024).toFixed(0)} KB`;

async function newerThan(target, source) {
  if (force || !existsSync(target)) return true;
  const [t, s] = await Promise.all([stat(target), stat(source)]);
  return s.mtimeMs > t.mtimeMs;
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(SRC_DIR)).filter(isImage);
  const manifest = {};
  let built = 0;
  let savedFrom = 0;
  let savedTo = 0;

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const base = path.parse(file).name;
    const image = sharp(srcPath);
    const { width: srcWidth, height: srcHeight } = await image.metadata();

    const widths = WIDTHS.filter((w) => w < srcWidth);
    // Always include the master's own width so the largest screens stay sharp.
    if (!widths.includes(srcWidth)) widths.push(srcWidth);

    const entry = {
      width: srcWidth,
      height: srcHeight,
      aspectRatio: +(srcWidth / srcHeight).toFixed(4),
      fallback: `/assets/${file}`,
      sources: {},
    };

    for (const { ext, options } of FORMATS) {
      const srcset = [];

      for (const w of widths) {
        const outName = `${base}-${w}.${ext}`;
        const outPath = path.join(OUT_DIR, outName);

        if (await newerThan(outPath, srcPath)) {
          await sharp(srcPath)
            .resize({ width: w, withoutEnlargement: true })
            [ext === 'jpg' ? 'jpeg' : ext](options)
            .toFile(outPath);
          built += 1;
        }
        srcset.push(`/assets/derived/${outName} ${w}w`);
      }

      entry.sources[ext] = srcset.join(', ');
    }

    // Widest JPEG becomes the <img src> fallback for very old browsers.
    const widest = widths[widths.length - 1];
    entry.fallback = `/assets/derived/${base}-${widest}.jpg`;

    manifest[`/assets/${file}`] = entry;

    const masterSize = (await stat(srcPath)).size;
    const derivedSize = (await stat(path.join(OUT_DIR, `${base}-${widest}.avif`))).size;
    savedFrom += masterSize;
    savedTo += derivedSize;
    console.log(
      `  ${file.padEnd(34)} ${String(srcWidth).padStart(4)}px  ` +
        `${bytes(masterSize).padStart(8)} → ${bytes(derivedSize).padStart(8)} avif @${widest}px`,
    );
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(
    `\n  ${built} derivative${built === 1 ? '' : 's'} written · ` +
      `largest-size total ${bytes(savedFrom)} → ${bytes(savedTo)} ` +
      `(${Math.round((1 - savedTo / savedFrom) * 100)}% smaller)\n`,
  );
}

run().catch((err) => {
  console.error('[optimize-images] failed:', err);
  process.exit(1);
});
