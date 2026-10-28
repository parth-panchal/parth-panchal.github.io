import { runPiet, createPiet, classifyColor, commandFor } from "./interpreter";
import { PIET_COLOR_GRID } from "../constants/pietData";

test("the landing painting prints Hello, world!", () => {
	expect(runPiet(PIET_COLOR_GRID)).toBe("Hello, world!\n");
});

test("classifies the spec colours", () => {
	expect(classifyColor("#FFC0C0")).toEqual({ kind: "color", hue: 0, light: 0 });
	expect(classifyColor("#00FF00")).toEqual({ kind: "color", hue: 2, light: 1 });
	expect(classifyColor("#C000C0")).toEqual({ kind: "color", hue: 5, light: 2 });
	expect(classifyColor("#FFFFFF").kind).toBe("white");
	expect(classifyColor("#000000").kind).toBe("black");
});

test("decodes commands from hue and lightness change", () => {
	const red = classifyColor("#FF0000");
	expect(commandFor(red, classifyColor("#C00000"))).toBe("push");
	expect(commandFor(red, classifyColor("#C0C000"))).toBe("subtract");
	expect(commandFor(red, classifyColor("#FFC0FF"))).toBe("out(char)");
});

test("push, multiply and print a character", () => {
	const R = "#FF0000";
	const DR = "#C00000";
	// 8 red -> dark red: push 8; 9 dark red -> light red: push 9;
	// light red -> dark yellow: multiply (72); dark yellow -> red: out(char) "H"
	const row = [
		...Array(8).fill(R),
		...Array(9).fill(DR),
		"#FFC0C0",
		"#C0C000",
		R,
		"#000000",
	];
	const vm = createPiet([row]);
	for (let i = 0; i < 4; i++) vm.step();
	expect(vm.state.output).toBe("H");
	expect(vm.state.stack).toEqual([]);
});
