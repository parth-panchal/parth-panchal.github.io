import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PHOTOS from "../data/photos.json";

// Wide photos span two columns, tall ones two rows, the newest gets a big block
const spanFor = (photo, index) => {
	if (index === 0) return "photo--hero";
	const ratio = photo.width / photo.height;
	if (ratio > 1.45) return "photo--wide";
	if (ratio < 0.8) return "photo--tall";
	return "";
};

const label = (photo) => [photo.caption, photo.place, photo.date].filter(Boolean).join(" · ");

/**
 * Full-screen viewer. Rendered in a portal because the open tile is
 * transformed during layout animations, which would trap position: fixed.
 */
const Lightbox = ({ index, onClose, onStep }) => {
	const photo = PHOTOS[index];

	useEffect(() => {
		const onKey = (e) => {
			// Capture phase + preventDefault so Escape closes the viewer, not the section
			if (e.key === "Escape") onClose();
			else if (e.key === "ArrowRight") onStep(1);
			else if (e.key === "ArrowLeft") onStep(-1);
			else return;
			e.preventDefault();
		};
		window.addEventListener("keydown", onKey, true);
		return () => window.removeEventListener("keydown", onKey, true);
	}, [onClose, onStep]);

	return createPortal(
		<div
			className="lightbox"
			role="dialog"
			aria-modal="true"
			aria-label={label(photo) || "Photo"}
			onClick={onClose}
		>
			{/* Keyed, so each photo fades in afresh (CSS) */}
			<img
				key={photo.src}
				className="lightbox__image"
				src={photo.src}
				width={photo.width}
				height={photo.height}
				alt={photo.caption || ""}
				onClick={(e) => e.stopPropagation()}
			/>
			<div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
				<button
					type="button"
					className="lightbox__nav"
					onClick={() => onStep(-1)}
					aria-label="Previous photo"
				>
					←
				</button>
				<span className="lightbox__caption">
					{label(photo)}
					<span className="lightbox__count">
						{index + 1} / {PHOTOS.length}
					</span>
				</span>
				<button
					type="button"
					className="lightbox__nav"
					onClick={() => onStep(1)}
					aria-label="Next photo"
				>
					→
				</button>
				<button type="button" className="lightbox__nav" onClick={onClose} aria-label="Close viewer">
					×
				</button>
			</div>
		</div>,
		document.body,
	);
};

/**
 * Photography, laid out as a Mondrian of crops. Click any frame for the full image.
 * Photos come from public/photos (see scripts/fetch-feeds.mjs).
 */
const Photos = () => {
	const [open, setOpen] = useState(null);

	const close = useCallback(() => setOpen(null), []);
	const step = useCallback(
		(delta) => setOpen((i) => (i + delta + PHOTOS.length) % PHOTOS.length),
		[],
	);

	return (
		<>
			<div className="photo-grid">
				{PHOTOS.map((photo, i) => (
					<button
						type="button"
						key={photo.src}
						className={`photo ${spanFor(photo, i)}`}
						onClick={() => setOpen(i)}
						aria-label={`Open ${label(photo) || `photo ${i + 1}`}`}
					>
						<img src={photo.src} alt={photo.caption || ""} loading="lazy" decoding="async" />
						{label(photo) && <span className="photo__caption">{label(photo)}</span>}
					</button>
				))}
			</div>
			{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
		</>
	);
};

export default Photos;
