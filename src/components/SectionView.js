import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import SectionPage from "./SectionPage";
import { isValidSection } from "../constants/routes";
import { ROUTES } from "../constants/routes";

/**
 * Section View Component
 * Displays individual section pages with navigation
 */
const SectionView = () => {
	const navigate = useNavigate();
	const { section } = useParams();

	const handleBackToPortfolio = useCallback(() => {
		navigate(ROUTES.PORTFOLIO);
	}, [navigate]);

	// Redirect to portfolio if invalid section
	if (!isValidSection(section)) {
		navigate(ROUTES.PORTFOLIO);
		return null;
	}

	return (
		<motion.div
			key={section}
			className="section-page"
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -50 }}
			transition={{ duration: 0.5 }}
		>
			<button
				className="back-to-portfolio-btn"
				onClick={handleBackToPortfolio}
				aria-label="Back to portfolio"
			>
				← Back to Portfolio
			</button>
			<SectionPage section={section} />
		</motion.div>
	);
};

export default SectionView;
