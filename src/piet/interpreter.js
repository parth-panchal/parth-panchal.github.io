// Piet interpreter
// Spec: https://www.dangermouse.net/esoteric/piet.html
//
// Runs one step at a time so the UI can animate the instruction pointer.
// Lightness accepts both the spec's C0 and the B4 shade used in some renderings.

// [hue steps][lightness steps]
const COMMANDS = [
	[null, "push", "pop"],
	["add", "subtract", "multiply"],
	["divide", "mod", "not"],
	["greater", "pointer", "switch"],
	["duplicate", "roll", "in(number)"],
	["in(char)", "out(number)", "out(char)"],
];

// DP: 0 right, 1 down, 2 left, 3 up
const DR = [0, 1, 0, -1];
const DC = [1, 0, -1, 0];

/**
 * Classify a hex color as a Piet colour.
 * @returns {{kind: "white"|"black"|"color", hue?: number, light?: number}}
 */
export const classifyColor = (hex) => {
	const h = hex.replace("#", "").toUpperCase();
	const channels = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
	const levels = channels.map((v) => (v > 220 ? 2 : v > 100 ? 1 : 0));
	const key = levels.join("");

	if (key === "222") return { kind: "white" };
	if (key === "000") return { kind: "black" };

	// Light colours mix full (2) and mid (1); normal mix full and zero; dark mix mid and zero
	const max = Math.max(...levels);
	const min = Math.min(...levels);
	let light;
	let pattern;
	if (max === 2 && min === 1) {
		light = 0;
		pattern = levels.map((l) => (l === 2 ? 1 : 0));
	} else if (max === 2 && min === 0) {
		light = 1;
		pattern = levels.map((l) => (l === 2 ? 1 : 0));
	} else if (max === 1 && min === 0) {
		light = 2;
		pattern = levels.map((l) => (l === 1 ? 1 : 0));
	} else {
		return { kind: "black" };
	}

	const hueByPattern = {
		100: 0, // red
		110: 1, // yellow
		"010": 2, // green
		"011": 3, // cyan
		"001": 4, // blue
		101: 5, // magenta
	};
	const hue = hueByPattern[pattern.join("")];
	if (hue === undefined) return { kind: "black" };
	return { kind: "color", hue, light };
};

/**
 * Decode the command for a transition between two colours.
 */
export const commandFor = (from, to) => {
	const hueSteps = (to.hue - from.hue + 6) % 6;
	const lightSteps = (to.light - from.light + 3) % 3;
	return COMMANDS[hueSteps][lightSteps];
};

/**
 * Create an interpreter over a 2D array of hex colours.
 * Call step() repeatedly; it returns an event describing what happened.
 */
