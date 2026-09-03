# CLAUDE.md

Guidance for Claude Code when working in this repository.

---

## 1. Project

**The Sacred Timeline** — a client-side React SPA that is two things at once:

1. A **cinematic promo page** for *Avengers: Doomsday* (parallax hero, live countdown, trailers, key art).
2. An **MCU reference archive** — 104 titles across five continuities, filterable, searchable, with a
   persistent watch-order tracker.

No backend. No API. No auth. All data is static and bundled; all user state lives in `localStorage`.
Deployed to **Vercel** as a static SPA (`vercel.json` rewrites everything to `/index.html`).

---

## 2. Owner's directive (read this first)

> The owner wants a **high-performance, buttery-smooth-UX React frontend**. Adding libraries is
> explicitly encouraged if they make the site better. The mandate is a **full redesign / next-level
> upgrade**, not incremental patching.

Judge every change against:

- **Feel** — 60fps scroll and animation, no layout shift, no jank, instant-feeling navigation.
- **Polish** — this should read as a premium streaming-service product, not a student project.
- **Boldness over caution** — prefer a real redesign to a timid tweak. Rewriting a component
  wholesale is acceptable and often preferred.
- **Never trade correctness or accessibility for flash.** Motion respects `prefers-reduced-motion`;
  everything stays keyboard-operable.

Do not ask permission to modernise. Do ask before deleting user-facing content or data.

---

## 3. Stack

| Layer | Choice |
| --- | --- |
| Framework | React 18 (function components + hooks only) |
| Build | Vite 5 (ESM, `"type": "module"`) |
| Routing | React Router v6 — `BrowserRouter`, lazy routes, URL-encoded filter state |
| Animation | Framer Motion 11 |
| Smooth scroll | Lenis 1.3 |
| Search | Fuse.js 7 |
| Icons | `react-icons/fa6` |
| Styling | Hand-written CSS with custom properties (see section 5) |
| Hosting | Vercel (static) |

```bash
npm run dev                      # http://localhost:5173
npm run build                    # dist/
npm run preview                  # serve the built output
npm run build -- --mode analyze  # + dist/stats.html bundle treemap
```

No TypeScript, no test runner, no linter. There is **no `.git` directory** — this is an unversioned
working copy, so be careful with destructive edits.

---

## 4. Layout

```
index.html              Meta + OG tags, font preconnect, LCP image preload, anti-FOUC background
vite.config.js          React plugin, es2020 target, manualChunks (react/motion/search), analyze mode
vercel.json             SPA rewrite: /(.*) -> /index.html
public/assets/          7 Doomsday teaser JPGs
src/
  main.jsx              createRoot + StrictMode
  App.jsx               BrowserRouter > WatchProvider > SmoothScroll > Shell.
                        Lazy routes, global Cmd/Ctrl+K and "/" shortcuts, skip link, ErrorBoundary.
  index.css             @import tokens, reset, base, shared atoms (.btn .badge .container .eyebrow…)
  styles/tokens.css     ALL design tokens. The single source of truth for colour/type/space/motion.
  lib/motion.js         Shared Framer variants: rise, fade, stagger(), charRise, panel, viewportOnce
  config/siteConfig.jsx Editable copy: wallpapers, YouTube IDs, posters, hero text, social links
  data/mcuData.js       The dataset + SAGAS, PHASES, TYPES, entries, entryById, ARCHIVE_STATS
  context/WatchContext  localStorage watch state (key `mcu_watched`) + cross-tab sync
  components/
    NavBar.jsx/.css       Scroll-aware glass nav, shared-layout active pill, scroll-progress bar,
                          search trigger, watch-percentage chip, mobile sheet
    CommandPalette.jsx/.css  Cmd+K fuzzy search over every entry, fully keyboard-driven
    LiteYouTube.jsx/.css     YouTube facade — thumbnail now, iframe only on click
    EntryCard.jsx/.css       Archive grid card (memoised) + the `.entry-grid` class
    Reveal.jsx               <Reveal> / <RevealItem> scroll-reveal wrappers
    SmoothScroll.jsx         Lenis provider + useSmoothScroll() { lenis, lock, unlock, scrollTo }
    PageTransition.jsx       Route enter/exit wrapper
    ScrollToTop.jsx          Scroll reset on navigation, routed through Lenis
    ErrorBoundary.jsx        Class boundary around the route outlet
  pages/
    Home.jsx/.css         Hero, stat strip, overview, trailers, returns, phase rail, posters, CTA, footer
    Browse.jsx/.css       Archive grid, URL-synced filters/sort, text filter
    Timeline.jsx/.css     Watch order: progress ring, release/chronological toggle, collapsible groups
    EntryDetail.jsx/.css  /entry/:id — facts, watch toggle, prev/next with arrow-key nav
    NotFound.jsx          404
```

### Routes

`/` · `/browse` (accepts `?saga= &type= &phase= &status= &sort=`) · `/timeline` ·
`/watch-order` (legacy alias for `/timeline`) · `/entry/:id` · `*` → 404

### Content editing

`src/config/siteConfig.jsx` is deliberately the single place to change hero copy, wallpapers,
trailer/clip YouTube IDs, posters and social links. Keep it that way — do not inline content strings
into components.

