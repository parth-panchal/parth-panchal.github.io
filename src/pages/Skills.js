import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Skills = () => {
	return (
		<motion.div
			className="section-page"
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -50 }}
			transition={{ duration: 0.5 }}
		>
			<Link to="/portfolio" className="back-to-portfolio-btn">
				← Back to Portfolio
			</Link>
			<div className="section-content skills-content">
				<h1>Skills & Expertise</h1>
				<div className="coming-soon-message">
					<h2>Under Development</h2>
					<p>Skills showcase coming soon.</p>
				</div>
			</div>
		</motion.div>
	);
};

export default Skills;