export const createPiet = (grid, { input = [] } = {}) => {
	const rows = grid.length;
	const cols = Math.max(...grid.map((r) => r.length));
	const cell = (r, c) => {
		if (r < 0 || c < 0 || r >= rows || c >= cols) return { kind: "black" };
		const hex = grid[r][c];
		return hex ? classifyColor(hex) : { kind: "black" };
	};

	const blockCache = new Map();
	// Flood-fill the colour block containing (r, c)
	const blockAt = (r, c) => {
		const id = `${r},${c}`;
		if (blockCache.has(id)) return blockCache.get(id);
		const target = grid[r][c].toUpperCase();
		const cells = [];
		const seen = new Set([id]);
		const queue = [[r, c]];
		while (queue.length) {
			const [cr, cc] = queue.pop();
			cells.push([cr, cc]);
			for (let d = 0; d < 4; d++) {
				const nr = cr + DR[d];
				const nc = cc + DC[d];
				const nid = `${nr},${nc}`;
				if (
					nr >= 0 &&
					nc >= 0 &&
					nr < rows &&
					nc < grid[nr].length &&
					!seen.has(nid) &&
					grid[nr][nc] &&
					grid[nr][nc].toUpperCase() === target
				) {
					seen.add(nid);
					queue.push([nr, nc]);
				}
			}
		}
		const block = { cells, size: cells.length };
		cells.forEach(([br, bc]) => blockCache.set(`${br},${bc}`, block));
		return block;
	};

	// The codel a block exits from, given DP and CC
	const exitCodel = (block, dp, cc) => {
		const score = ([r, c]) => r * DR[dp] + c * DC[dp];
		const best = Math.max(...block.cells.map(score));
		const edge = block.cells.filter((p) => score(p) === best);
		// CC left is DP rotated counterclockwise, right is clockwise
		const side = cc === 0 ? (dp + 3) % 4 : (dp + 1) % 4;
		const sideScore = ([r, c]) => r * DR[side] + c * DC[side];
		return edge.reduce((a, b) => (sideScore(b) > sideScore(a) ? b : a));
	};

	const state = {
		pos: [0, 0],
		dp: 0,
		cc: 0,
		stack: [],
		output: "",
		halted: false,
		steps: 0,
	};
	const inputQueue = [...input];

	const execute = (command, size) => {
		const s = state.stack;
		const need = (n) => s.length >= n;
		switch (command) {
			case "push":
				s.push(size);
				break;
			case "pop":
				if (need(1)) s.pop();
				break;
			case "add":
			case "subtract":
			case "multiply":
			case "divide":
			case "mod":
			case "greater": {
				if (!need(2)) break;
				const b = s[s.length - 1];
				const a = s[s.length - 2];
				if ((command === "divide" || command === "mod") && b === 0) break;
				s.length -= 2;
				if (command === "add") s.push(a + b);
				if (command === "subtract") s.push(a - b);
				if (command === "multiply") s.push(a * b);
				if (command === "divide") s.push(Math.floor(a / b));
				if (command === "mod") s.push(((a % b) + b) % b);
				if (command === "greater") s.push(a > b ? 1 : 0);
				break;
			}
			case "not":
				if (need(1)) s.push(s.pop() === 0 ? 1 : 0);
				break;
			case "pointer":
				if (need(1)) state.dp = (((state.dp + s.pop()) % 4) + 4) % 4;
				break;
			case "switch":
				if (need(1)) state.cc = (state.cc + Math.abs(s.pop())) % 2;
				break;
			case "duplicate":
				if (need(1)) s.push(s[s.length - 1]);
				break;
			case "roll": {
				if (!need(2)) break;
				const rolls = s[s.length - 1];
				const depth = s[s.length - 2];
				if (depth < 0 || depth > s.length - 2) break;
				s.length -= 2;
				if (depth === 0) break;
				const slice = s.splice(s.length - depth, depth);
				const n = ((rolls % depth) + depth) % depth;
				s.push(...slice.slice(depth - n), ...slice.slice(0, depth - n));
				break;
			}
			case "in(number)":
			case "in(char)": {
				const value = inputQueue.shift();
				if (value === undefined) break;
				s.push(
					command === "in(char)" && typeof value === "string"
						? value.codePointAt(0)
						: Number(value)
				);
				break;
			}
			case "out(number)":
				if (need(1)) state.output += String(s.pop());
				break;
			case "out(char)":
				if (need(1)) state.output += String.fromCodePoint(s.pop());
				break;
			default:
				break;
		}
	};

	/**
	 * Advance one colour block.
	 * @returns {{halted: boolean, from: number[][], to?: number[][], command?: string|null, printed?: string, path?: number[][]}}
	 */
	const step = () => {
		if (state.halted) return { halted: true, from: [] };
		const [r, c] = state.pos;
		const start = cell(r, c);

		if (start.kind === "white") {
			// Starting on white: slide like any other white run
			return slideWhite([[r, c]], []);
		}

		const block = blockAt(r, c);
		for (let attempt = 0; attempt < 8; attempt++) {
			const [er, ec] = exitCodel(block, state.dp, state.cc);
			const nr = er + DR[state.dp];
			const nc = ec + DC[state.dp];
			const next = cell(nr, nc);
			if (next.kind === "black") {
				if (attempt % 2 === 0) state.cc = 1 - state.cc;
				else state.dp = (state.dp + 1) % 4;
				continue;
			}
			if (next.kind === "white") {
				return slideWhite([[nr, nc]], block.cells);
			}
			const command = commandFor(start, next);
			const before = state.output.length;
			execute(command, block.size);
			state.pos = [nr, nc];
			state.steps += 1;
			return {
				halted: false,
				from: block.cells,
				to: blockAt(nr, nc).cells,
				command,
				printed: state.output.slice(before),
				path: [[er, ec], [nr, nc]],
			};
		}
		state.halted = true;
		return { halted: true, from: block.cells };
	};

	// Slide through white codels in DP direction until a colour block is reached
	const slideWhite = (path, fromCells) => {
		const visited = new Set();
		let [r, c] = path[path.length - 1];
		for (;;) {
			const key = `${r},${c},${state.dp},${state.cc}`;
			if (visited.has(key)) {
				state.halted = true;
				return { halted: true, from: fromCells, path };
			}
			visited.add(key);
			const nr = r + DR[state.dp];
			const nc = c + DC[state.dp];
			const next = cell(nr, nc);
			if (next.kind === "white") {
				[r, c] = [nr, nc];
				path.push([r, c]);
			} else if (next.kind === "black") {
				state.cc = 1 - state.cc;
				state.dp = (state.dp + 1) % 4;
			} else {
				state.pos = [nr, nc];
				state.steps += 1;
				return {
					halted: false,
					from: fromCells,
					to: blockAt(nr, nc).cells,
					command: null,
					printed: "",
					path: [...path, [nr, nc]],
				};
			}
		}
	};

	return {
		step,
		get state() {
			return state;
		},
	};
};

/**
 * Run a program to completion (or until maxSteps) and return its output.
 */
export const runPiet = (grid, { maxSteps = 10000, input } = {}) => {
	const vm = createPiet(grid, { input });
	while (!vm.state.halted && vm.state.steps < maxSteps) vm.step();
	return vm.state.output;
};
