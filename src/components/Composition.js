import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { SECTION_REGISTRY, prefetchSections } from "../sections";
import { ANIMATION, COMPOSITION, COLOR_BLOCKS, DE_STIJL } from "../constants/config";
import { ROUTES, isValidSection } from "../constants/routes";

/**
 * Find the row/column span of every named area in a grid-template-areas list
 */
const parseAreas = (areas) => {
	const spans = {};
	areas.forEach((line, r) => {
		line
			.trim()
			.split(/\s+/)
			.forEach((name, c) => {
				const s = spans[name] || (spans[name] = { r0: r, r1: r, c0: c, c1: c });
				s.r0 = Math.min(s.r0, r);
				s.r1 = Math.max(s.r1, r);
				s.c0 = Math.min(s.c0, c);
				s.c1 = Math.max(s.c1, c);
			});
	});
	return spans;
};

// Tracks inside [from, to] keep their weight; the rest squeeze to strips.
// Weights are normalised to sum to 1: fr factors adding up to less than 1
// only claim that fraction of the free space and leave a gap at the edge.
const tracks = (weights, range, strip) => {
	const kept = (i) => !range || (i >= range[0] && i <= range[1]);
	const total = weights.reduce((sum, w, i) => (kept(i) ? sum + w : sum), 0);
	return weights
		.map((w, i) => (kept(i) ? `minmax(0, ${+(w / total).toFixed(4)}fr)` : strip))
		.join(" ");
};

const outside = (a0, a1, b0, b1) => a1 < b0 || a0 > b1;

const sum = (values) => values.reduce((total, v) => total + v, 0);

/**
 * The smallest share of the grid each area gets across all composition
 * variants. Tile text is sized for that minimum, so switching compositions
 * only moves text; it never resizes or rewraps (which would snap on the first
 * frame while the tiles animate).
 */
const minShares = (spans, variants) =>
	Object.fromEntries(
		Object.entries(spans).map(([area, s]) => [
			area,
			{
				"--fw": Math.min(
					...variants.map(({ cols }) => sum(cols.slice(s.c0, s.c1 + 1)) / sum(cols)),
				).toFixed(4),
				"--fh": Math.min(
					...variants.map(({ rows }) => sum(rows.slice(s.r0, s.r1 + 1)) / sum(rows)),
				).toFixed(4),
				"--span-col-gaps": s.c1 - s.c0,
				"--span-row-gaps": s.r1 - s.r0,
			},
		]),
	);

// Text colour that stays legible on a block
const inkOn = (color) =>
	color === DE_STIJL.YELLOW || color === DE_STIJL.PAPER ? DE_STIJL.INK : DE_STIJL.PAPER;

/**
 * A plain block of colour: a decorative block, or a section with no content yet.
 * Clicking it re-composes the painting (or closes the open section).
 */
const Block = ({ id, color, className = "", narrow, short, hint, label, onClick }) => (
	<m.button
		type="button"
		layout
		transition={ANIMATION.LAYOUT_TRANSITION}
		className={`color-block ${className}${inkOn(color) === DE_STIJL.PAPER ? " color-block--dark" : ""}${narrow ? " is-narrow" : ""}${short ? " is-short" : ""}`}
		style={{ gridArea: id, backgroundColor: color, color: inkOn(color) }}
		onClick={onClick}
		aria-label={label}
		data-hint={hint}
	/>
);

