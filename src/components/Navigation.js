import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTES } from "../constants/routes";

const NAV_ITEMS = [
	{ path: ROUTES.HOME, label: "Art" },
	{ path: ROUTES.PORTFOLIO, label: "Portfolio" },
	{ path: ROUTES.ABOUT, label: "About" },
	{ path: ROUTES.PROJECTS, label: "Projects" },
	{ path: ROUTES.SKILLS, label: "Skills" },
	{ path: ROUTES.EXPERIENCE, label: "Experience" },
	{ path: ROUTES.CONTACT, label: "Contact" },
	{ path: ROUTES.MISC, label: "Misc" },
];

const Navigation = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Don't show navigation on the art landing page
	if (location.pathname === ROUTES.HOME) {
		return null;
	}

	return (
		<motion.nav
			className="site-nav"
			initial={{ y: -60, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
		>
			<div className="nav-inner">
				{NAV_ITEMS.map((item) => (
					<button
						key={item.path}
						className={`nav-link${location.pathname === item.path ? " nav-link--active" : ""}`}
						onClick={() => navigate(item.path)}
						aria-label={`Go to ${item.label}`}
						aria-current={location.pathname === item.path ? "page" : undefined}
					>
						{item.label}
					</button>
				))}
			</div>
		</motion.nav>
	);
};

export default Navigation;
