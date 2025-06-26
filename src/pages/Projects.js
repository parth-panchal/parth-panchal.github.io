import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Projects = () => {
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
			<div className="section-content projects-content">
				<h1>Projects</h1>
				<div className="coming-soon-message">
					<h2>Coming Soon</h2>
					<p>
						Portfolio projects are currently being curated and will
						be available soon.
					</p>
				</div>
			</div>
		</motion.div>
	);
};

export default Projects;