const useIsMobile = () => {
	const query = `(max-width: ${COMPOSITION.MOBILE_BREAKPOINT}px)`;
	const [mobile, setMobile] = useState(() => window.matchMedia(query).matches);
	useEffect(() => {
		const mql = window.matchMedia(query);
		const onChange = (e) => setMobile(e.matches);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, [query]);
	return mobile;
};

/**
 * One section of the composition. Closed it is a label; open it fills the
 * space its tracks were given and renders the section.
 */
const Tile = ({ id, section, open, narrow, short, share, index, onGo, onOpen, onClose }) => {
	const { title, blurb, tone, Component, Preview, Backdrop } = section;
	const squeezed = narrow || short;
	// Squeezed in both directions: a corner square too small for a word
	const tiny = narrow && short;

	// × only appears once the tile has stopped growing: a moving close button
	// gets missed (the press lands on the header behind it), and one shown early
	// is cut off by the still-growing tile. Timed from the transition itself:
	// Framer's onLayoutAnimationComplete fires early when an earlier animation is
	// interrupted (moving between sections), so it can't be trusted here.
	const [settled, setSettled] = useState(false);
	useEffect(() => {
		if (!open) return undefined;
		const timer = setTimeout(
			() => setSettled(true),
			ANIMATION.LAYOUT_TRANSITION.duration * 1000 + 50,
		);
		// Reset on close, so the next opening starts hidden from its first frame
		return () => {
			clearTimeout(timer);
			setSettled(false);
		};
	}, [open]);

	const handleKey = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onOpen();
		}
	};

	const hasBackdrop = Backdrop && !squeezed;

	return (
		<m.section
			layout
			transition={ANIMATION.LAYOUT_TRANSITION}
			className={`tile tile--${id} tile--${tone} ${open ? "tile--open" : "tile--closed"}${
				narrow ? " is-narrow" : ""
			}${short ? " is-short" : ""}${hasBackdrop ? " has-backdrop" : ""}`}
			style={{ gridArea: id, ...share }}
			onClick={open ? undefined : onOpen}
			onKeyDown={open ? undefined : handleKey}
			role={open ? undefined : "button"}
			tabIndex={open ? undefined : 0}
			aria-label={open ? undefined : `Open ${title}`}
			title={squeezed ? title : undefined}
		>
			{open ? (
				// `layout` lets Framer cancel the tile's scale, so the content keeps
				// its final size and is revealed by the growing frame instead of squashing
				<m.div layout transition={ANIMATION.LAYOUT_TRANSITION} className="tile__body">
					<header className="tile__header">
						<h2 className="tile__heading">{title}</h2>
						<button
							type="button"
							className={`tile__close${settled ? " is-ready" : ""}`}
							onClick={onClose}
							aria-label={`Close ${title}`}
						>
							×
						</button>
						{/* Some strips are too small to label, so every section stays reachable from here */}
						<nav className="tile__index" aria-label="Other sections">
							{index
								.filter((item) => item.id !== id)
								.map((item) => (
									<button
										type="button"
										key={item.id}
										className="tile__index-link"
										onClick={() => onGo(item.id)}
									>
										{item.title}
									</button>
								))}
						</nav>
					</header>
					<div className="tile__content">
						{/* Section code loads on demand (prefetched when idle, so usually already here) */}
						<Suspense fallback={null}>
							<Component />
						</Suspense>
					</div>
				</m.div>
			) : (
				<>
					{hasBackdrop && (
						<m.div
							layout
							transition={ANIMATION.LAYOUT_TRANSITION}
							className="tile-backdrop"
							aria-hidden="true"
						>
							<Backdrop />
						</m.div>
					)}
					<m.div layout="position" transition={ANIMATION.LAYOUT_TRANSITION} className="tile__label">
						{/* Keyed by shape so the label fades in afresh (CSS) instead of snapping when the tile becomes a strip */}
						<div key={tiny ? "tiny" : squeezed ? "strip" : "full"} className="tile__label-inner">
							{Preview && !squeezed ? (
								<Preview />
							) : (
								<>
									{/* A corner square gets a two-letter mark (full name on hover) instead of nothing */}
									<span className="tile__title">{tiny ? title.slice(0, 2) : title}</span>
									{blurb && !squeezed && <span className="tile__blurb">{blurb}</span>}
								</>
							)}
						</div>
					</m.div>
				</>
			)}
		</m.section>
	);
};

/**
 * Composition View
 * The portfolio as a single Mondrian. /portfolio shows it at rest;
 * /<section> opens that tile in place.
 */
