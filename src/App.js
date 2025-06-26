import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
	Link,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { BlobityProvider } from "./components";
import {
	ArtView,
	Portfolio,
	About,
	Projects,
	Skills,
	Experience,
	Contact,
	Misc,
} from "./pages";

/**
 * Pure Art Portfolio - Piet-inspired Interactive Experience
 *
 * The artwork is the hero. Click the center to reveal the Mondrian-inspired portfolio.
 */

const AppContent = () => {
	const location = useLocation();
	const isArtView = location.pathname === "/";

	return (
		<div className="App">
			<BlobityProvider isArtView={isArtView} />
			<AnimatePresence mode="wait">
				{!isArtView && (
					<Link to="/" className="back-to-art-btn">
						← Back to Art
					</Link>
				)}
				<Routes>
					<Route path="/" element={<ArtView />} />
					<Route
						path="/portfolio"
						element={
							<motion.div
								key="portfolio"
								className="portfolio-view"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.1 }}
								transition={{
									duration: 0.6,
									ease: "easeInOut",
								}}
							>
								<Portfolio />
							</motion.div>
						}
					/>
					<Route
						path="/about"
						element={
							<motion.div
								key="about"
								className="portfolio-view"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.1 }}
								transition={{
									duration: 0.6,
									ease: "easeInOut",
								}}
							>
								<About />
							</motion.div>
						}
					/>
					<Route
						path="/projects"
						element={
							<motion.div
								key="projects"
								className="portfolio-view"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.1 }}
								transition={{
									duration: 0.6,
									ease: "easeInOut",
								}}
							>
								<Projects />
							</motion.div>
						}
					/>
					<Route
						path="/skills"
						element={
							<motion.div
								key="skills"
								className="portfolio-view"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.1 }}
								transition={{
									duration: 0.6,
									ease: "easeInOut",
								}}
							>
								<Skills />
							</motion.div>
						}
					/>
					<Route
						path="/experience"
						element={
							<motion.div
								key="experience"
								className="portfolio-view"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.1 }}
								transition={{
									duration: 0.6,
									ease: "easeInOut",
								}}
							>
								<Experience />
							</motion.div>
						}
					/>
					<Route
						path="/contact"
						element={
							<motion.div
								key="contact"
								className="portfolio-view"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.1 }}
								transition={{
									duration: 0.6,
									ease: "easeInOut",
								}}
							>
								<Contact />
							</motion.div>
						}
					/>
					<Route
						path="/misc"
						element={
							<motion.div
								key="misc"
								className="portfolio-view"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.1 }}
								transition={{
									duration: 0.6,
									ease: "easeInOut",
								}}
							>
								<Misc />
							</motion.div>
						}
					/>
				</Routes>
			</AnimatePresence>
		</div>
	);
};

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

export default App;
