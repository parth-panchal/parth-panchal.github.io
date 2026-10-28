import React, { useEffect, useState } from "react";
import FEED_CONFIG from "../constants/feeds.json";

const { user: GITHUB_USER, hidden: HIDDEN_REPOS } = FEED_CONFIG.github;

const CACHE_KEY = "gh-repos-v1";
const TONES = ["red", "paper", "blue", "paper", "yellow", "paper", "paper"];

// Session cache keeps us well under GitHub's unauthenticated rate limit
const readCache = () => {
	try {
		const raw = sessionStorage.getItem(CACHE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};

const writeCache = (repos) => {
	try {
		sessionStorage.setItem(CACHE_KEY, JSON.stringify(repos));
	} catch {
		// Storage can be unavailable (private mode); the fetch result still renders
	}
};

// Most recently pushed first, with stars as a tie-breaker in size
const rank = (repos) =>
	repos
		.filter((r) => !r.fork && !r.archived && !HIDDEN_REPOS.includes(r.name))
		.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
		.map((r, i) => ({
			name: r.name,
			description: r.description,
			language: r.language,
			stars: r.stargazers_count,
			url: r.homepage || r.html_url,
			source: r.html_url,
			year: new Date(r.pushed_at).getFullYear(),
			size: i === 0 ? "lg" : i < 3 || r.stargazers_count > 2 ? "md" : "sm",
		}));

/**
 * Public GitHub repositories, laid out as a small Mondrian:
 * recent work gets the bigger rectangles.
 */
const Projects = () => {
	const [repos, setRepos] = useState(readCache);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (repos) return undefined;
		const controller = new AbortController();
		fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, {
			signal: controller.signal,
		})
			.then((res) => {
				if (!res.ok) throw new Error(`GitHub said ${res.status}`);
				return res.json();
			})
			.then((data) => {
				const ranked = rank(data);
				writeCache(ranked);
				setRepos(ranked);
			})
			.catch((err) => {
				if (err.name !== "AbortError") setError(err.message);
			});
		return () => controller.abort();
	}, [repos]);

	if (error) {
		return (
			<p className="prose">
				Couldn't reach GitHub ({error}). Everything lives at{" "}
				<a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
					github.com/{GITHUB_USER}
				</a>
				.
			</p>
		);
	}

	if (!repos) {
		return (
			<div className="project-grid is-loading" aria-label="Loading projects">
				{["lg", "md", "md", "sm", "sm"].map((size, i) => (
					<div key={i} className={`project-card project-card--${size} project-card--ghost`} />
				))}
			</div>
		);
	}

	return (
		<>
			<p className="muted">
				Live from{" "}
				<a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
					github.com/{GITHUB_USER}
				</a>
				, most recent first.
			</p>
			<div className="project-grid">
				{repos.map((repo, i) => (
					<a
						key={repo.name}
						className={`project-card project-card--${repo.size} project-card--${TONES[i % TONES.length]}`}
						href={repo.url}
						target="_blank"
						rel="noreferrer"
					>
						<span className="project-card__year">{repo.year}</span>
						<h3 className="project-card__name">
							{repo.name.includes(".") ? repo.name : repo.name.replace(/[-_]/g, " ")}
						</h3>
						{repo.description && <p className="project-card__desc">{repo.description}</p>}
						<span className="project-card__meta">
							{repo.language || "—"}
							{repo.stars > 0 && ` · ★ ${repo.stars}`}
						</span>
					</a>
				))}
			</div>
		</>
	);
};

export default Projects;