const Composition = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isMobile = useIsMobile();

	// Warm every section's code once the page is idle, so opening one is instant
	useEffect(() => {
		const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
		const cancel = window.cancelIdleCallback || clearTimeout;
		const handle = idle(prefetchSections, { timeout: 3000 });
		return () => cancel(handle);
	}, []);
	const [variant, setVariant] = useState(0);

	const slug = location.pathname.replace(/^\/|\/$/g, "");
	const active = isValidSection(slug) && SECTION_REGISTRY[slug].available ? slug : null;
	const known = active || location.pathname === ROUTES.HOME;

	const layout = isMobile ? COMPOSITION.mobile : COMPOSITION.desktop;
	const spans = useMemo(() => parseAreas(layout.areas), [layout]);
	const shares = useMemo(() => minShares(spans, layout.variants), [spans, layout]);

	// Variants are per layout, so start over when crossing the breakpoint
	useEffect(() => setVariant(0), [isMobile]);

	const close = useCallback(() => navigate(ROUTES.HOME), [navigate]);

	useEffect(() => {
		const onKey = (e) => {
			// The photo viewer handles Escape first and marks it handled
			if (e.key === "Escape" && active && !e.defaultPrevented) close();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [active, close]);

	if (!known) return <Navigate to={ROUTES.HOME} replace />;

	const { cols, rows } = layout.variants[variant % layout.variants.length];
	const open = active && spans[active];
	const strip = isMobile ? COMPOSITION.STRIP_MOBILE : COMPOSITION.STRIP;

	const style = {
		gridTemplateAreas: layout.areas
			.map((line) => `"${line.trim().split(/\s+/).join(" ")}"`)
			.join(" "),
		gridTemplateColumns: tracks(cols, open && [open.c0, open.c1], strip),
		gridTemplateRows: tracks(rows, open && [open.r0, open.r1], strip),
		"--col-gaps": cols.length - 1,
		"--row-gaps": rows.length - 1,
	};

	// Every section with content, in reading order, for the index in an open section
	const index = Object.entries(SECTION_REGISTRY)
		.filter(([, section]) => section.available)
		.map(([id, section]) => ({ id, title: section.title }));

	const count = layout.variants.length;
	const recompose = () => {
		if (active) {
			close();
			return;
		}
		setVariant((v) => (v + 1) % count);
	};
	// Blocks squeeze into strips like tiles do, so their hover hint has to fit the
	// shape: a corner square only has room for "×"; at rest the hint takes two lines
	const blockProps = (id) => {
		const s = spans[id];
		const narrow = !!open && outside(s.c0, s.c1, open.c0, open.c1);
		const short = !!open && outside(s.r0, s.r1, open.r0, open.r1);
		return {
			narrow,
			short,
			onClick: recompose,
			hint: active
				? narrow && short
					? "×"
					: "× close"
				: `↻ re-compose\n${(variant % count) + 1}/${count}`,
			label: active ? "Close section" : "Re-compose the painting",
		};
	};

	return (
		// Fades in with CSS (.composition-view): Framer opacity animations flash for a frame when they end
		<div className="composition-view">
			<div className={`composition${active ? " has-open" : ""}`} style={style}>
				{Object.entries(SECTION_REGISTRY).map(([id, section]) => {
					const s = spans[id];
					// A section with nothing to show yet is just another block of colour
					if (!section.available) {
						return (
							<Block
								key={id}
								id={id}
								color={DE_STIJL[section.tone.toUpperCase()]}
								className="tile--empty"
								{...blockProps(id)}
							/>
						);
					}
					return (
						<Tile
							key={id}
							id={id}
							section={section}
							share={shares[id]}
							open={active === id}
							narrow={!!open && outside(s.c0, s.c1, open.c0, open.c1)}
							short={!!open && outside(s.r0, s.r1, open.r0, open.r1)}
							index={index}
							onGo={(target) => navigate(`/${target}`)}
							onOpen={() => navigate(`/${id}`)}
							onClose={close}
						/>
					);
				})}
				{Object.entries(COLOR_BLOCKS)
					.filter(([id]) => spans[id])
					.map(([id, color]) => (
						<Block key={id} id={id} color={color} {...blockProps(id)} />
					))}
			</div>
		</div>
	);
};

export default Composition;
