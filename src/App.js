import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { PIET_COLOR_GRID } from "./constants/pietData";
import { PietGrid, BlobityProvider } from "./components";

/**
 * Pure Art Portfolio - Piet-inspired Interactive Experience
 *
 * The artwork is the hero. Click the center to reveal the Mondrian-inspired portfolio.
 */
function App() {
	const [showPortfolio, setShowPortfolio] = useState(false);
	const [currentSection, setCurrentSection] = useState(null);

	// Center cell position in 13x13 grid (0-indexed)
	const centerRow = 6;
	const centerCol = 6;

	const handleCellClick = (color, rowIndex, colIndex) => {
		// Only the center cell opens the portfolio
		if (rowIndex === centerRow && colIndex === centerCol) {
			setShowPortfolio(true);
		}
	};

	const handleBackToArt = () => {
		setShowPortfolio(false);
		setCurrentSection(null);
	};

	const handleTileClick = (section) => {
		setCurrentSection(section);
	};

	const handleBackToPortfolio = () => {
		setCurrentSection(null);
	};

	const renderSectionContent = (section) => {
		switch (section) {
			case "projects":
				return (
					<div className="section-content projects-content">
						<h1>Projects</h1>
						<div className="coming-soon-message">
							<h2>Coming Soon</h2>
							<p>
								Portfolio projects are currently being curated
								and will be available soon.
							</p>
						</div>
					</div>
				);
			case "skills":
				return (
					<div className="section-content skills-content">
						<h1>Skills & Expertise</h1>
						<div className="coming-soon-message">
							<h2>Under Development</h2>
							<p>Skills showcase coming soon.</p>
						</div>
					</div>
				);
			case "about":
				return (
					<div className="section-content about-content">
						<h1>About Me</h1>
						<div className="about-layout">
							<div className="about-text">
								<h2>Hello, I'm Parth Panchal</h2>
								<div className="coming-soon-message">
									<p>
										More details about my background and
										experience coming soon.
									</p>
								</div>
							</div>
						</div>
					</div>
				);
			case "contact":
				return (
					<div className="section-content contact-content">
						<h1>Get In Touch</h1>
						<div className="contact-layout">
							<div className="contact-info">
								<h2>Let's connect</h2>
								<div className="coming-soon-message">
									<p>
										Contact information and form coming
										soon.
									</p>
								</div>
							</div>
						</div>
					</div>
				);
			case "experience":
				return (
					<div className="section-content experience-content">
						<h1>Experience</h1>
						<div className="coming-soon-message">
							<h2>Under Development</h2>
							<p>
								Professional experience and background coming
								soon.
							</p>
						</div>
					</div>
				);
			case "misc":
				return (
					<div className="section-content misc-content">
						<h1>Misc</h1>
						<div className="coming-soon-message">
							<h2>Coming Soon</h2>
							<p>Miscellaneous content and extras coming soon.</p>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="App">
			<BlobityProvider isArtView={!showPortfolio} />
			<AnimatePresence mode="wait">
				{!showPortfolio ? (
					// Pure Art View - Just the Grid
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
							centerRow={centerRow}
							centerCol={centerCol}
							isArtView={true}
						/>
					</motion.div>
				) : (
					// Portfolio View - Grid or Section Page
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
						>
							← Back to Art
						</button>

						<AnimatePresence mode="wait">
							{!currentSection ? (
								// Mondrian Grid - Portfolio Navigation
								<motion.div
									key="grid"
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
											onClick={() =>
												handleTileClick("about")
											}
											data-blobity-magnetic="true"
											data-blobity="true"
											data-blobity-radius="0"
										>
											<h1>Parth Panchal</h1>
											<p>
												Tech | Movies | Quizzing |
												Photography
											</p>
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
											onClick={() =>
												handleTileClick("projects")
											}
											data-blobity-magnetic="true"
											data-blobity="true"
											data-blobity-radius="0"
										>
											<h2>Projects</h2>
											<p className="tile-description">
												Click to explore my work
											</p>
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
											onClick={() =>
												handleTileClick("skills")
											}
											data-blobity-magnetic="true"
											data-blobity="true"
											data-blobity-radius="0"
										>
											<h2>Skills</h2>
											<p className="tile-description">
												View my expertise
											</p>
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
											onClick={() =>
												handleTileClick("experience")
											}
											data-blobity-magnetic="true"
											data-blobity="true"
											data-blobity-radius="0"
										>
											<h2>Experience</h2>
											<p className="tile-description">
												Professional background
											</p>
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
											onClick={() =>
												handleTileClick("contact")
											}
											data-blobity-magnetic="true"
											data-blobity="true"
											data-blobity-radius="0"
										>
											<h2>Contact</h2>
											<p className="tile-description">
												Get in touch
											</p>
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
											onClick={() =>
												handleTileClick("misc")
											}
											data-blobity-magnetic="true"
											data-blobity="true"
											data-blobity-radius="0"
										>
											<h2>Misc</h2>
											<p className="tile-description">
												Explore random things
											</p>
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
							) : (
								// Section Page View
								<motion.div
									key={currentSection}
									className="section-page"
									initial={{ opacity: 0, x: 50 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -50 }}
									transition={{ duration: 0.5 }}
								>
									<button
										className="back-to-portfolio-btn"
										onClick={handleBackToPortfolio}
									>
										← Back to Portfolio
									</button>
									{renderSectionContent(currentSection)}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default App;
