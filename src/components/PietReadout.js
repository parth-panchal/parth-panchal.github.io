import React from "react";

const DP_ARROWS = ["→", "↓", "←", "↑"];

/**
 * Live view of the Piet interpreter: what it printed and what it is doing.
 */
const PietReadout = ({ status, output, command, steps, dp, cc, stack, compact = false }) => {
	const visibleStack = stack.slice(-8);
	return (
		<div className={`piet-readout${compact ? " piet-readout--compact" : ""}`} aria-live="polite">
			<div className="piet-readout__stdout">
				<span className="piet-readout__prompt">stdout&gt;</span>
				<span className="piet-readout__text">{output.replace(/\n/g, "⏎")}</span>
				{status === "running" && <span className="piet-readout__caret" />}
			</div>
			<dl className="piet-readout__regs">
				<div>
					<dt>step</dt>
					<dd>{steps}</dd>
				</div>
				<div>
					<dt>op</dt>
					<dd>{command || "·"}</dd>
				</div>
				<div>
					<dt>dp</dt>
					<dd>{DP_ARROWS[dp]}</dd>
				</div>
				<div>
					<dt>cc</dt>
					<dd>{cc === 0 ? "left" : "right"}</dd>
				</div>
				<div className="piet-readout__stack">
					<dt>stack</dt>
					<dd>
						{stack.length > visibleStack.length && "… "}
						{visibleStack.length ? visibleStack.join(" ") : "empty"}
					</dd>
				</div>
			</dl>
		</div>
	);
};

export default PietReadout;
