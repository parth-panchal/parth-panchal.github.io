import React from "react";
import FEEDS from "../data/feeds.json";

const posts = FEEDS.substack?.posts || [];

const formatDate = (iso) =>
	new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/**
 * Latest Substack posts, fetched at build time by scripts/fetch-feeds.mjs.
 */
const Writing = () => {
	const { title, home } = FEEDS.substack;
	const [lead, ...rest] = posts;

	return (
		<div className="writing">
			<p className="muted">
				{title} on Substack ·{" "}
				<a href={home} target="_blank" rel="noreferrer">
					subscribe ↗
				</a>
			</p>

			<a className="post-lead" href={lead.url} target="_blank" rel="noreferrer">
				{lead.image && <img className="post-lead__image" src={lead.image} alt="" loading="lazy" />}
				<div className="post-lead__text">
					<span className="post-date">{formatDate(lead.date)}</span>
					<h3 className="post-lead__title">{lead.title}</h3>
					{lead.subtitle && <p className="post-lead__subtitle">{lead.subtitle}</p>}
				</div>
			</a>

			{rest.length > 0 && (
				<ol className="post-list">
					{rest.map((post) => (
						<li key={post.url}>
							<a className="post-row" href={post.url} target="_blank" rel="noreferrer">
								<span className="post-date">{formatDate(post.date)}</span>
								<span className="post-row__title">{post.title}</span>
								<span className="post-row__arrow" aria-hidden="true">↗</span>
							</a>
						</li>
					))}
				</ol>
			)}
		</div>
	);
};

export default Writing;
