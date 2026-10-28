import React from "react";
import FEEDS from "../data/feeds.json";
import { stars } from "./meta";

const films = FEEDS.letterboxd?.films || [];

const formatDate = (day) =>
	new Date(`${day}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// The most recent diary entry that has a written review
const featured = films.find((film) => film.review);

const ReviewText = ({ film }) =>
	film.review.map((paragraph, i) => (
		<p key={i} className="review__paragraph">
			{paragraph}
		</p>
	));

/**
 * The latest review in full, next to its poster. Spoiler reviews stay folded.
 */
const FeaturedReview = ({ film }) => (
	<article className="review">
		{film.poster && (
			<a className="review__poster" href={film.url} target="_blank" rel="noreferrer">
				<img src={film.poster} alt={`${film.title} poster`} />
			</a>
		)}
		<div className="review__body">
			<p className="post-date">Latest review · {formatDate(film.watched)}</p>
			<h3 className="review__title">
				{film.title} <span className="poster__year">{film.year}</span>
			</h3>
			{film.rating != null && <p className="review__stars">{stars(film.rating)}</p>}
			{film.spoilers ? (
				<details className="review__spoilers">
					<summary>Contains spoilers · show review</summary>
					<ReviewText film={film} />
				</details>
			) : (
				<ReviewText film={film} />
			)}
			<a className="review__link" href={film.url} target="_blank" rel="noreferrer">
				On Letterboxd ↗
			</a>
		</div>
	</article>
);

/**
 * Recent Letterboxd diary entries, fetched at build time by scripts/fetch-feeds.mjs.
 */
const Films = () => (
	<div className="films">
		<p className="muted">
			Recent watches from{" "}
			<a href={FEEDS.letterboxd.profile} target="_blank" rel="noreferrer">
				letterboxd.com/{FEEDS.letterboxd.user}
			</a>
		</p>
		{featured && <FeaturedReview film={featured} />}
		<ol className="poster-wall">
			{films.map((film) => (
				<li key={film.url}>
					<a className="poster" href={film.url} target="_blank" rel="noreferrer">
						<div className="poster__frame">
							{film.poster ? (
								<img src={film.poster} alt={`${film.title} poster`} loading="lazy" />
							) : (
								<span className="poster__fallback">{film.title}</span>
							)}
						</div>
						<div className="poster__meta">
							<span className="poster__title">
								{film.title} <span className="poster__year">{film.year}</span>
							</span>
							<span className="poster__line">
								<span className="poster__stars">{stars(film.rating)}</span>
								{film.liked && <span title="Liked">♥</span>}
								{film.rewatch && <span title="Rewatch">↻</span>}
								{film.review && <span title="Reviewed">✎</span>}
								<span className="poster__date">{formatDate(film.watched)}</span>
							</span>
						</div>
					</a>
				</li>
			))}
		</ol>
	</div>
);

export default Films;
