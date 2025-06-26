import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Portfolio = () => {
	return (
		<motion.div
			className="mondrian-portfolio"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="mondrian-grid">
				{/* Hero Section - Now clickable for About */}
				<motion.div
					className="mondrian-tile hero-tile clickable-tile"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.2,
						duration: 0.4,
					}}
					data-blobity-magnetic="true"
					data-blobity="true"
					data-blobity-radius="0"
				>
					<Link to="/about" className="tile-link">
						<h1>Parth Panchal</h1>
						<p>Tech | Movies | Quizzing | Photography</p>
					</Link>
				</motion.div>

				{/* Projects Tile - Clickable */}
				<motion.div
					className="mondrian-tile projects-tile clickable-tile"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						delay: 0.4,
						duration: 0.4,
					}}
					data-blobity-magnetic="true"
					data-blobity="true"
					data-blobity-radius="0"
				>
					<Link to="/projects" className="tile-link">
						<h2>Projects</h2>
						<p className="tile-description">
							Click to explore my work
						</p>
					</Link>
				</motion.div>

				{/* Skills Tile - Clickable */}
				<motion.div
					className="mondrian-tile skills-tile clickable-tile"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						delay: 0.6,
						duration: 0.4,
					}}
					data-blobity-magnetic="true"
					data-blobity="true"
					data-blobity-radius="0"
				>
					<Link to="/skills" className="tile-link">
						<h2>Skills</h2>
						<p className="tile-description">View my expertise</p>
					</Link>
				</motion.div>

				{/* Experience Tile - Clickable */}
				<motion.div
					className="mondrian-tile experience-tile clickable-tile"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.8,
						duration: 0.4,
					}}
					data-blobity-magnetic="true"
					data-blobity="true"
					data-blobity-radius="0"
				>
					<Link to="/experience" className="tile-link">
						<h2>Experience</h2>
						<p className="tile-description">
							Professional background
						</p>
					</Link>
				</motion.div>

				{/* Contact Tile - Clickable */}
				<motion.div
					className="mondrian-tile contact-tile clickable-tile"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						delay: 1.0,
						duration: 0.4,
					}}
					data-blobity-magnetic="true"
					data-blobity="true"
					data-blobity-radius="0"
				>
					<Link to="/contact" className="tile-link">
						<h2>Contact</h2>
						<p className="tile-description">Get in touch</p>
					</Link>
				</motion.div>

				{/* Misc Tile - Clickable */}
				<motion.div
					className="mondrian-tile misc-tile clickable-tile"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						delay: 1.2,
						duration: 0.4,
					}}
					data-blobity-magnetic="true"
					data-blobity="true"
					data-blobity-radius="0"
				>
					<Link to="/misc" className="tile-link">
						<h2>Misc</h2>
						<p className="tile-description">
							Explore random things
						</p>
					</Link>
				</motion.div>

				{/* Decorative colored tiles */}
				<motion.div
					className="mondrian-tile color-tile red"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						delay: 1.4,
						duration: 0.4,
					}}
					data-blobity="true"
					data-blobity-magnetic="true"
					data-blobity-radius="0"
				></motion.div>

				<motion.div
					className="mondrian-tile color-tile blue"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						delay: 1.6,
						duration: 0.4,
					}}
					data-blobity="true"
					data-blobity-magnetic="true"
					data-blobity-radius="0"
				></motion.div>

				<motion.div
					className="mondrian-tile color-tile yellow"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						delay: 1.8,
						duration: 0.4,
					}}
					data-blobity="true"
					data-blobity-magnetic="true"
					data-blobity-radius="0"
				></motion.div>
			</div>
		</motion.div>
	);
};

export default Portfolio;
