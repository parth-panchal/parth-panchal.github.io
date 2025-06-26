import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PIET_COLOR_GRID } from "../constants/pietData";
import { PietGrid } from "../components";

const ArtView = () => {
	const navigate = useNavigate();

	// Center cell position in 13x13 grid (0-indexed)
	const centerRow = 6;
	const centerCol = 6;

	const handleCellClick = (color, rowIndex, colIndex) => {
		// Only the center cell opens the portfolio
		if (rowIndex === centerRow && colIndex === centerCol) {
			navigate("/portfolio");
		}
	};

	return (
		<motion.div
			className="art-view"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<PietGrid
				pietColorGrid={PIET_COLOR_GRID}
				onCellClick={handleCellClick}
				centerRow={centerRow}
				centerCol={centerCol}
				isArtView={true}
			/>
		</motion.div>
	);
};

export default ArtView;
