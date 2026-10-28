import { useEffect } from "react";
import { BLOBITY_CONFIG, DE_STIJL } from "../constants/config";

// Perceived brightness of an rgb()/rgba() colour, 0-1; null if transparent
const brightness = (css) => {
	const m = css.match(/rgba?\(([^)]+)\)/);
	if (!m) return null;
	const [r, g, b, a = 1] = m[1].split(",").map((v) => parseFloat(v));
	if (a === 0) return null;
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

// The first painted background at or above an element
const backgroundOf = (element) => {
	for (let el = element; el && el !== document.documentElement; el = el.parentElement) {
		const value = brightness(getComputedStyle(el).backgroundColor);
		if (value !== null) return value;
	}
	return 0;
};

/**
 * Blobity cursor component
 * A soft halo that follows the dot cursor (see CURSOR in App.css) and wraps
 * whatever you can click. Its tint always contrasts with what is under the
 * pointer: paper on dark or saturated colours, ink on light ones, so it needs
 * no per-view setup. Only on mouse/trackpad devices, loaded after first paint.
 */
const BlobityProvider = () => {
	useEffect(() => {
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

		let blobity = null;
		let cancelled = false;
		let current = null;

		// One delegated listener, so elements added later (open sections, the
		// section index, ×) are covered too
		const onOver = (e) => {
			if (!blobity || !(e.target instanceof Element)) return;
			const tint = backgroundOf(e.target) < 0.55 ? BLOBITY_CONFIG.ON_DARK : BLOBITY_CONFIG.ON_LIGHT;
			if (tint !== current) {
				current = tint;
				blobity.updateOptions(tint);
			}
		};

		const init = async () => {
			try {
				const Blobity = (await import("blobity")).default;
				if (cancelled) return;
				blobity = new Blobity({
					...BLOBITY_CONFIG.OPTIONS,
					...BLOBITY_CONFIG.ON_LIGHT,
					fontColor: DE_STIJL.PAPER,
					// Magnetic pulls and tilts elements with its own transforms, which
					// corrupts Framer's layout animations on the composition tiles
					magnetic: false,
					mode: "normal",
					// invert renders a full-screen mix-blend-mode: difference canvas,
					// which re-blends the whole page on every animation frame
					invert: false,
				});
				current = BLOBITY_CONFIG.ON_LIGHT;
				if (blobity.canvas) {
					blobity.canvas.style.zIndex = "9999";
					blobity.canvas.style.pointerEvents = "none";
					blobity.canvas.style.position = "fixed";
				}
			} catch (error) {
				// The plain dot cursor still works without it
				console.warn("Blobity initialization failed:", error);
			}
		};

		const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
		const cancelIdle = window.cancelIdleCallback || clearTimeout;
		const handle = idle(init, { timeout: 1500 });
		document.addEventListener("mouseover", onOver);

		return () => {
			cancelled = true;
			cancelIdle(handle);
			document.removeEventListener("mouseover", onOver);
			if (blobity) blobity.destroy();
		};
	}, []);

	return null;
};

export default BlobityProvider;
