import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import {
	BlobityProvider,
	ErrorBoundary,
	ArtView,
	PortfolioView,
	SectionView,
	Navigation,
} from "./components";
import { ROUTES } from "./constants/routes";

/**
 * Pure Art Portfolio - Piet-inspired Interactive Experience
 *
 * Refactored with React Router for proper URL navigation
 * The artwork is the hero. Click the center to reveal the Mondrian-inspired portfolio.
 */
function App() {
	const location = useLocation();

	// Determine if we're in art view based on current route
	const isArtView = location.pathname === ROUTES.HOME;

	return (
		<div className="App">
			<ErrorBoundary>
				<BlobityProvider isArtView={isArtView} />
				<Navigation />

				<AnimatePresence mode="wait">
					<Routes location={location} key={location.pathname}>
						{/* Art View - Pure Piet Grid */}
						<Route path={ROUTES.HOME} element={<ArtView />} />

						{/* Portfolio View - Mondrian Grid */}
						<Route
							path={ROUTES.PORTFOLIO}
							element={<PortfolioView />}
						/>

						{/* Section Views - Individual Pages */}
						<Route
							path="/:section"
							element={<SectionView />}
						/>
					</Routes>
				</AnimatePresence>
			</ErrorBoundary>
		</div>
	);
}

export default App;
