// Application Configuration Constants
// Centralizes all magic numbers, strings, and configuration values

// Grid Configuration
export const GRID_CONFIG = {
	SIZE: 13,
	CENTER_ROW: 6,
	CENTER_COL: 6,
	VIEWPORT_SIZE: "min(90vw, 90vh)",
};

// Animation Configuration
export const ANIMATION = {
	DURATIONS: {
		FAST: 0.3,
		MEDIUM: 0.5,
		SLOW: 0.8,
	},
	TILE_STAGGER: 0.2, // Delay between each Mondrian tile animation
	COLOR_GROUP_STAGGER: 0.3, // Delay between each color group in PietGrid
	EASING: "easeInOut",
};

// Portfolio Section Keys
export const SECTIONS = {
	ABOUT: "about",
	PROJECTS: "projects",
	SKILLS: "skills",
	EXPERIENCE: "experience",
	CONTACT: "contact",
	MISC: "misc",
};

// Mondrian Tile Configuration
// Each tile has specific animation direction and delay
export const TILE_CONFIGS = [
	{
		section: SECTIONS.ABOUT,
		title: "Parth Panchal",
		description: "Tech | Movies | Quizzing | Photography",
		className: "hero-tile",
		animationDelay: 0.2,
		animationDirection: { y: 20 },
		isHero: true,
	},
	{
		section: SECTIONS.PROJECTS,
		title: "Projects",
		description: "Click to explore my work",
		className: "projects-tile",
		animationDelay: 0.4,
		animationDirection: { x: -20 },
	},
	{
		section: SECTIONS.SKILLS,
		title: "Skills",
		description: "View my expertise",
		className: "skills-tile",
		animationDelay: 0.6,
		animationDirection: { x: 20 },
	},
	{
		section: SECTIONS.EXPERIENCE,
		title: "Experience",
		description: "Professional background",
		className: "experience-tile",
		animationDelay: 0.8,
		animationDirection: { y: 20 },
	},
	{
		section: SECTIONS.CONTACT,
		title: "Contact",
		description: "Get in touch",
		className: "contact-tile",
		animationDelay: 1.0,
		animationDirection: { scale: 0.9 },
	},
	{
		section: SECTIONS.MISC,
		title: "Misc",
		description: "Explore random things",
		className: "misc-tile",
		animationDelay: 1.2,
		animationDirection: { opacity: 0 },
	},
];

// Decorative Color Tiles Configuration
export const COLOR_TILES = [
	{ color: "red", delay: 1.4 },
	{ color: "blue", delay: 1.6 },
	{ color: "yellow", delay: 1.8 },
];

// Blobity Cursor Configuration
export const BLOBITY_CONFIG = {
	LICENSE_KEY: "GPLv3",
	ART_VIEW: {
		color: "#ffffff",
		dotColor: "#ffffff",
		opacity: 0.8,
		size: 20,
		radius: 12,
		magneticLevel: 2,
		fontSize: 14,
		tooltipPadding: 12,
	},
	PORTFOLIO_VIEW: {
		color: "#000000",
		dotColor: "#333333",
		opacity: 0.8,
		size: 20,
		radius: 12,
		magneticLevel: 2,
		fontSize: 14,
		tooltipPadding: 12,
	},
	FONT: "JetBrains Mono",
	FOCUSABLE_SELECTOR:
		"a, button, .grid-cell, .mondrian-tile, .clickable-tile, .color-tile, .back-button, .project-item, .skill-category, .contact-method, .experience-item",
};

// Color Mapping for Blobity Cursor (RGB values)
export const CURSOR_COLORS = {
	WHITE: {
		rgb: "rgb(255, 255, 255)",
		hex: "#000000", // Black cursor on white (inverts to white on black)
	},
	RED: {
		rgb: "227, 32, 23",
		hex: "#E32017",
	},
	BLUE: {
		rgb: "0, 75, 135",
		hex: "#004B87",
	},
	YELLOW: {
		rgb: "255, 209, 0",
		hex: "#FFD100",
	},
};
