import React, { useEffect, useMemo, useRef } from "react";
import { ANIMATION } from "../constants/config";

/**
 * A single codel. Memoized so an interpreter step only re-renders the cells
 * whose state changed, not all 169.
 */
const Cell = React.memo(({ r, c, color, active, dim, delay }) => (
	<div
		className={`piet-cell${active ? " is-active" : ""}${dim ? " is-dim" : ""}`}
		style={{ backgroundColor: color, animationDelay: delay }}
		data-r={r}
		data-c={c}
	/>
));

Cell.displayName = "Cell";

/**
 * Renders a Piet colour grid with an optional running-program overlay.
 * Used by the landing painting and the studio canvas.
 *
 * @param {string[][]} grid - Hex colours
 * @param {Set<string>} active - "r,c" keys of the block the pointer is on
 * @param {number[][]} trail - Recent [r, c] codels the pointer passed through
 * @param {boolean} dimmed - Fade inactive cells while a program runs
 * @param {(hex: string) => string} colorFor - Optional colour remap (used to fold into De Stijl)
 * @param {(r: number, c: number) => void} onPaint - Makes the grid paintable
 * @param {boolean} intro - Stagger cells in by colour group on mount
 */
const PietGrid = React.memo(
	({
		grid,
		active,
		trail = [],
		dimmed = false,
		colorFor,
		onPaint,
		intro = false,
		className = "",
		ariaLabel,
	}) => {
		const rows = grid.length;
		const cols = grid[0].length;
		const paintingRef = useRef(false);

		// Cells of the same colour animate in together
		const colorDelay = useMemo(() => {
			const order = [...new Set(grid.flat())].sort();
			return Object.fromEntries(
				order.map((c, i) => [c, i * ANIMATION.COLOR_GROUP_STAGGER])
			);
			// Only the first grid matters for the intro
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useEffect(() => {
			const stop = () => {
				paintingRef.current = false;
			};
			window.addEventListener("pointerup", stop);
			return () => window.removeEventListener("pointerup", stop);
		}, []);

		// Pointer events stay on the first cell during touch drags, so hit-test manually
		const paintAt = (x, y) => {
			const el = document.elementFromPoint(x, y);
			if (!el || el.dataset.r === undefined) return;
			onPaint(Number(el.dataset.r), Number(el.dataset.c));
		};

		const paintHandlers = onPaint
			? {
					onPointerDown: (e) => {
						paintingRef.current = true;
						paintAt(e.clientX, e.clientY);
					},
					onPointerMove: (e) => {
						if (paintingRef.current) paintAt(e.clientX, e.clientY);
					},
			  }
			: {};

		const trailPoints = trail.map(([r, c]) => `${c + 0.5},${r + 0.5}`).join(" ");
		const head = trail[trail.length - 1];

		return (
			<div
				className={`piet-grid${onPaint ? " piet-grid--paintable" : ""}${intro ? " piet-grid--intro" : ""} ${className}`}
				style={{ "--cols": cols, "--rows": rows }}
				role="img"
				aria-label={ariaLabel}
				{...paintHandlers}
			>
				{grid.map((row, r) =>
					row.map((hex, c) => {
						const isActive = !!active && active.has(`${r},${c}`);
						return (
							<Cell
								key={`${r},${c}`}
								r={r}
								c={c}
								color={colorFor ? colorFor(hex) : hex}
								active={isActive}
								dim={dimmed && !isActive}
								delay={intro ? `${colorDelay[hex] || 0}s` : undefined}
							/>
						);
					})
				)}
				{trail.length > 1 && (
					<svg
						className="piet-trail"
						viewBox={`0 0 ${cols} ${rows}`}
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<polyline points={trailPoints} />
						{head && <circle cx={head[1] + 0.5} cy={head[0] + 0.5} r="0.16" />}
					</svg>
				)}
			</div>
		);
	}
);

PietGrid.displayName = "PietGrid";

export default PietGrid;
