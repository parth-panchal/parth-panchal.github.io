// What the closed tiles need (availability, blurbs, the photo backdrop), built
// from small data only. The sections themselves, and the full feeds with every
// post and review, load on demand (see ./index.js).
import React from "react";
import SUMMARY from "../data/feeds-summary.json";
import PHOTOS from "../data/photos.json";
import { PROFILE, NOW, QUIZZING, KIT } from "../constants/content";

export const stars = (rating) =>
	rating == null ? "" : "★".repeat(Math.floor(rating)) + (rating % 1 ? "½" : "");

// Substack / Letterboxd identity, for Contact and the section headers
const FEED_LINKS = {
	substack: SUMMARY.substack && { title: SUMMARY.substack.title, home: SUMMARY.substack.home },
	letterboxd: SUMMARY.letterboxd && {
		user: SUMMARY.letterboxd.user,
		profile: SUMMARY.letterboxd.profile,
	},
};

// Every place to find you: PROFILE.links plus Substack/Letterboxd once configured
export const LINKS = [
	...PROFILE.links,
	FEED_LINKS.substack && {
		label: "Substack",
		handle: FEED_LINKS.substack.home.replace(/^https?:\/\//, ""),
		href: FEED_LINKS.substack.home,
		color: "yellow",
	},
	FEED_LINKS.letterboxd && {
		label: "Letterboxd",
		handle: `@${FEED_LINKS.letterboxd.user}`,
		href: FEED_LINKS.letterboxd.profile,
		color: "blue",
	},
].filter(Boolean);

// About › Lately: what the feeds say you've been up to, newest data from each
const shortDate = (iso) =>
	new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const nowUpdated = NOW.updated
	? new Date(`${NOW.updated}-15T12:00:00`).toLocaleDateString("en-US", {
			month: "long",
			year: "numeric",
		})
	: "";

export const LATELY = [
	SUMMARY.substack?.latest && {
		label: "Latest post",
		title: SUMMARY.substack.latest,
		detail: SUMMARY.substackLatestDate ? shortDate(SUMMARY.substackLatestDate) : "",
		to: "/writing",
		tone: "yellow",
	},
	SUMMARY.letterboxd?.latest && {
		label: "Last watched",
		title: SUMMARY.letterboxd.latest.title,
		detail: [
			stars(SUMMARY.letterboxd.latest.rating),
			SUMMARY.letterboxd.latest.watched &&
				shortDate(`${SUMMARY.letterboxd.latest.watched}T12:00:00`),
		]
			.filter(Boolean)
			.join(" · "),
		to: "/films",
		tone: "blue",
	},
	SUMMARY.github?.latest && {
		label: "Last pushed",
		title: SUMMARY.github.latest.name,
		detail: SUMMARY.github.latest.pushed ? shortDate(SUMMARY.github.latest.pushed) : "",
		to: "/projects",
		tone: "paper",
	},
].filter(Boolean);

// Quizzing
export const hasQuizzing =
	QUIZZING.intro.length +
		QUIZZING.highlights.length +
		QUIZZING.questions.length +
		QUIZZING.projects.length >
	0;

// Writing
export const hasWriting = (SUMMARY.substack?.count || 0) > 0;
export const writingBlurb = hasWriting ? `Latest: ${SUMMARY.substack.latest}` : "";

// Films
const lastWatched = SUMMARY.letterboxd?.latest;
export const hasFilms = (SUMMARY.letterboxd?.count || 0) > 0;
export const filmsBlurb = lastWatched
	? `Last watched: ${lastWatched.title} ${stars(lastWatched.rating)}`
	: "";

// Photographs
export const hasPhotos = PHOTOS.length > 0;
export const photosBlurb = hasPhotos ? `${PHOTOS.length} frames` : "";

/**
 * Closed Photographs tile: the newest photo fills the block.
 */
export const PhotosBackdrop = () =>
	hasPhotos ? <img className="tile-backdrop__image" src={PHOTOS[0].src} alt="" /> : null;

// Kit
export const hasKit = KIT.some((group) => group.items.length > 0);
