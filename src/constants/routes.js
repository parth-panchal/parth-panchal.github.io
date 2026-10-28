// Application Route Paths
// Defines all route paths for React Router
import { SECTIONS } from "./config";

export const ROUTES = {
	// The composition is the home page; /portfolio (the old home) redirects here
	HOME: "/",
	// Schoch's painting, running and folding into the composition
	PAINTING: "/hello",
	ABOUT: `/${SECTIONS.ABOUT}`,
	QUIZZING: `/${SECTIONS.QUIZZING}`,
	PROJECTS: `/${SECTIONS.PROJECTS}`,
	WRITING: `/${SECTIONS.WRITING}`,
	FILMS: `/${SECTIONS.FILMS}`,
	PHOTOS: `/${SECTIONS.PHOTOS}`,
	KIT: `/${SECTIONS.KIT}`,
	STUDIO: `/${SECTIONS.STUDIO}`,
	CONTACT: `/${SECTIONS.CONTACT}`,
	INSPIRATION: `/${SECTIONS.INSPIRATION}`,
};

// Helper function to check if a path is valid
export const isValidSection = (section) =>
	Object.values(SECTIONS).includes(section);
