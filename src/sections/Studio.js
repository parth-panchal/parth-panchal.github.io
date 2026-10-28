import React, { useCallback, useEffect, useState } from "react";
import PietGrid from "../components/PietGrid";
import PietReadout from "../components/PietReadout";
import usePietRunner from "../piet/usePietRunner";
import { classifyColor, commandFor } from "../piet/interpreter";
import { PIET_PALETTE, PIET_WHITE, PIET_BLACK } from "../piet/palette";
import { PIET_COLOR_GRID } from "../constants/pietData";
import { ANIMATION, GRID_CONFIG } from "../constants/config";

const STORAGE_KEY = "piet-studio-v1";
const SIZE = GRID_CONFIG.SIZE;

const blank = () =>
	Array.from({ length: SIZE }, () => Array(SIZE).fill(PIET_WHITE));
const copy = (grid) => grid.map((row) => [...row]);

// The canvas is a per-visitor sketch, so browser storage is enough
const loadSketch = () => {
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
		if (Array.isArray(saved) && saved.length === SIZE) return saved;
	} catch {
		// Ignore unreadable storage and start from the front-page painting
	}
	return copy(PIET_COLOR_GRID);
};

const saveSketch = (grid) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
	} catch {
		// Storage can be unavailable; the sketch still works for this visit
	}
};

// Label for stepping from the selected colour into `hex`
const instructionFor = (from, hex) => {
	const to = classifyColor(hex);
	if (to.kind === "white") return "pass";
	if (to.kind === "black") return "wall";
	if (from.kind !== "color") return "";
	if (from.hue === to.hue && from.light === to.light) return "same";
	return commandFor(from, to);
};

/**
 * Piet sketchpad: paint codels, then run the program on the same interpreter
 * that runs the front-page painting.
 */
const Studio = () => {
	const [grid, setGrid] = useState(loadSketch);
	const [brush, setBrush] = useState(PIET_PALETTE[1][0]);
	const runner = usePietRunner(grid, {
		pace: ANIMATION.STUDIO_PACE,
		maxSteps: 3000,
	});
	const { status, reset } = runner;
	const running = status === "running";

	useEffect(() => saveSketch(grid), [grid]);

	const paint = useCallback(
		(r, c) => {
			setGrid((g) => {
				if (g[r][c] === brush) return g;
				const next = copy(g);
				next[r][c] = brush;
				return next;
			});
			reset();
		},
		[brush, reset]
	);

	const load = (next) => {
		reset();
		setGrid(next);
	};

	const from = classifyColor(brush);

	return (
		<div className="studio">
			<div className="studio__canvas">
				<PietGrid
					grid={grid}
					active={status === "idle" ? undefined : runner.active}
					trail={runner.trail}
					dimmed={running}
					onPaint={running ? undefined : paint}
					className="studio-grid"
					ariaLabel="Your Piet painting"
				/>
			</div>

			<div className="studio__tools">
				<p className="muted studio__hint">
					Pick a colour and paint. Each swatch shows the instruction
					you get by moving from your brush colour into it. Execution
					starts top-left.
				</p>

				<div className="palette" role="radiogroup" aria-label="Brush colour">
					{[...PIET_PALETTE.flat(), PIET_WHITE, PIET_BLACK].map((hex) => (
						<button
							type="button"
							key={hex}
							role="radio"
							aria-checked={brush === hex}
							className={`swatch${brush === hex ? " is-selected" : ""}`}
							style={{ "--swatch": hex }}
							onClick={() => setBrush(hex)}
							title={hex}
						>
							<span className="swatch__op">{instructionFor(from, hex)}</span>
						</button>
					))}
				</div>

				<div className="studio__actions">
					{running ? (
						<button type="button" className="btn btn--solid" onClick={runner.stop}>
							■ Stop
						</button>
					) : (
						<button type="button" className="btn btn--solid" onClick={runner.start}>
							▶ Run
						</button>
					)}
					<button type="button" className="btn btn--ghost" onClick={runner.stepOnce} disabled={running}>
						Step
					</button>
					<button type="button" className="btn btn--ghost" onClick={() => load(blank())}>
						Clear
					</button>
					<button type="button" className="btn btn--ghost" onClick={() => load(copy(PIET_COLOR_GRID))}>
						Hello, world!
					</button>
				</div>

				{status !== "idle" && <PietReadout {...runner} compact />}
				{status === "stopped" && runner.steps >= 3000 && (
					<p className="muted">Stopped after 3000 steps. It might loop forever.</p>
				)}
			</div>
		</div>
	);
};

export default Studio;
