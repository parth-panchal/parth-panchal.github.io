import { useEffect, useRef } from "react";

/**
 * Blobity cursor component
 * Creates an interactive cursor effect that adapts to the current view
 */
const BlobityProvider = ({ isArtView = false }) => {
	const blobityRef = useRef(null);

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

				if (blobityRef.current) {
					blobityRef.current.destroy();
				}

				const blobity = new Blobity({
					licenseKey: "GPLv3",
					color: isArtView ? "#ffffff" : "#000000",
					opacity: 0.8,
					tooltipPadding: 12,
					size: 20,
					dotColor: isArtView ? "#ffffff" : "#333333",
					font: "JetBrains Mono",
					fontColor: isArtView ? "#000000" : "#ffffff",
					fontSize: 14,
					focusableElements:
						"a, button, .grid-cell, .mondrian-tile, .clickable-tile, .color-tile, .back-button, .project-item, .skill-category, .contact-method, .experience-item",
					magnetic: true,
					magneticLevel: 2,
					radius: 12,
					mode: "normal",
					invert: true, // This will invert the background color of elements when hovered
				});

				blobityRef.current = blobity;

				// Add dynamic color changing based on hovered element
				const handleElementHover = (element) => {
					if (!element || !blobity) return;

					const computedStyle = window.getComputedStyle(element);
					const backgroundColor = computedStyle.backgroundColor;

					// Map element background colors to cursor colors
					let cursorColor = isArtView ? "#ffffff" : "#000000"; // default

					if (
						backgroundColor === "rgb(255, 255, 255)" ||
						backgroundColor === "rgba(255, 255, 255, 1)"
					) {
						// White tiles - use black cursor so when both invert, cursor becomes white on black background
						cursorColor = "#000000";
					} else if (
						backgroundColor === "rgb(227, 32, 23)" ||
						backgroundColor.includes("227, 32, 23")
					) {
						// Red tiles
						cursorColor = "#E32017";
					} else if (
						backgroundColor === "rgb(0, 75, 135)" ||
						backgroundColor.includes("0, 75, 135")
					) {
						// Blue tiles
						cursorColor = "#004B87";
					} else if (
						backgroundColor === "rgb(255, 209, 0)" ||
						backgroundColor.includes("255, 209, 0")
					) {
						// Yellow tiles
						cursorColor = "#FFD100";
					}

					// Update cursor color dynamically
					blobity.updateOptions({
						color: cursorColor,
						dotColor: cursorColor,
					});
				};

				// Listen for mouse events on focusable elements
				const focusableElements = document.querySelectorAll(
					"a, button, .grid-cell, .mondrian-tile, .clickable-tile, .color-tile, .back-button, .project-item, .skill-category, .contact-method, .experience-item"
				);

				focusableElements.forEach((element) => {
					element.addEventListener("mouseenter", () =>
						handleElementHover(element)
					);
					element.addEventListener("mouseleave", () => {
						// Reset to default color when leaving element
						const defaultColor = isArtView ? "#ffffff" : "#000000";
						blobity.updateOptions({
							color: defaultColor,
							dotColor: defaultColor,
						});
					});
				});

				// Set canvas z-index to ensure it's above content but below modals
				if (blobity.canvas) {
					blobity.canvas.style.zIndex = "9999";
					blobity.canvas.style.pointerEvents = "none";
					blobity.canvas.style.position = "fixed";
				}
			} catch (error) {
				// Silently fail if Blobity can't initialize (e.g., on mobile or unsupported browsers)
			}
		};

		// Debounce initialization to avoid multiple calls
		const timer = setTimeout(initBlobity, 100);

		// Cleanup function
		return () => {
			clearTimeout(timer);
			if (blobityRef.current) {
				blobityRef.current.destroy();
				blobityRef.current = null;
			}
		};
	}, [isArtView]);

	return null;
};

export default BlobityProvider;
