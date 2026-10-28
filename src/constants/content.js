// Site Content
// Everything personal lives here; components only lay it out.

export const PROFILE = {
	name: "Parth Panchal",
	interests: [
		{ label: "Tech", color: "red" },
		{ label: "Movies", color: "blue" },
		{ label: "Quizzing", color: "yellow" },
		{ label: "Photography", color: "paper" },
	],
	// The introduction at the top of About: one opening line, then short paragraphs.
	// A paragraph is a list of parts: plain text, { text, to } for a link to one of
	// the site's sections ("/writing"), or { text, href } for an outside link.
	// DRAFT, written only from what's public on your accounts. Rewrite it in your voice.
	intro: {
		lede: "Hi, I'm Parth. I build software, quiz, watch films and take photographs, from Jersey City.",
		paragraphs: [
			[
				"I write ",
				{ text: "Peripheral Vision", to: "/writing" },
				" on Substack and keep a film diary on Letterboxd, ",
				{ text: "reviews and all", to: "/films" },
				". The code lives on ",
				{ text: "GitHub", to: "/projects" },
				".",
			],
			["This site puts all of it in one place. Open any block to look around."],
		],
	},
	links: [
		{ label: "GitHub", handle: "@parth-panchal", href: "https://github.com/parth-panchal", color: "paper" },
		// { label: "Letterboxd", handle: "@you", href: "https://letterboxd.com/you", color: "blue" },
		// { label: "Instagram", handle: "@you", href: "https://instagram.com/you", color: "yellow" },
	],
	// A photo for the About page: a path in public/ (e.g. "/photos/me.jpg"). Empty = no photo.
	portrait: "",
	// Timeline on the About page, newest first. Empty = no timeline.
	// { when: "2024–now", what: "…", where: "…" }   (`where` is optional)
	timeline: [],
	repo: "https://github.com/parth-panchal/parth-panchal.github.io",
};

// Inspiration page: optional paragraphs in your own words, shown under the opening line
// (why Mondrian, why Piet). The rest of the page is written from the site itself.
export const INSPIRATION = {
	note: [],
};

// "Lately" on the About page is automatic (latest post, last film, last project,
// refreshed with every build). These optional lines are added under it, in your
// words: what you're working on, reading, learning. Leave empty to show only the
// automatic part.
export const NOW = {
	updated: "", // e.g. "2026-10"
	items: [
		// { label: "Working on", text: "…" },
		// { label: "Reading", text: "…" },
	],
};

// Quizzing section. The tile appears once there is something here.
// intro: paragraphs (plain strings). highlights: competitions, results, roles.
// questions: favourites to show as a card the visitor can reveal.
// DRAFT: the intro and Mimirlyzer come from your public GitHub; the rest is yours to fill.
export const QUIZZING = {
	intro: [
		"I built Mimirlyzer to track and record individual performances on MIMIR-style quizzes.",
	],
	highlights: [
		// { when: "2025", what: "…", detail: "…" },
	],
	questions: [
		// { question: "…", answer: "…", note: "optional context shown with the answer" },
	],
	projects: [
		{
			name: "Mimirlyzer",
			description: "Track and record individual performances on MIMIR-style quizzes.",
			href: "https://github.com/parth-panchal/mimirlyzer",
		},
	],
};

// Kit: what you shoot and work with, grouped. Empty groups are hidden.
// Each item: { name, href?, note? }.
// DRAFT: the Desk group was seeded from this machine and this site's code; the
// photography groups are empty until you add your gear.
export const KIT = [
	{ category: "Camera", items: [] },
	{ category: "Lenses", items: [] },
	{ category: "Editing", items: [] },
	{
		category: "Desk",
		items: [
			{ name: "Mac with Apple silicon" },
			{ name: "Visual Studio Code", href: "https://code.visualstudio.com" },
			{ name: "Claude Code", href: "https://claude.com/claude-code" },
			{ name: "Arc", href: "https://arc.net" },
			{ name: "Brave", href: "https://brave.com" },
		],
	},
	{
		category: "This site",
		items: [
			{ name: "React + Framer Motion", href: "https://motion.dev" },
			{ name: "Archivo", href: "https://fonts.google.com/specimen/Archivo", note: "Display type" },
			{ name: "JetBrains Mono", href: "https://www.jetbrains.com/lp/mono/", note: "Everything else" },
		],
	},
];
