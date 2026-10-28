import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PietGrid from "./PietGrid";
import PietReadout from "./PietReadout";
import usePietRunner from "../piet/usePietRunner";
import { toDeStijl } from "../piet/palette";
import { PIET_COLOR_GRID } from "../constants/pietData";
import { ANIMATION } from "../constants/config";
import { ROUTES } from "../constants/routes";

/**
 * Art View Component (/hello)
 * Thomas Schoch's Piet "Hello, world!", shown as a work: nothing moves until
 * the visitor runs it. The program then executes on the site's interpreter and,
 * when it halts, folds into De Stijl colours and stays there.
 */
const ArtView = () => {
	const navigate = useNavigate();
	const [folded, setFolded] = useState(false);
	const timersRef = useRef([]);

	const clearTimers = useCallback(() => {
		timersRef.current.forEach(clearTimeout);
		timersRef.current = [];
	}, []);

	const handleHalt = useCallback(() => {
		timersRef.current.push(setTimeout(() => setFolded(true), ANIMATION.HALT_HOLD_MS));
	}, []);

	const runner = usePietRunner(PIET_COLOR_GRID, {
		pace: ANIMATION.PAINTING_PACE,
		onHalt: handleHalt,
	});
	const { status, start } = runner;
	const idle = status === "idle";
	const running = status === "running";

	const run = useCallback(() => {
		clearTimers();
		setFolded(false);
		start();
	}, [start, clearTimers]);

	const toPortfolio = useCallback(() => navigate(ROUTES.HOME), [navigate]);

	useEffect(() => clearTimers, [clearTimers]);

	useEffect(() => {
		const onKey = (e) => {
			// Links and buttons keep their own keyboard behaviour
			if (e.target.closest && e.target.closest("a, button")) return;
			if ((e.key === "Enter" || e.key === " ") && !running) {
				e.preventDefault();
				run();
			} else if (e.key === "Escape") {
				toPortfolio();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [running, run, toPortfolio]);

	return (
		<div className={`art-view${folded ? " is-folded" : ""}`}>
			<div className="art-stage">
				<div
					role="button"
					tabIndex={running ? -1 : 0}
					className={`art-canvas${running ? "" : " is-idle"}`}
					onClick={running ? undefined : run}
					aria-label={running ? "The painting is running" : "Run the painting"}
				>
					<PietGrid
						grid={PIET_COLOR_GRID}
						active={folded || idle ? undefined : runner.active}
						trail={folded ? [] : runner.trail}
						dimmed={running}
						colorFor={folded ? toDeStijl : undefined}
						intro
						className="art-grid"
						ariaLabel={'Thomas Schoch\'s Piet program "Hello, world!"'}
					/>
				</div>

				<aside className="art-caption">
					<p className="art-eyebrow">Piet · 13 × 13 codels</p>
					<h1 className="art-title">“Hello, world!”</h1>
					<p className="art-credit">Thomas Schoch, after Piet Mondrian</p>

					{idle ? (
						<div key="idle" className="art-panel">
							<p className="art-lede">
								This painting is a program. Every change of colour is an instruction.
							</p>
							<div className="art-actions">
								<button type="button" className="btn btn--solid" onClick={run}>
									▶ Run it
								</button>
							</div>
						</div>
					) : (
						<div key="running" className="art-panel">
							<PietReadout {...runner} />
							<p className={`art-fold-note${folded ? " is-visible" : ""}`}>
								…and when it halts, it becomes a Mondrian.
							</p>
							{folded && (
								<div className="art-actions art-actions--after">
									<button type="button" className="btn btn--solid" onClick={run}>
										↺ Run again
									</button>
								</div>
							)}
						</div>
					)}

					{/* Always there, so there's a way back even mid-run */}
					<p className="art-more">
						<Link to={ROUTES.HOME}>← Portfolio</Link>
						<span aria-hidden="true"> · </span>
						<Link to={ROUTES.INSPIRATION}>How it works</Link>
					</p>
				</aside>
			</div>
		</div>
	);
};

export default ArtView;
