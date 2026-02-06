// Application Route Paths
// Defines all route paths for React Router

export const ROUTES = {
	HOME: "/",
	PORTFOLIO: "/portfolio",
	ABOUT: "/about",
	PROJECTS: "/projects",
	SKILLS: "/skills",
	EXPERIENCE: "/experience",
	CONTACT: "/contact",
	MISC: "/misc",
};

// Helper function to check if a path is valid
export const isValidSection = (section) => {
	const validSections = [
		"about",
		"projects",
		"skills",
		"experience",
		"contact",
		"misc",
	];
	return validSections.includes(section);
};
