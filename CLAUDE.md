# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Mondrian/De Stijl-inspired personal site built with React. The home page is a Mondrian composition that holds every section. Its colours come from a Piet program (Thomas Schoch's "Hello, world!") that visitors can watch run at `/hello`, where it folds into the composition.

**Live URL**: https://parth-panchal.github.io

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:3000)
npm start

# Build for production
npm run build

# Build and serve the production version on localhost:4173. Judge speed and
# smoothness here: the dev server runs React in development mode and is slower
npm run preview

# Run tests
CI=true npx react-scripts test --watchAll=false

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Two Views

1. **Art View** (`/hello`) - `src/components/ArtView.js`. Not the home page: a deliberate detour linked from About and Inspiration, presented like a gallery label (title, credit, no name)
   - Thomas Schoch's 13x13 Piet "Hello, world!" (exact pixels, `src/constants/pietData.js`)
   - Nothing moves until the visitor presses Run (or Enter/Space, or clicks the painting). It then executes on the interpreter in `src/piet/` at `ANIMATION.PAINTING_PACE` (~6s), with the step-by-step readout (`PietReadout`)
   - When the program halts, the colours fold into De Stijl primaries (`toDeStijl` in `src/piet/palette.js`) and the page stays there, offering Run again. It never navigates on its own
   - "← Portfolio" and "How it works" are always visible (so there's a way back mid-run); Escape also returns to the portfolio

2. **Composition** (`/` and `/:section`) - `src/components/Composition.js`. The home page
   - The whole portfolio is one Mondrian built with CSS `grid-template-areas` (`COMPOSITION` in `config.js`)
   - Opening a section keeps the same areas and only resizes the grid tracks: the open tile's tracks keep their fr weight, the others shrink to strips. Framer Motion `layout` animates every tile
   - Track weights are normalised to sum to 1 (fr factors summing below 1 leave a gap at the edge)
   - Clicking a plain block (a `COLOR_BLOCKS` entry, or a section with no content yet) cycles through the hand-tuned `variants` of track weights ("re-compose"); the first variant is the default. While a section is open, a block closes it instead. Blocks missing from a layout are not drawn
   - Every area name must form a rectangle, in both desktop and mobile layouts
   - A section whose registry entry has `available: false` (no content yet) is drawn as a plain block and its URL redirects to `/`
   - The open tile's × only appears (and accepts clicks) once the tile has finished growing
   - Plain blocks squeeze into strips too, so their hover hint follows the shape (`Block` gets `is-narrow`/`is-short`): vertical in tall strips, just "×" in corner squares, two lines at rest
   - Tiles squeezed in both directions (corner squares) can't fit a word: they show a two-letter mark with the full name as a tooltip, and every open section has an index of the other sections under its heading (`.tile__index`), so every section is always reachable

### Routing Structure

```javascript
/hello (ROUTES.PAINTING) → ArtView
*                        → Composition (/ at rest, /<section> open; unknown paths, including the old /portfolio, redirect to /)
```

`App.js` renders `<Routes>` without exit animations: switching view cuts to the new one, which fades in with CSS. The composition stays mounted while you move between sections, so opening one animates inside it instead of remounting it. Section ids are `SECTIONS` in `config.js`; `isValidSection` is in `src/constants/routes.js`.

### Sections

`src/sections/index.js` (`SECTION_REGISTRY`) maps each section id to its title, blurb, tone, availability and component (plus optional `Preview`/`Backdrop` for the closed tile). Section components are `React.lazy` (each its own chunk, prefetched by `prefetchSections()` when the page is idle; the open tile wraps them in `Suspense`). Only About is eager, because its preview is the home page's headline. Availability, blurbs and the Photographs backdrop come from `src/sections/meta.js`, which reads only small data (`feeds-summary.json`, `photos.json`, `content.js`), so the full feeds stay out of the main bundle:

- **About** - introduction (`PROFILE.intro`: an opening line plus paragraphs that can link into sections) with an optional `PROFILE.portrait`; "Lately" (automatic cards for the latest post, last film and last pushed repo, from `LATELY` in `meta.js`, plus optional lines from `NOW`); interests; optional `PROFILE.timeline`; "Elsewhere" links. `AboutPreview` is the closed-tile content. There is no separate Now section: Lately replaced it
- **Quizzing** - `QUIZZING` in `content.js`: intro, highlights (timeline), favourite questions (reveal-the-answer cards) and projects. Each part appears once it has content
- **Photographs** - Mondrian gallery + lightbox from `src/data/photos.json`; newest photo is the closed tile's backdrop
- **Writing** - latest Substack posts from `src/data/feeds.json`
- **Films** - latest Letterboxd diary entries from `src/data/feeds.json`, led by the latest review in full
- **Projects** - public GitHub repos fetched live from the GitHub API, cached in sessionStorage
- **Kit** - `KIT` in `content.js`, photography first (Camera, Lenses, Editing), then Desk and This site; empty groups are hidden
- **Studio** - Piet sketchpad: paint codels, run them on the same interpreter. Sketch saved in localStorage
- **Contact** - `LINKS` from `meta.js` (`PROFILE.links` plus Substack/Letterboxd once configured); About's Elsewhere uses the same list
- **Inspiration** - Mondrian, the Piet language, Schoch's painting and a breakdown of the design system; figures are generated from the live palette/interpreter. Optional personal note: `INSPIRATION.note` in `content.js`

All personal content lives in `src/constants/content.js`.

### Build-time Data

Substack and Letterboxd RSS can't be fetched from the browser (no CORS), so `scripts/fetch-feeds.mjs` runs before `npm start` and `npm run build` (`prestart`/`prebuild`) and writes `src/data/` (gitignored):

- `feeds.json` - from the handles in `src/constants/feeds.json` (`substack`: publication URL or subdomain; `letterboxd`: username; `github`: `{ user, hidden }`, the repos left out of Projects and Lately). A failed fetch keeps the previous data. Only the Writing and Films chunks import it
- `feeds-summary.json` - the few fields the home page, About's Lately and Contact need (titles, links, counts, latest post/watch, latest pushed repo); imported by `sections/meta.js`
- `photos.json` - every JPEG/PNG/WebP in `public/photos/`, with dimensions read from the file headers; optional `public/photos/captions.json` maps file name → `{ caption, place, date }`

`.github/workflows/refresh.yml` rebuilds and publishes daily so new posts and watches appear without a manual deploy (runs from `main` only).

### Piet Interpreter

- `src/piet/interpreter.js` - pure implementation of the Piet spec (`createPiet` steps one colour block at a time; `runPiet` runs to completion). Accepts both C0 and B4 shades for light/dark colours
- `src/piet/usePietRunner.js` - hook that steps a program on a timer (pace function from `ANIMATION`) and exposes the active block, trail, stack and output
- `src/piet/interpreter.test.js` - asserts the landing painting prints `Hello, world!\n`. Run with `CI=true npx react-scripts test --watchAll=false`

### Key Components

- **PietGrid** - renders any Piet grid; optional active-block dimming, SVG pointer trail, colour remap (`colorFor`) and painting (`onPaint`)
- **PietReadout** - stdout, current op, DP/CC and stack
- **Cursor** - on mouse/trackpad devices the cursor is a dot with a soft halo, everywhere (no arrow, no hand). It's pure CSS (`App.css`, CURSOR): the halo is part of the cursor image, so macOS draws it with the pointer, with no lag and no per-frame page work. `--cursor` / `--cursor-hover` hold the images (32x32 max: Chromium hides bigger custom cursors near the window edges); clickable things get the bigger halo, dark areas redefine the variables to a paper-coloured halo, and light surfaces inside dark tiles switch back. Blobity (a JS canvas follower) was removed: anything the page draws trails the real pointer by a frame or two and looked choppy. The inheritance rule is scoped to `body` (a bare `*` makes `html` inherit `auto`). Touch devices keep their defaults

### Configuration System

All magic numbers and configuration values are centralized in `src/constants/config.js`:

- `GRID_CONFIG` - Piet grid size
- `ANIMATION` - durations, layout transition, label fade, interpreter pacing, halt/fold timings
- `DE_STIJL` - palette (mirrored as CSS variables in `App.css`)
- `SECTIONS`, `COMPOSITION`, `COLOR_BLOCKS` - the composition

### Styling

- Custom CSS in `App.css`, CSS Grid for every layout; the black `--line` gap is Mondrian's lines
- Fonts: Archivo (display: 400/700/800/900) and JetBrains Mono (400/700), loaded from Google Fonts in `public/index.html`. Request only weights the CSS uses; a missing weight silently renders as the nearest one
- Icons: `public/favicon.svg` (a small Mondrian) is the source; `favicon.ico`, `apple-touch-icon.png` and `logo192/512.png` are rendered from it
- Framer Motion for page transitions and the composition's layout animation, loaded lazily: `App.js` wraps everything in `LazyMotion` (features from `src/motionFeatures.js`, fetched after first paint) with `strict`, so components must use `m.*`, never `motion.*` (which would bundle all of Framer up front and throws in development)

### State Management

No global state management library. The URL is the single source of truth for which view and section is open; everything else is component state.

## GitHub Pages Deployment

This is a GitHub Pages site with:
- Homepage set to `https://parth-panchal.github.io` in package.json
- `.nojekyll` file in public/ to prevent Jekyll processing
- Custom 404.html that redirects to support client-side routing
- Build artifacts in the `build/` directory

When deploying:
1. `npm run build` creates optimized production build
2. `npm run deploy` uses gh-pages package to push build/ to gh-pages branch

## Code Patterns

- Components use default exports
- Centralized component exports via `src/components/index.js`, for the home page's components only: anything exported there lands in the main bundle. ArtView, PietGrid and PietReadout are imported directly (ArtView is lazy)
- Constants use named exports
- PropTypes are not used (prefer JSDoc comments for documentation)
- ErrorBoundary wraps the entire app for graceful error handling
- React.StrictMode is enabled in development

## Animation System

- Piet cells stagger in by colour group on load (CSS animation; cells are memoized plain divs)
- The interpreter pace starts slow and accelerates (`ANIMATION.PAINTING_PACE`)
- The fold is a CSS transition on cell colour and a `transform: scale` on the cells (thickens the lines without animating layout)
- Composition tiles use Framer Motion `layout` with `ANIMATION.LAYOUT_TRANSITION` (a tween; springs overshoot and look wobbly)
- The open tile's body also has `layout`, so Framer cancels the parent's scale: content keeps its size and is revealed rather than squashed
- Closed-tile labels are keyed by shape (full vs strip) so they remount and fade in (CSS, `.tile__label-inner`) instead of snapping
- Animate only `transform`/`opacity` (and colours); avoid width, height or gap transitions
- Tiles and colour blocks have `will-change: transform` and tiles `contain: layout paint`, so each is its own GPU layer. Without it, on Retina screens every animation frame re-rasterised the whole composition and hovering dropped about half the frames. Headless 1x testing doesn't show this; measure on a GPU at deviceScaleFactor 2
- `MotionConfig reducedMotion="user"` in `App.js` respects the OS reduced-motion setting

### Framer Motion gotchas (each caused a real bug)

- Never let an element with `layout` collapse to 0×0 (e.g. `display: none` on its only child). Framer divides by the box size and the projection gets stuck at `scale(0)`, hiding labels and section content from then on. Hide with `visibility` instead
- Don't let anything else write `transform` on layout-animated elements (the old Blobity cursor's `magnetic` option did, and corrupted the tiles)
- Put CSS transforms (like the strip label rotation) on a child of the element Framer animates, not the element itself
- Don't use Framer for opacity fades at all, in or out. When an opacity animation finishes, Framer hands off to an inline style and the element shows its starting value for one frame: fade-ins flashed invisible on every load, and route `exit` fades flashed the old view back on (the "refresh" when opening /hello). Appear-fades are CSS keyframes in `App.css` (FADE-INS) with `backwards` fill; views and the photo viewer leave instantly (no `AnimatePresence`). Framer is only used for the composition's layout animations
- The first time the browser draws a symbol missing from the web fonts (↗ ★ × …) it searches system fonts, a long layout that used to stall the first open of Kit. `src/fontWarmup.js` draws every symbol once while idle; add new symbols to its `GLYPHS`
- Don't rely on `onLayoutAnimationComplete` to know a tile has finished resizing: it fires immediately for an interrupted earlier animation (e.g. moving from one open section to another). The open tile's × is timed from `LAYOUT_TRANSITION.duration` and reset when the tile closes
- New `variants` must keep every label inside its tile at both breakpoints; recheck after changing them
- Tile text is sized for the tile's *smallest* size across all composition variants: `minShares()` in `Composition.js` sets `--fw`/`--fh` per tile, `.tile` turns them into `--min-w`/`--min-h` (container units of `.composition`), and closed labels get that fixed width. Re-composing then only moves text. Sizing text from the live tile (or `vw`) makes it overflow in narrow variants or snap to its new size on the first frame, before the tiles animate

Timing values are in `ANIMATION` config - adjust there to change animation feel globally.
