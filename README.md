<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:050507,50:CC0000,100:050507&height=220&section=header&text=The%20Sacred%20Timeline&fontSize=64&fontColor=ffffff&fontAlignY=34&desc=108%20titles.%20Five%20continuities.%20Zero%20chill.&descAlignY=56&descSize=18&animation=fadeIn" width="100%" alt="The Sacred Timeline" />

<img src="https://readme-typing-svg.demolab.com?font=Bebas+Neue&size=34&duration=2600&pause=700&color=E8191F&center=true&vCenter=true&width=820&height=60&lines=Nobody+asked+for+this.;I+built+it+anyway.;It+scores+really+well+on+Lighthouse.;Marvel's+lawyers%2C+please+scroll+down." alt="Typing intro" />

<br /><br />

<a href="https://www.marvel.com"><img src="https://upload.wikimedia.org/wikipedia/commons/1/10/Marvel_Studios_2016_logo.svg" alt="Marvel Studios" height="58" /></a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://www.disneyplus.com"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" alt="Disney+" height="48" /></a>

<br /><br />

<img src="https://img.shields.io/badge/STATUS-100%25%20UNOFFICIAL-CC0000?style=for-the-badge&labelColor=050507" alt="Unofficial" />
<img src="https://img.shields.io/badge/AFFILIATION-ABSOLUTELY%20NONE-050507?style=for-the-badge" alt="No affiliation" />
<img src="https://img.shields.io/badge/VIBES-IMMACULATE-E8191F?style=for-the-badge&labelColor=050507" alt="Vibes" />

<br />

<img src="https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 18" />
<img src="https://img.shields.io/badge/Vite-5-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E" alt="Vite 5" />
<img src="https://img.shields.io/badge/Framer_Motion-11-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion 11" />
<img src="https://img.shields.io/badge/Lenis-smooth_af-050507?style=flat-square" alt="Lenis" />
<img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />

<br /><br />

<img src="https://media.giphy.com/media/xT9IgusfDcqpPFzO0g/giphy.gif" width="100%" height="220" style="object-fit:cover;border-radius:14px" alt="Avengers assemble" />

</div>

---

## ⚠️ Hold up — the TVA would like a word

> ### **THIS IS AN UNOFFICIAL FAN PROJECT.**
>
> Not made by Marvel. Not endorsed by Marvel. Not approved by Marvel. Kevin Feige has never heard
> of me and that is probably for the best.
>
> Every character, title, logo, poster and trademark belongs to **Marvel Studios / The Walt Disney
> Company**. I own exactly two things here: the CSS and the bad jokes.
>
> No money is made from this. Nothing is hosted here that isn't already public. If you're from
> Marvel Legal and something bothers you — open an issue and I'll take it down faster than the
> Flagsmashers' character arc. 🫡

<div align="center">
  <img src="https://img.shields.io/badge/⚖️_TL;DR-It's_fan_art_with_a_build_step-CC0000?style=for-the-badge&labelColor=050507" alt="TLDR" />
</div>

---

## 🌌 So what is this thing

Two websites wearing a trench coat:

1. **A ridiculously over-produced landing page** for *Avengers: Doomsday* — parallax hero, live
   countdown, trailers, key art, the works.
2. **An actual useful MCU archive** — 108 titles across five continuities, filterable six ways from
   Sunday, with a watch tracker that remembers what you've seen.

No backend. No API keys. No account. No cookie banner begging for your soul. Your watch progress
lives in `localStorage`, which means it's on your machine and I genuinely cannot see it.

<div align="center">
  <img src="https://media.giphy.com/media/3oxHQpJKuzIN86K5Vu/giphy.gif" width="49%" style="border-radius:12px" alt="Hulk smash" />
  <img src="https://media.giphy.com/media/1lk1IcVgqPLkA/giphy.gif" width="49%" style="border-radius:12px" alt="Iron Man" />
</div>

---

## ✨ Features (a.k.a. the Infinity Stones)

