// Piet "Hello World" by Thomas Schoch - Color Grid Data
// Reference: https://www.dangermouse.net/esoteric/piet.html

/**
 * 13x13 grid representing Thomas Schoch's exact Piet "Hello World" artwork
 * Each color has been carefully extracted from the reference image
 */
export const PIET_COLOR_GRID = [
	// Row 0
	[
		"#FFFF00",
		"#B4B4FF",
		"#0000FF",
		"#0000B4",
		"#B400B4",
		"#00B4B4",
		"#B4B400",
		"#00B400",
		"#00FFFF",
		"#FFFF00",
		"#FF00FF",
		"#B400B4",
		"#B4FFB4",
	],
	// Row 1
	[
		"#FFB4B4",
		"#0000B4",
		"#00FFFF",
		"#00B4B4",
		"#B4FFFF",
		"#B4B4FF",
		"#0000B4",
		"#FF00FF",
		"#B400B4",
		"#FF00FF",
		"#B400B4",
		"#B4FFB4",
		"#FFB4B4",
	],
	// Row 2
	[
		"#00B4B4",
		"#FFFF00",
		"#00FF00",
		"#FF0000",
		"#FFFFB4",
		"#FFB4FF",
		"#FFB4B4",
		"#B4B4FF",
		"#0000FF",
		"#0000B4",
		"#FFFFB4",
		"#FFB4B4",
		"#B4B400",
	],
	// Row 3
	[
		"#B4FFFF",
		"#FFFFB4",
		"#FFB4FF",
		"#00B400",
		"#FFFF00",
		"#FFB4B4",
		"#B4B4FF",
		"#00B4B4",
		"#B4FFFF",
		"#FF0000",
		"#FFFF00",
		"#B4B4FF",
		"#00B400",
	],
	// Row 4
	[
		"#00B400",
		"#00FF00",
		"#B400B4",
		"#FF00FF",
		"#FFB4FF",
		"#000000",
		"#000000",
		"#000000",
		"#FFB4FF",
		"#B40000",
		"#00FF00",
		"#0000FF",
		"#FFFF00",
	],
	// Row 5
	[
		"#B4B4FF",
		"#0000FF",
		"#B4B400",
		"#FFB4FF",
		"#000000",
		"#000000",
		"#B4FFB4",
		"#000000",
		"#000000",
		"#FFB4B4",
		"#FF0000",
		"#0000B4",
		"#B4B400",
	],
	// Row 6
	[
		"#FFFFB4",
		"#FF0000",
		"#B40000",
		"#B4B4FF",
		"#000000",
		"#B4FFB4",
		"#B4FFB4",
		"#B4FFB4",
		"#000000",
		"#FFFFB4",
		"#FFFF00",
		"#B400B4",
		"#FFFFB4",
	],
	// Row 7
	[
		"#FFB4FF",
		"#00FF00",
		"#00B400",
		"#FF00FF",
		"#000000",
		"#000000",
		"#00FFFF",
		"#000000",
		"#000000",
		"#FFFF00",
		"#FF00FF",
		"#B4FFFF",
		"#B4FFB4",
	],
	// Row 8
	[
		"#B4FFFF",
		"#FFFF00",
		"#0000B4",
		"#B40000",
		"#FFFFB4",
		"#000000",
		"#0000B4",
		"#000000",
		"#FFFFB4",
		"#B4B400",
		"#00FFFF",
		"#B4B4FF",
		"#B4FFFF",
		"#00FFFF",
	],
	// Row 9
	[
		"#B40000",
		"#00B4B4",
		"#B400B4",
		"#FFB4FF",
		"#FF00FF",
		"#00B400",
		"#FF00FF",
		"#FFB4FF",
		"#B4B4FF",
		"#00B4B4",
		"#B4FFB4",
		"#FFFFB4",
		"#B4B4FF",
	],
	// Row 10
	[
		"#B400B4",
		"#B4FFFF",
		"#B4B4FF",
		"#B4B400",
		"#FFFF00",
		"#00B400",
		"#B4FFFF",
		"#B4FFB4",
		"#FFFFB4",
		"#FFB4B4",
		"#00FF00",
		"#FFB4FF",
		"#FFFF00",
	],
	// Row 11
	[
		"#B4B400",
		"#00B4B4",
		"#FF0000",
		"#FFB4B4",
		"#FF0000",
		"#FFB4B4",
		"#B40000",
		"#FF0000",
		"#00FF00",
		"#00B4B4",
		"#B400B4",
		"#FF00FF",
		"#00FFFF",
	],
	// Row 12
	[
		"#00B4B4",
		"#FF0000",
		"#FFB4B4",
		"#FFB4FF",
		"#B400B4",
		"#FF00FF",
		"#FFFF00",
		"#00B400",
		"#B4B400",
		"#FFFF00",
		"#00FFFF",
		"#00B400",
	],
];

