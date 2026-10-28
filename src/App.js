import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyMotion, MotionConfig } from "framer-motion";
import "./App.css";
import { ErrorBoundary, Composition } from "./components";
import { ROUTES } from "./constants/routes";
import { warmSymbolFonts } from "./fontWarmup";

// The painting (and its Piet interpreter) is a detour, not the home page
const loadArtView = () => import("./components/ArtView");
const ArtView = lazy(loadArtView);

// Framer's animation engine arrives just after the first paint; `m` components
// render immediately and start animating once it lands. strict: a stray
// `motion.*` (which would bundle everything up front) throws in development.
const loadMotionFeatures = () => import("./motionFeatures").then((mod) => mod.default);

/**
 * Pure Art Portfolio - Piet-inspired Interactive Experience
 *
 * The home page is a Mondrian composition; every section opens inside it.
 * /hello plays the runnable Piet painting the composition's colours come from.
 */
function App() {
	// Fetch the painting's code when idle, so following a link to it never
	// shows an empty frame while the chunk loads
	useEffect(() => {
		const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
		const cancel = window.cancelIdleCallback || clearTimeout;
		const handle = idle(loadArtView, { timeout: 3000 });
		warmSymbolFonts();
		return () => cancel(handle);
	}, []);

	return (
		// reducedMotion="user" turns transform animations into instant changes when the OS asks for less motion
		<LazyMotion features={loadMotionFeatures} strict>
			<MotionConfig reducedMotion="user">
				<div className="App">
					<ErrorBoundary>
						{/* Switching view cuts to the new one, which fades in (CSS). No exit fades:
						    Framer's opacity exits flash the old view back for a frame as they finish.
						    The composition stays mounted across sections, so opening one animates
						    inside it rather than remounting. */}
						<Suspense fallback={null}>
							<Routes>
								<Route path={ROUTES.PAINTING} element={<ArtView />} />
								<Route path="*" element={<Composition />} />
							</Routes>
						</Suspense>
					</ErrorBoundary>
				</div>
			</MotionConfig>
		</LazyMotion>
	);
}

export default App;
