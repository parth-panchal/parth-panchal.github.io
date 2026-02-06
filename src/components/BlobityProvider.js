import { useEffect, useRef, useCallback } from "react";
import { BLOBITY_CONFIG, CURSOR_COLORS } from "../constants/config";

/**
 * Blobity cursor component
 * Creates an interactive cursor effect that adapts to the current view
 * Optimized to fix memory leaks and reduce DOM queries
 */
const BlobityProvider = ({ isArtView = false }) => {
	const blobityRef = useRef(null);
	const listenersRef = useRef(new Map()); // Track listeners for cleanup

	// Memoized function to handle element hover
	const handleElementHover = useCallback(
		(element, blobity) => {
			if (!element || !blobity) return;

			const computedStyle = window.getComputedStyle(element);
			const backgroundColor = computedStyle.backgroundColor;

			// Map element background colors to cursor colors
			let cursorColor = isArtView
				? BLOBITY_CONFIG.ART_VIEW.color
				: BLOBITY_CONFIG.PORTFOLIO_VIEW.color;

			// Check for specific colors
			if (
				backgroundColor === CURSOR_COLORS.WHITE.rgb ||
				backgroundColor === `rgba(${CURSOR_COLORS.WHITE.rgb}, 1)`
			) {
				cursorColor = CURSOR_COLORS.WHITE.hex;
			} else if (backgroundColor.includes(CURSOR_COLORS.RED.rgb)) {
				cursorColor = CURSOR_COLORS.RED.hex;
			} else if (backgroundColor.includes(CURSOR_COLORS.BLUE.rgb)) {
				cursorColor = CURSOR_COLORS.BLUE.hex;
			} else if (backgroundColor.includes(CURSOR_COLORS.YELLOW.rgb)) {
				cursorColor = CURSOR_COLORS.YELLOW.hex;
			}

			// Update cursor color dynamically
			blobity.updateOptions({
				color: cursorColor,
				dotColor: cursorColor,
			});
		},
		[isArtView]
	);

	// Memoized function to reset cursor to default
	const handleElementLeave = useCallback(
		(blobity) => {
			if (!blobity) return;

			const defaultColor = isArtView
				? BLOBITY_CONFIG.ART_VIEW.color
				: BLOBITY_CONFIG.PORTFOLIO_VIEW.color;

			blobity.updateOptions({
				color: defaultColor,
				dotColor: isArtView
					? BLOBITY_CONFIG.ART_VIEW.dotColor
					: BLOBITY_CONFIG.PORTFOLIO_VIEW.dotColor,
			});
		},
		[isArtView]
	);

	useEffect(() => {
		// Only initialize on non-mobile devices for better performance
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			);
		if (isMobile) return;

		const initBlobity = async () => {
			try {
				// Dynamic import to avoid SSR issues
				const Blobity = (await import("blobity")).default;

				// Clean up existing instance
				if (blobityRef.current) {
					blobityRef.current.destroy();
				}

				// Clear old listeners
				listenersRef.current.forEach(({ element, enter, leave }) => {
					element.removeEventListener("mouseenter", enter);
					element.removeEventListener("mouseleave", leave);
				});
				listenersRef.current.clear();

				// Create new Blobity instance with config
				const config = isArtView
					? BLOBITY_CONFIG.ART_VIEW
					: BLOBITY_CONFIG.PORTFOLIO_VIEW;

				const blobity = new Blobity({
					licenseKey: BLOBITY_CONFIG.LICENSE_KEY,
					...config,
					font: BLOBITY_CONFIG.FONT,
					fontColor: isArtView ? "#000000" : "#ffffff",
					focusableElements: BLOBITY_CONFIG.FOCUSABLE_SELECTOR,
					magnetic: true,
					mode: "normal",
					invert: true,
				});

				blobityRef.current = blobity;

				// Query DOM for focusable elements (cached for this effect run)
				const focusableElements = document.querySelectorAll(
					BLOBITY_CONFIG.FOCUSABLE_SELECTOR
				);

				// Attach event listeners and store references for cleanup
				focusableElements.forEach((element) => {
					const enterHandler = () =>
						handleElementHover(element, blobity);
					const leaveHandler = () => handleElementLeave(blobity);

					element.addEventListener("mouseenter", enterHandler);
					element.addEventListener("mouseleave", leaveHandler);

					// Store listeners for cleanup
					// eslint-disable-next-line react-hooks/exhaustive-deps
					listenersRef.current.set(element, {
						element,
						enter: enterHandler,
						leave: leaveHandler,
					});
				});

				// Set canvas z-index and styles
				if (blobity.canvas) {
					blobity.canvas.style.zIndex = "9999";
					blobity.canvas.style.pointerEvents = "none";
					blobity.canvas.style.position = "fixed";
				}
			} catch (error) {
				// Silently fail if Blobity can't initialize
				console.warn("Blobity initialization failed:", error);
			}
		};

		// Debounce initialization to avoid multiple calls
		const timer = setTimeout(initBlobity, 100);

		// Cleanup function - CRITICAL for preventing memory leaks
		return () => {
			clearTimeout(timer);

			// Capture current listeners for cleanup
			// eslint-disable-next-line react-hooks/exhaustive-deps
			const currentListeners = listenersRef.current;

			// Remove all event listeners
			currentListeners.forEach(({ element, enter, leave }) => {
				element.removeEventListener("mouseenter", enter);
				element.removeEventListener("mouseleave", leave);
			});
			currentListeners.clear();

			// Destroy Blobity instance
			if (blobityRef.current) {
				blobityRef.current.destroy();
				blobityRef.current = null;
			}
		};
	}, [isArtView, handleElementHover, handleElementLeave]);

	return null;
};

export default BlobityProvider;
