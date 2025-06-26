import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const About = () => {
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
			<div className="section-content about-content">
				<h1>About Me</h1>
				<div className="about-layout">
					<div className="about-text">
						<h2>Hello, I'm Parth Panchal</h2>
						<div className="coming-soon-message">
							<p>
								More details about my background and experience
								coming soon.
							</p>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default About;
