import { classifyColor } from "./interpreter";
import { DE_STIJL } from "../constants/config";

// The 20 Piet colours, grouped light / normal / dark per hue (spec values)
export const PIET_PALETTE = [
	["#FFC0C0", "#FFFFC0", "#C0FFC0", "#C0FFFF", "#C0C0FF", "#FFC0FF"],
	["#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
	["#C00000", "#C0C000", "#00C000", "#00C0C0", "#0000C0", "#C000C0"],
];
export const PIET_WHITE = "#FFFFFF";
export const PIET_BLACK = "#000000";

// Hue index -> De Stijl primary (red, yellow, green, cyan, blue, magenta)
const HUE_TO_PRIMARY = [
	DE_STIJL.RED,
	DE_STIJL.YELLOW,
	DE_STIJL.YELLOW,
	DE_STIJL.BLUE,
	DE_STIJL.BLUE,
	DE_STIJL.RED,
];

/**
 * Fold a Piet colour into Mondrian's palette: light shades become paper,
 * saturated ones collapse to the nearest primary, black stays a line.
 */
export const toDeStijl = (hex) => {
	const color = classifyColor(hex);
	if (color.kind === "black") return DE_STIJL.INK;
	if (color.kind === "white" || color.light === 0) return DE_STIJL.PAPER;
	return HUE_TO_PRIMARY[color.hue];
};
