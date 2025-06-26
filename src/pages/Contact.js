import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Contact = () => {
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
			<div className="section-content contact-content">
				<h1>Get In Touch</h1>
				<div className="contact-layout">
					<div className="contact-info">
						<h2>Let's connect</h2>
						<div className="coming-soon-message">
							<p>Contact information and form coming soon.</p>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default Contact;