---

## 5. Design system

**All tokens live in `src/styles/tokens.css`.** Components reference the semantic aliases; never
hardcode a hex, a font stack, a duration or an easing curve in a component stylesheet.

- **Palette** — black / white / Marvel red. Raw ramp (`--ink-900…400`, `--red-600…300`, `--paper`)
  plus semantics (`--bg-primary`, `--text-main`, `--text-muted`, `--accent`, `--border`, …).
- **Type** — `--font-display` (Bebas Neue), `--font-body` (Inter), `--font-mono` (IBM Plex Mono).
  Fluid scale `--step--2` … `--step-7`, all `clamp()`. Do not write raw `rem` font sizes.
- **Space / radii / shadow / motion** — `--space-1…10`, `--r-xs…full`, `--shadow-sm…xl`,
  `--ease-out`, `--dur-fast|base|slow`, plus `--z-*` for stacking.

The app is **dark-only by design**. Sections that need the white Marvel.com register add the
`.on-paper` class, which re-points the semantic tokens for that subtree. That is the only theming
mechanism — there is no light/dark toggle and there should not be one unless asked.

Both visual registers are intentional: black cinematic sections (hero, trailers, returns, phases)
alternating with white paper sections (overview, posters). Preserve that contrast.

---

## 6. Performance rules

These are load-bearing. The site was explicitly rebuilt around them — do not regress them.

- **Never use `background-attachment: fixed`.** It forces full-page repaints. Hero parallax is done
  with `useScroll` + `useTransform` on `y`/`scale`, which stays on the compositor and never
  re-renders React.
- **Animate only `transform` and `opacity`.** Never animate `width`, `height`, `top`, `left`,
  `box-shadow`, or `filter` in a scroll-linked or looping animation.
- **Never mount a YouTube `<iframe>` directly.** Use `<LiteYouTube>`. Six embeds on the home page
  currently load zero iframes until clicked; a raw iframe would add ~1.2MB of player JS each.
- **Read scroll through motion values, not state.** `useMotionValueEvent` + a bail-out comparison,
  as in `NavBar`. Never `useState` on every scroll frame.
- **No layout animations on long lists.** `Browse` renders 100+ cards; it uses opacity/scale only.
  Adding Framer `layout` to those items is the fastest way to drop frames here.
- **Every animation needs a `prefers-reduced-motion` escape.** `index.css` has a global kill switch,
  and `SmoothScroll` does not start Lenis at all when reduced motion is requested.
- **Images**: `loading="lazy"` + `decoding="async"` below the fold, and an `aspect-ratio` box so
  nothing shifts. The first hero wallpaper is preloaded in `index.html` as the LCP element.
- **Scroll locking** goes through `useSmoothScroll().lock()/unlock()` (ref-counted), never
  `body { overflow: hidden }`.

---

## 7. Conventions

- Function components named to match their file; default export at the bottom.
- Pages are wrapped in `<PageTransition>` so `AnimatePresence` in `App.jsx` can animate exits.
- New routes are `lazy()`-loaded in `App.jsx`; the shared `<Suspense>` fallback is `RouteLoader`.
- Page-scoped CSS sits beside its component; tokens and shared atoms stay in `styles/`+`index.css`.
  Prefer CSS classes over inline styles, and CSS `:hover` over JS mouse handlers.
- BEM-ish class naming scoped by block (`.ecard__title`, `.tgroup__list`, `.cmdk__row`).
- Filter and view state that a user might want to share belongs in the URL (`useSearchParams`),
  not in component state.
- Interactive controls need real semantics: `role="checkbox"` + `aria-checked` for toggles,
  `aria-pressed` for filters, `aria-label` on icon-only buttons.
- All external links: `target="_blank" rel="noopener noreferrer"`.

---

## 8. Data

`src/data/mcuData.js` is the whole content model. Each entry:

```js
{ id, title, type, year, phase, chrono, status?, synopsis }
// type: 'Movie' | 'Series' | 'Special' | 'Animated'
// phase: 1-6 for the Main MCU, null elsewhere
// chrono: in-universe position within its group
// status: 'upcoming' (omit for released)
```

`decorate()` adds `group`, `saga` and `release` (array position) automatically. Appending an entry
to a group array is enough — the grid, filters, counts, search index, timeline and detail page all
derive from `entries` / `entryById` / `ARCHIVE_STATS`.

---

## 9. Adding a library

Encouraged, with two rules: it must earn its bundle cost, and it must land in `package.json` in the
same change that imports it. Prefer small, tree-shakeable, actively maintained packages. Add heavy
vendors to `manualChunks` in `vite.config.js`, and check `npm run build -- --mode analyze` after
anything non-trivial.

---

## 10. Verifying a change

There are no tests. The loop is:

```bash
npm run build     # must succeed with no unresolved imports
npm run preview   # verify the built output, not just dev
```

Then confirm by hand: home page scrolls smoothly, no console output at all (the current baseline is
zero errors and zero React warnings), no layout shift on load, watch progress survives a reload,
`/browse?saga=mutant` pre-selects its filter, the timeline's chronological toggle reorders correctly,
Cmd/Ctrl+K opens the palette and arrow keys drive it, the mobile sheet works under 860px, and tab
order is sane.
