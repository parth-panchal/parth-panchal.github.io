import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { UNIQUE_COLORS } from "../constants/pietData";
import { ANIMATION } from "../constants/config";

/**
 * Interactive grid component representing the Piet artwork
 * Optimized with React.memo and cached color computations
 */
const PietGrid = React.memo(
	({
		pietColorGrid,
		onCellClick,
		centerRow,
		centerCol,
		isArtView = false,
	}) => {
		// Create a mapping of colors to their animation delay
		// Only recompute if pietColorGrid changes (which it won't, but good practice)
		const colorDelayMap = useMemo(() => {
			const map = {};
			UNIQUE_COLORS.forEach((color, index) => {
				map[color] = index * ANIMATION.COLOR_GROUP_STAGGER;
			});
			return map;
		}, []);

		return (
			<div className={`piet-grid ${isArtView ? "art-view-grid" : ""}`}>
				{pietColorGrid.map((row, rowIndex) =>
					row.map((color, colIndex) => {
						// Check if this is the center cell
						const isCenterCell =
							rowIndex === centerRow &&
							colIndex === centerCol;

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
								aria-label={
									isCenterCell
										? "Enter portfolio"
										: undefined
								}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{
									opacity: 1,
									scale: 1,
								}}
								transition={{
									duration: ANIMATION.DURATIONS.FAST,
									delay: colorDelay,
									ease: ANIMATION.EASING,
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
	}
);

PietGrid.displayName = "PietGrid";

export default PietGrid;