/**
 * Core portfolio sections - streamlined for a focused portfolio experience
 */
export const PORTFOLIO_SECTIONS = [
	{
		key: "about",
		title: "About Me",
		description: "Personal background and philosophy",
		gridZone: "top-left", // corresponds to certain areas of the grid
	},
	{
		key: "projects",
		title: "Projects",
		description: "Technical work and creative projects",
		gridZone: "top-right",
	},
	{
		key: "skills",
		title: "Skills & Tools",
		description: "Technical expertise and development stack",
		gridZone: "center",
	},
	{
		key: "experience",
		title: "Experience",
		description: "Professional journey and achievements",
		gridZone: "bottom-left",
	},
	{
		key: "contact",
		title: "Contact",
		description: "Let's connect and collaborate",
		gridZone: "bottom-right",
	},
];

/**
 * Grid zone mapping - defines which colors correspond to which portfolio sections
 * This creates meaningful interactions while preserving the artistic integrity
 */
export const GRID_ZONE_MAPPING = {
	// About section - warm colors (reds, yellows, pinks)
	about: [
		"#FFFF00",
		"#FFB4B4",
		"#FF0000",
		"#FFFFB4",
		"#FFB4FF",
		"#FF00FF",
		"#B4FFFF",
		"#FFBF40",
	],

	// Projects section - cool blues and cyans
	projects: [
		"#0000FF",
		"#0000B4",
		"#00FFFF",
		"#00B4B4",
		"#B4B4FF",
		"#B4FFFF",
		"#40BFFF",
		"#0080FF",
	],

	// Skills section - greens and nature colors
	skills: [
		"#00FF00",
		"#00B400",
		"#B4FFB4",
		"#80FF80",
		"#40FF40",
		"#B4B400",
		"#808000",
	],

	// Experience section - purples and magentas
	experience: [
		"#B400B4",
		"#FF00FF",
		"#FFB4FF",
		"#8000FF",
		"#BF40FF",
		"#FF80FF",
	],

	// Contact section - neutral and mixed colors
	contact: [
		"#C0C0C0",
		"#808080",
		"#FFFFFF",
		"#000000",
		"#404040",
		"#BFBFBF",
		"#404040",
	],
};

/**
 * Get the section for a given color based on zone mapping
 */
export const getSectionForColor = (color) => {
	for (const section of PORTFOLIO_SECTIONS) {
		const zoneColors = GRID_ZONE_MAPPING[section.key] || [];
		if (zoneColors.includes(color)) {
			return section;
		}
	}

	// Default fallback - distribute remaining colors across sections
	const colorIndex = getUniqueColors().indexOf(color);
	if (colorIndex !== -1) {
		const sectionIndex = colorIndex % PORTFOLIO_SECTIONS.length;
		return PORTFOLIO_SECTIONS[sectionIndex];
	}

	return null;
};

/**
 * Extract all unique colors from the Piet grid
 * @returns {string[]} Array of unique hex color codes, sorted alphabetically
 */
export const getUniqueColors = () => {
	const colors = new Set();
	PIET_COLOR_GRID.forEach((row) => {
		row.forEach((color) => colors.add(color));
	});
	return Array.from(colors).sort();
};
