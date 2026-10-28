import { useCallback, useEffect, useRef, useState } from "react";
import { createPiet } from "./interpreter";

const TRAIL_LENGTH = 28;

const IDLE = {
	status: "idle", // idle | running | halted | stopped
	active: new Set(),
	trail: [],
	output: "",
	stack: [],
	dp: 0,
	cc: 0,
	steps: 0,
	command: null,
};

/**
 * Step a Piet program on a timer so the instruction pointer can be animated.
 * @param {string[][]} grid - Colour grid to execute
 * @param {object} options
 * @param {(step: number) => number} options.pace - Milliseconds to wait before a given step
 * @param {number} options.maxSteps - Safety stop for programs that never halt
 * @param {() => void} options.onHalt - Called once when the program halts
 */
const usePietRunner = (grid, { pace, maxSteps = 3000, onHalt } = {}) => {
	const [snapshot, setSnapshot] = useState(IDLE);
	const vmRef = useRef(null);
	const timerRef = useRef(null);
	const trailRef = useRef([]);
	const onHaltRef = useRef(onHalt);
	const paceRef = useRef(pace);
	onHaltRef.current = onHalt;
	paceRef.current = pace;

	const clear = () => {
		clearTimeout(timerRef.current);
		timerRef.current = null;
	};

	const advance = useCallback(() => {
		const vm = vmRef.current;
		if (!vm) return false;
		const event = vm.step();
		if (event.path) {
			trailRef.current = [...trailRef.current, ...event.path].slice(
				-TRAIL_LENGTH
			);
		}
		const { state } = vm;
		const halted = event.halted || state.steps >= maxSteps;
		const cells = event.to || event.from;
		setSnapshot({
			status: event.halted ? "halted" : halted ? "stopped" : "running",
			active: new Set(cells.map(([r, c]) => `${r},${c}`)),
			trail: trailRef.current,
			output: state.output,
			stack: [...state.stack],
			dp: state.dp,
			cc: state.cc,
			steps: state.steps,
			command: event.command ?? null,
		});
		if (event.halted && onHaltRef.current) onHaltRef.current(state.output);
		return !halted;
	}, [maxSteps]);

	const loop = useCallback(() => {
		if (!advance()) {
			clear();
			return;
		}
		const steps = vmRef.current.state.steps;
		const delay = paceRef.current ? paceRef.current(steps) : 60;
		timerRef.current = setTimeout(loop, delay);
	}, [advance]);

	const start = useCallback(() => {
		clear();
		vmRef.current = createPiet(grid);
		trailRef.current = [];
		setSnapshot({ ...IDLE, status: "running" });
		const delay = paceRef.current ? paceRef.current(0) : 60;
		timerRef.current = setTimeout(loop, delay);
	}, [grid, loop]);

	// Single-step for the studio; starts a fresh run if nothing is loaded
	const stepOnce = useCallback(() => {
		clear();
		if (!vmRef.current || vmRef.current.state.halted) {
			vmRef.current = createPiet(grid);
			trailRef.current = [];
		}
		advance();
	}, [grid, advance]);

	const stop = useCallback(() => {
		clear();
		setSnapshot((s) =>
			s.status === "running" ? { ...s, status: "stopped" } : s
		);
	}, []);

	const reset = useCallback(() => {
		clear();
		vmRef.current = null;
		trailRef.current = [];
		setSnapshot(IDLE);
	}, []);

	useEffect(() => clear, []);

	return { ...snapshot, start, stop, reset, stepOnce };
};

export default usePietRunner;