| 💎 | Stone | What it actually does |
| :-: | :-- | :-- |
| 🟣 | **Power** | 108 entries with year, format, phase, saga, and both release *and* in-universe chronological positions. Yes, I ordered all of them. Yes, it took a while. |
| 🔵 | **Space** | Filters are encoded in the URL. `?saga=mutant&status=unwatched` is a real link you can send to a friend to prove they haven't seen *Logan*. |
| 🔴 | **Reality** | Toggle any group between **release order** and **chronological order**. Watch *The First Avenger* first like a functional adult. |
| 🟠 | **Soul** | Watch tracker with per-group progress, mark-a-whole-group, reset, and cross-tab sync. It costs you no beloved family member. |
| 🟡 | **Mind** | Hit <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd> (or just <kbd>/</kbd>) for fuzzy search over every title and synopsis. Fully keyboard-driven, because mice are for cowards. |
| 🟢 | **Time** | Every title gets its own page at `/entry/:id`, and the ← → arrow keys walk you through the timeline like you're scrubbing reality itself. |

---

## ⚡ Performance (or: why this doesn't chug)

I got a little obsessed. Sorry not sorry.

```
🎬  YouTube embeds on the home page ......... 6
📦  YouTube iframes actually loaded ......... 0
💾  Player JavaScript deferred .............. ~6 MB
🖼️  Source images ............................ 5.9 MB
🪶  Images actually downloaded ............... 163 KB
🚀  First-load JS (gzipped) ................. ~119 KB
🎨  First-load CSS (gzipped) ................ ~7 KB
🖥️  Console errors ........................... 0
```

- **YouTube facades.** Six videos on the home page load **zero** iframes until you click one. A
  thumbnail stands in and the connection pre-warms on hover, so it still feels instant. Six real
  embeds would've been ~6MB of player JS. Absolutely not.
- **No `background-attachment: fixed`.** That one line was the entire reason the old hero stuttered.
  Parallax now rides `transform`/`scale` on the compositor and never re-renders React.
- **Code split to death.** Route-level splitting plus vendor chunks, so editing a page doesn't
  invalidate 160KB of cached React. Fuse.js loads only when you open search — warmed at idle so you
  never feel it.
- **`prefers-reduced-motion` is respected everywhere.** Ask your OS for less motion and Lenis
  doesn't even boot up. No arguments, no "are you sure".
- **Every image is responsive AVIF.** The hero wallpapers ship as 3840×2160 masters (1.2–2.2 MB
  each). A build step slices them into AVIF/WebP/JPEG at six widths, so a phone pulls **8 KB**
  instead of 1.25 MB for the same hero. Posters that render at 300px stopped downloading at 2560px.
- **Zero layout shift.** Every image carries real width/height, aspect-ratio boxes everywhere,
  responsive AVIF preload for the LCP element, preconnected fonts.
- **Vercel headers that mean it.** Hashed bundles and generated images get
  `immutable, max-age=31536000`; `index.html` gets `must-revalidate` so deploys land instantly.
  Plus `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` and HSTS.

<div align="center">
  <img src="https://img.shields.io/badge/60-FPS_OR_DEATH-E8191F?style=for-the-badge&labelColor=050507" alt="60fps" />
</div>

---

## ♿ Accessibility (not optional, not a checkbox)

Skip link. One `<h1>` per page. Real `<main>` landmark. All 108 watch toggles are genuine
`role="checkbox"` with `aria-checked` — not divs cosplaying as buttons. Filters use `aria-pressed`.
Every icon-only button is labelled. Focus rings are visible and stay visible. The command palette
runs entirely on arrows / enter / escape.

You can drive this whole site without ever touching a mouse. Try it. It's weirdly satisfying.

---

## 🚀 Getting started

Nick Fury's onboarding is four commands long.

```bash
git clone <this-repo>
cd mcu-sacred-timeline
npm install
npm run dev          # 👉 http://localhost:5173
```

Other spells:

```bash
npm run build                     # production build → dist/
npm run preview                   # serve the built output (test THIS, not just dev)
npm run images                    # force-rebuild every image derivative
npm run build -- --mode analyze   # + dist/stats.html bundle treemap for the nerds
```

> 🖼️ `dev` and `build` both auto-run the image pipeline first. Drop a new JPEG into
> `public/assets/` and it gets sliced into AVIF/WebP/JPEG at six widths automatically —
> no manual step, no committing 11 MB of derivatives.

Requires **Node 18+**. If it doesn't work, it's Loki. It's always Loki.

---

## 🗂️ Where everything lives

```
scripts/
  optimize-images.mjs     🖼️ Slices masters into responsive AVIF/WebP/JPEG
src/
  App.jsx                 Router, providers, global ⌘K shortcut
  index.css               Reset, base styles, shared UI atoms
  styles/tokens.css       🎨 ALL design tokens — colour, type, space, motion
  lib/motion.js           Shared Framer Motion variants
  config/siteConfig.jsx   📝 ALL editable copy — start here
  data/mcuData.js         🗃️ The dataset — one object per title
  context/WatchContext    localStorage watch state
  components/             NavBar · CommandPalette · LiteYouTube · EntryCard · Reveal · SmoothScroll
  pages/                  Home · Browse · Timeline · EntryDetail · NotFound
```

**Two files do 90% of the work:**

- `config/siteConfig.jsx` — hero text, wallpapers, trailer YouTube IDs, posters, social links.
- `data/mcuData.js` — every title in the archive.

Change those and the whole site follows. No component surgery required.

---

## 🧬 Adding a title to the archive

Drop an object into the right group array in `src/data/mcuData.js`:

```js
{
  id: 'unique-slug',
  title: 'Avengers: Yet Another One',
  type: 'Movie',            // Movie | Series | Special | Animated
  year: 2029,
  phase: 7,                 // null if it's not Main MCU
  chrono: 61,               // where it lands in-universe
  status: 'upcoming',       // omit if it's actually out
  synopsis: 'They fight a guy. It goes fine, mostly.',
}
```

That's it. The grid, filters, counts, search index, timeline, progress maths and detail page all
pick it up automatically. No registration, no barrel file, no ritual sacrifice.

---

## ☁️ Deployment

Push to GitHub → import into Vercel → framework preset **Vite** → Deploy. Done.

`vercel.json` does the rest: SPA rewrites so hard-refreshing `/timeline` doesn't 404 like it's 2013,
year-long immutable caching on everything content-hashed, `must-revalidate` on `index.html`, and a
set of security headers so the Lighthouse best-practices score stops nagging.

The image pipeline runs on Vercel automatically via the `prebuild` hook, so derivatives never touch
the repo.

---

## 🎭 Legal-ish, one more time for the people in the back

<div align="center">

### 🚨 **UNOFFICIAL. FAN-MADE. NOT AFFILIATED WITH MARVEL OR DISNEY.** 🚨

</div>

Marvel, Marvel Studios, the Marvel logo, Disney+, all characters, titles, posters, trailers and
related marks are trademarks of **MARVEL** and/or **The Walt Disney Company**, used here purely for
identification and commentary in a non-commercial fan project. All rights belong to their owners.

The **code** is MIT. The **universe** very much isn't.

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Bebas+Neue&size=30&duration=3200&pause=900&color=E8191F&center=true&vCenter=true&width=760&height=52&lines=%22I+am+Iron+Man.%22;%E2%80%94+a+guy+who+definitely+did+not+write+this+README" alt="I am Iron Man" />

<br />

**Engineered by Naveed Ahmed**
<br />
<a href="mailto:iamnaveed.cs@gmail.com"><img src="https://img.shields.io/badge/iamnaveed.cs@gmail.com-CC0000?style=for-the-badge&logo=gmail&logoColor=white&labelColor=050507" alt="Email" /></a>

<br /><br />

<sub>⭐ Star it if the countdown gave you existential dread about how far away December 2026 is.</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:050507,50:CC0000,100:050507&height=120&section=footer" width="100%" alt="" />

</div>
