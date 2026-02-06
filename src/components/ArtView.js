import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PietGrid from "./PietGrid";
import { PIET_COLOR_GRID } from "../constants/pietData";
import { GRID_CONFIG } from "../constants/config";
import { ROUTES } from "../constants/routes";

/**
 * Art View Component
 * Pure Piet-inspired grid view (landing page)
 */
const ArtView = () => {
	const navigate = useNavigate();

	// Handle center cell click to navigate to portfolio
	const handleCellClick = useCallback(
		(color, rowIndex, colIndex) => {
			// Only the center cell opens the portfolio
			if (
				rowIndex === GRID_CONFIG.CENTER_ROW &&
				colIndex === GRID_CONFIG.CENTER_COL
			) {
				navigate(ROUTES.PORTFOLIO);
			}
		},
		[navigate]
	);

	return (
		<motion.div
			key="art"
			className="art-view"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<PietGrid
				pietColorGrid={PIET_COLOR_GRID}
				onCellClick={handleCellClick}
				centerRow={GRID_CONFIG.CENTER_ROW}
				centerCol={GRID_CONFIG.CENTER_COL}
				isArtView={true}
			/>
		</motion.div>
	);
};

export default ArtView;
