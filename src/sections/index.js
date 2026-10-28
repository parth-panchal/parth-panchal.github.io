// Section registry: what each tile in the composition is and what it opens into
import { lazy } from "react";
import About, { AboutPreview } from "./About";
import {
	hasQuizzing,
	hasWriting,
	writingBlurb,
	hasFilms,
	filmsBlurb,
	hasPhotos,
	photosBlurb,
	PhotosBackdrop,
	hasKit,
} from "./meta";
import { SECTIONS } from "../constants/config";

// Section content loads on demand, so the home page only ships what the closed
// tiles need. About stays eager: its preview is the home page's headline.
const loaders = {
	quizzing: () => import("./Quizzing"),
	photos: () => import("./Photos"),
	writing: () => import("./Writing"),
	films: () => import("./Films"),
	projects: () => import("./Projects"),
	studio: () => import("./Studio"),
	kit: () => import("./Kit"),
	contact: () => import("./Contact"),
	inspiration: () => import("./Inspiration"),
};

/**
 * Fetch every section in the background (call once the page is idle), so
 * opening one never waits on the network.
 */
export const prefetchSections = () => Object.values(loaders).forEach((load) => load());

/**
 * title     - Label on the tile and heading when open
 * blurb     - One line under the title on the closed tile
 * tone      - Tile colour: paper | red | blue | yellow
 * available - False when there is no content yet; the tile is drawn as a plain block
 * Preview   - Optional custom closed-tile content
 * Backdrop  - Optional image that fills the closed tile
 */
export const SECTION_REGISTRY = {
	[SECTIONS.ABOUT]: {
		title: "About",
		Component: About,
		Preview: AboutPreview,
		tone: "paper",
		available: true,
	},
	[SECTIONS.QUIZZING]: {
		title: "Quizzing",
		blurb: "Questions, and what I built for them",
		Component: lazy(loaders.quizzing),
		tone: "yellow",
		available: hasQuizzing,
	},
	[SECTIONS.PHOTOS]: {
		title: "Photographs",
		blurb: photosBlurb,
		Component: lazy(loaders.photos),
		Backdrop: PhotosBackdrop,
		tone: "paper",
		available: hasPhotos,
	},
	[SECTIONS.WRITING]: {
		title: "Writing",
		blurb: writingBlurb,
		Component: lazy(loaders.writing),
		tone: "paper",
		available: hasWriting,
	},
	[SECTIONS.FILMS]: {
		title: "Films",
		blurb: filmsBlurb,
		Component: lazy(loaders.films),
		tone: "blue",
		available: hasFilms,
	},
	[SECTIONS.PROJECTS]: {
		title: "Projects",
		blurb: "Work in progress, live from GitHub",
		Component: lazy(loaders.projects),
		tone: "paper",
		available: true,
	},
	[SECTIONS.STUDIO]: {
		title: "Studio",
		blurb: "Paint a program, then run it",
		Component: lazy(loaders.studio),
		tone: "paper",
		available: true,
	},
	[SECTIONS.KIT]: {
		title: "Kit",
		blurb: "What I shoot and work with",
		Component: lazy(loaders.kit),
		tone: "paper",
		available: hasKit,
	},
	[SECTIONS.CONTACT]: {
		title: "Contact",
		blurb: "Say hello",
		Component: lazy(loaders.contact),
		tone: "red",
		available: true,
	},
	[SECTIONS.INSPIRATION]: {
		title: "Inspiration",
		blurb: "The ideas behind the painting",
		Component: lazy(loaders.inspiration),
		tone: "paper",
		available: true,
	},
};
