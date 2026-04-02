# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Mondrian/De Stijl-inspired interactive portfolio built with React. The site features a unique navigation experience based on Piet Mondrian's artwork, with a Piet esoteric programming language "Hello World" grid as the entry point.

**Live URL**: https://parth-panchal.github.io

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:3000)
npm start

# Build for production
npm build

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Three-View System

The application has three distinct views with URL-based navigation:

1. **Art View** (`/`) - Pure Piet grid artwork as landing page
   - 13x13 grid based on Thomas Schoch's Piet "Hello World"
   - Center cell is clickable and navigates to Portfolio View
   - Implemented in `src/components/ArtView.js`

2. **Portfolio View** (`/portfolio`) - Mondrian-style grid navigation
   - Six interactive tiles for different sections
   - Three decorative color tiles (red, blue, yellow)
   - Implemented in `src/components/PortfolioView.js`

3. **Section Views** (`/:section`) - Individual content pages
   - Dynamic routes for: about, projects, skills, experience, contact, misc
   - Implemented in `src/components/SectionView.js`

### Routing Structure

React Router is used for URL navigation with `AnimatePresence` for page transitions:

```javascript
/ (ROUTES.HOME) → ArtView
/portfolio (ROUTES.PORTFOLIO) → PortfolioView
/:section → SectionView (where section = about|projects|skills|experience|contact|misc)
```

Routes are defined in `src/constants/routes.js`.

### Key Components

- **PietGrid** (`src/components/PietGrid.js`)
  - Renders the 13x13 Piet artwork grid
  - Uses `React.memo` for performance optimization
  - Color grid data is in `src/constants/pietData.js` (PIET_COLOR_GRID constant)
  - Staggered animations based on color groups

- **BlobityProvider** (`src/components/BlobityProvider.js`)
  - Dynamic cursor effects using the Blobity library
  - Adapts cursor color based on element background colors
  - Different configs for Art View (white cursor) vs Portfolio View (black cursor)
  - Includes cleanup logic to prevent memory leaks
  - Only initializes on non-mobile devices

- **MondrianTile** (`src/components/MondrianTile.js`)
  - Individual tiles in the Portfolio View
  - Configured via TILE_CONFIGS in `src/constants/config.js`
  - Each tile has specific animation direction and delay

- **Navigation** (`src/components/Navigation.js`)
  - Persistent navigation bar across all views
  - Shows/hides based on current route

### Configuration System

All magic numbers and configuration values are centralized in `src/constants/config.js`:

- `GRID_CONFIG` - Grid dimensions and center cell coordinates
- `ANIMATION` - Animation durations, stagger delays, easing
- `TILE_CONFIGS` - Mondrian tile configurations with titles, descriptions, animation settings
- `BLOBITY_CONFIG` - Cursor effect settings for both views
- `CURSOR_COLORS` - RGB/hex color mappings for cursor

The Piet color grid is a 169-element 2D array representing the exact "Hello World" program.

### Styling

- Uses CSS Grid for layouts (`App.css`)
- Tailwind CSS is installed but minimal usage (custom CSS preferred for artistic control)
- Framer Motion for all animations (page transitions, tile animations, grid cell animations)
- Color palette follows De Stijl movement (primary colors + black/white)

### State Management

No global state management library. The app uses:
- React Router's location state for navigation
- Component-level state where needed
- URL as single source of truth for current view

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
- Centralized component exports via `src/components/index.js`
- Constants use named exports
- PropTypes are not used (prefer JSDoc comments for documentation)
- ErrorBoundary wraps the entire app for graceful error handling
- React.StrictMode is enabled in development

## Animation System

Framer Motion animations use:
- Staggered animations for visual polish (tiles appear sequentially)
- Color-based grouping for PietGrid (cells of same color animate together)
- Directional animations for Mondrian tiles (x, y, scale, opacity variations)
- Hover/tap interactions on all interactive elements

Timing values are in `ANIMATION` config - adjust there to change animation feel globally.
