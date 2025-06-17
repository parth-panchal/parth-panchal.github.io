import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { getUniqueColors } from "../constants/pietData";

/**
 * Interactive grid component representing the Piet artwork
 * Now with dynamic sizing and center-click functionality
 */
const PietGrid = ({
	pietColorGrid,
	onCellClick,
	centerRow = 6,
	centerCol = 6,
	isArtView = false,
}) => {
	// Get unique colors and create animation timing map
	const uniqueColors = useMemo(() => getUniqueColors(), []);

	// Create a mapping of colors to their animation delay
	const colorDelayMap = useMemo(() => {
		const map = {};
		uniqueColors.forEach((color, index) => {
			map[color] = index * 0.3; // Each color group animates 0.3s after the previous for clear distinction
		});
		return map;
	}, [uniqueColors]);

	return (
		<div className={`piet-grid ${isArtView ? "art-view-grid" : ""}`}>
			{pietColorGrid.map((row, rowIndex) =>
				row.map((color, colIndex) => {
					// Check if this is the center cell
					const isCenterCell =
						rowIndex === centerRow && colIndex === centerCol;

					// Get the delay for this color group
					const colorDelay = colorDelayMap[color] || 0;

					return (
						<motion.div
							key={`${rowIndex}-${colIndex}`}
							className={`grid-cell ${
								isCenterCell ? "center-cell" : ""
							}`}
							style={{ backgroundColor: color }}
							onClick={() =>
								onCellClick &&
								onCellClick(color, rowIndex, colIndex)
							}
							title={
								isCenterCell
									? "Click to enter portfolio"
									: "Piet artwork cell"
							}
							data-blobity-tooltip={
								isCenterCell ? "Enter Portfolio" : ""
							}
							data-blobity-magnetic="false"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{
								opacity: 1,
								scale: 1,
							}}
							transition={{
								duration: 0.3,
								delay: colorDelay,
								ease: "easeInOut",
							}}
							whileHover={
								isCenterCell
									? {
											scale: 1.05,
											boxShadow:
												"0 0 20px rgba(255, 255, 255, 0.8)",
											transition: { duration: 0.1 },
									  }
									: {
											scale: 1.02,
											transition: { duration: 0.1 },
									  }
							}
							whileTap={{
								scale: 0.95,
								transition: { duration: 0.05 },
							}}
						/>
					);
				})
			)}
		</div>
	);
};

export default PietGrid;
