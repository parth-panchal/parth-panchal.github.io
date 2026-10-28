// Application Configuration Constants
// Centralizes all magic numbers, strings, and configuration values

// Grid Configuration
export const GRID_CONFIG = {
	SIZE: 13,
};

// Animation Configuration
export const ANIMATION = {
	COLOR_GROUP_STAGGER: 0.04, // Delay between each color group in PietGrid
	// Used whenever the composition re-proportions itself. A tween, not a
	// spring: overshoot makes layout animations look wobbly.
	LAYOUT_TRANSITION: { type: "tween", duration: 0.6, ease: [0.65, 0, 0.35, 1] },
	// /hello runs only when asked: slow enough at first to follow the pointer,
	// then accelerating (~6s for all 132 steps)
	PAINTING_PACE: (step) => Math.max(26, 190 * Math.pow(0.95, step)),
	STUDIO_PACE: (step) => Math.max(14, 90 * Math.pow(0.96, step)),
	// Hold on "Hello, world!" before the painting folds into Mondrian
	HALT_HOLD_MS: 900,
};

// De Stijl palette
export const DE_STIJL = {
	RED: "#E32017",
	BLUE: "#004B87",
	YELLOW: "#FFD100",
	PAPER: "#F4F1EA",
	INK: "#111111",
};

// Portfolio sections. Each one is a tile in the composition and a URL (/<id>).
export const SECTIONS = {
	ABOUT: "about",
	QUIZZING: "quizzing",
	PROJECTS: "projects",
	WRITING: "writing",
	FILMS: "films",
	PHOTOS: "photos",
	KIT: "kit",
	STUDIO: "studio",
	CONTACT: "contact",
	INSPIRATION: "inspiration",
};

/**
 * Mondrian composition.
 * Every name in `areas` must form a rectangle. Opening a section keeps the
 * same areas and only re-sizes the tracks, so every tile slides into place.
 * `variants` are fr weights for the resting composition; the first is the
 * default and clicking a plain colour block cycles through the rest. They are
 * hand-tuned (not random) so no tile ever gets too small for its label.
 */
export const COMPOSITION = {
	desktop: {
		areas: [
			"about    about    quizzing       photos   photos   block1",
			"about    about    writing   photos   photos   films",
			"projects studio   writing   kit     block2   films",
			"projects studio   inspiration contact contact block3",
		],
		variants: [
			{ cols: [1.3, 1, 1.05, 0.95, 0.75, 0.85], rows: [1.15, 1, 0.9, 0.6] },
			{ cols: [1, 0.85, 0.95, 1.25, 1, 1.05], rows: [1, 1.1, 1, 0.6] },
			{ cols: [1.45, 0.9, 0.85, 0.9, 0.7, 1], rows: [1.3, 0.85, 0.85, 0.6] },
			{ cols: [1.1, 1.15, 1.3, 0.8, 0.65, 0.8], rows: [1, 1.05, 1.05, 0.65] },
		],
	},
	// Colour blocks missing from a layout are simply not drawn
	mobile: {
		areas: [
			"about    about",
			"quizzing      photos",
			"writing  films",
			"projects studio",
			"kit     contact",
			"block1   inspiration",
		],
		variants: [
			{ cols: [1, 1], rows: [1.35, 1, 1, 1, 0.9, 0.75] },
			{ cols: [1.2, 0.85], rows: [1.3, 1.05, 1, 0.9, 0.95, 0.8] },
			{ cols: [0.8, 1.25], rows: [1.45, 0.9, 1.1, 1, 0.8, 0.75] },
			{ cols: [1.1, 0.95], rows: [1.35, 1, 0.9, 1.1, 0.9, 0.8] },
		],
	},
	// Size of a track squeezed to make room for an open section
	STRIP: "2.75rem",
	STRIP_MOBILE: "1.75rem",
	MOBILE_BREAKPOINT: 768,
};

// Decorative colour blocks, keyed by area name (clicking one re-composes the painting).
// Empty sections behave the same way until they have content.
export const COLOR_BLOCKS = {
	block1: DE_STIJL.RED,
	block2: DE_STIJL.YELLOW,
	block3: DE_STIJL.YELLOW,
};


