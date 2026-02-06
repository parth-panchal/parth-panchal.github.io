import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MondrianTile from "./MondrianTile";
import { TILE_CONFIGS, COLOR_TILES, ANIMATION } from "../constants/config";
import { ROUTES } from "../constants/routes";

/**
 * Portfolio View Component
 * Mondrian-inspired grid with portfolio section tiles
 */
const PortfolioView = () => {
	const navigate = useNavigate();

	const handleTileClick = useCallback(
		(section) => {
			navigate(`/${section}`);
		},
		[navigate]
	);

	const handleBackToArt = useCallback(() => {
		navigate(ROUTES.HOME);
	}, [navigate]);

	return (
		<motion.div
			key="portfolio"
			className="portfolio-view"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 1.1 }}
			transition={{ duration: 0.6, ease: "easeInOut" }}
		>
			<button
				className="back-to-art-btn"
				onClick={handleBackToArt}
				aria-label="Back to art view"
			>
				← Back to Art
			</button>

			<motion.div
				key="grid"
				className="mondrian-portfolio"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.4 }}
			>
				<div className="mondrian-grid">
					{/* Render all portfolio tiles */}
					{TILE_CONFIGS.map((tile) => (
						<MondrianTile
							key={tile.section}
							section={tile.section}
							title={tile.title}
							description={tile.description}
							className={tile.className}
							animationDelay={tile.animationDelay}
							animationDirection={tile.animationDirection}
							onClick={() => handleTileClick(tile.section)}
							isHero={tile.isHero}
						/>
					))}

					{/* Decorative colored tiles */}
					{COLOR_TILES.map((colorTile) => (
						<motion.div
							key={colorTile.color}
							className={`mondrian-tile color-tile ${colorTile.color}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								delay: colorTile.delay,
								duration: ANIMATION.DURATIONS.MEDIUM,
							}}
							data-blobity="true"
							data-blobity-magnetic="true"
							data-blobity-radius="0"
							role="presentation"
						></motion.div>
					))}
				</div>
			</motion.div>
		</motion.div>
	);
};

export default PortfolioView;
