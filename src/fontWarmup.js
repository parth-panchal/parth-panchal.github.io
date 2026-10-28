// The site's symbols (arrows, stars, ×…) aren't in its web fonts, so the first
// time each is drawn the browser searches the system fonts for a fallback. That
// search is slow (a 120 ms layout at 4x CPU) and used to land mid-animation, the
// first time a section full of "↗" opened. Drawing every symbol once, invisibly,
// in each font style the site uses moves that cost to an idle moment. The
// browser caches the result, so later draws are instant.

// Every non-Latin character the UI draws; add new ones here
const GLYPHS = "↗↺↻←→×★½♥✎⏎▶■·…–—“”’";
const FAMILIES = ["'Archivo'", "'JetBrains Mono'"];
const WEIGHTS = [400, 700, 800, 900];

const warm = () => {
	const box = document.createElement("div");
	box.setAttribute("aria-hidden", "true");
	// Laid out (so fonts resolve) but invisible and off-screen
	box.style.cssText =
		"position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none";
	for (const family of FAMILIES) {
		for (const weight of WEIGHTS) {
			const span = document.createElement("span");
			span.style.cssText = `font-family:${family};font-weight:${weight};white-space:nowrap`;
			span.textContent = GLYPHS;
			box.appendChild(span);
		}
	}
	document.body.appendChild(box);
	box.getBoundingClientRect(); // force the layout that resolves the fonts
	setTimeout(() => box.remove(), 0);
};

/**
 * Resolve symbol fonts once the web fonts are in and the page is idle.
 */
export const warmSymbolFonts = () => {
	const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));
	const ready = document.fonts?.ready || Promise.resolve();
	ready.then(() => idle(warm, { timeout: 3000 }));
};
