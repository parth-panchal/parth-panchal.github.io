import React from "react";
import { motion } from "framer-motion";
import { ANIMATION } from "../constants/config";

/**
 * Mondrian Tile Component
 * Reusable tile for the portfolio grid with consistent animations and interactions
 */
const MondrianTile = React.memo(
	({
		section,
		title,
		description,
		className,
		animationDelay,
		animationDirection,
		onClick,
		isHero = false,
	}) => {
		// Determine initial animation values based on direction
		const getInitialValues = () => {
			if (animationDirection.y !== undefined) {
				return { opacity: 0, y: animationDirection.y };
			}
			if (animationDirection.x !== undefined) {
				return { opacity: 0, x: animationDirection.x };
			}
			if (animationDirection.scale !== undefined) {
				return { opacity: 0, scale: animationDirection.scale };
			}
			return { opacity: 0 };
		};

		// Determine animate values (everything goes to default)
		const getAnimateValues = () => {
			if (animationDirection.y !== undefined) {
				return { opacity: 1, y: 0 };
			}
			if (animationDirection.x !== undefined) {
				return { opacity: 1, x: 0 };
			}
			if (animationDirection.scale !== undefined) {
				return { opacity: 1, scale: 1 };
			}
			return { opacity: 1 };
		};

		return (
			<motion.div
				className={`mondrian-tile ${className} clickable-tile`}
				initial={getInitialValues()}
				animate={getAnimateValues()}
				transition={{
					delay: animationDelay,
					duration: ANIMATION.DURATIONS.MEDIUM,
				}}
				onClick={onClick}
				data-blobity-magnetic="true"
				data-blobity="true"
				data-blobity-radius="0"
				role="button"
				tabIndex={0}
				aria-label={`Navigate to ${title}`}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onClick();
					}
				}}
			>
				{isHero ? (
					<>
						<h1>{title}</h1>
						<p>{description}</p>
					</>
				) : (
					<>
						<h2>{title}</h2>
						<p className="tile-description">{description}</p>
					</>
				)}
			</motion.div>
		);
	}
);

MondrianTile.displayName = "MondrianTile";

export default MondrianTile;
