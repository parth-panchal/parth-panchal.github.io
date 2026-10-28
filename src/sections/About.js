import React from "react";
import { Link } from "react-router-dom";
import Timeline from "./Timeline";
import { LATELY, LINKS, nowUpdated } from "./meta";
import { PROFILE, NOW } from "../constants/content";
import { ROUTES } from "../constants/routes";

/**
 * Closed tile: the name, set large, with the interests underneath.
 */
export const AboutPreview = () => (
	<div className="about-preview">
		<h1 className="display about-preview__name">
			{PROFILE.name.split(" ").map((word) => (
				<span key={word}>{word}</span>
			))}
		</h1>
		<ul className="interest-chips" aria-label="Interests">
			{PROFILE.interests.map((interest) => (
				<li key={interest.label} className={`chip chip--${interest.color}`}>
					{interest.label}
				</li>
			))}
		</ul>
	</div>
);

// Paragraph parts: plain text, a link into the site ({ to }), or an outside link ({ href })
const Rich = ({ parts }) =>
	parts.map((part, i) => {
		if (typeof part === "string") return part;
		if (part.to) {
			return (
				<Link key={i} to={part.to}>
					{part.text}
				</Link>
			);
		}
		return (
			<a key={i} href={part.href} target="_blank" rel="noreferrer">
				{part.text}
			</a>
		);
	});

/**
 * Open section: introduction (with an optional portrait), what's been
 * happening lately, interests, timeline and where else to find me.
 * Each optional part appears once it has content in content.js.
 */
const About = () => (
	<div className="about">
		<div className={`about-top${PROFILE.portrait ? " has-portrait" : ""}`}>
			<section className="about-intro" aria-label="Introduction">
				<p className="about-intro__lede">{PROFILE.intro.lede}</p>
				{PROFILE.intro.paragraphs.map((parts, i) => (
					<p key={i} className="prose">
						<Rich parts={parts} />
					</p>
				))}
			</section>
			{PROFILE.portrait && (
				<img className="about-portrait" src={PROFILE.portrait} alt={PROFILE.name} />
			)}
		</div>

		{(LATELY.length > 0 || NOW.items.length > 0) && (
			<section className="about-part" aria-label="Lately">
				<h3 className="about-heading">Lately</h3>
				{LATELY.length > 0 && (
					<div className="lately">
						{LATELY.map((entry) => (
							<Link
								key={entry.label}
								to={entry.to}
								className={`lately__card lately__card--${entry.tone}`}
							>
								<span className="lately__label">{entry.label}</span>
								<span className="lately__title">{entry.title}</span>
								{entry.detail && <span className="lately__detail">{entry.detail}</span>}
							</Link>
						))}
					</div>
				)}
				{NOW.items.length > 0 && (
					<dl className="now-list">
						{NOW.items.map((item) => (
							<div key={item.label} className="now-list__row">
								<dt>{item.label}</dt>
								<dd>{item.text}</dd>
							</div>
						))}
					</dl>
				)}
				{nowUpdated && NOW.items.length > 0 && <p className="muted">Updated {nowUpdated}</p>}
			</section>
		)}

		<section className="about-part" aria-label="Interests">
			<h3 className="about-heading">Into</h3>
			<div className="interest-grid">
				{PROFILE.interests.map((interest, index) => (
					<div key={interest.label} className={`interest interest--${interest.color}`}>
						<span className="interest__index">0{index + 1}</span>
						<span className="interest__label">{interest.label}</span>
					</div>
				))}
			</div>
		</section>

		{PROFILE.timeline.length > 0 && (
			<section className="about-part" aria-label="Timeline">
				<h3 className="about-heading">Timeline</h3>
				<Timeline items={PROFILE.timeline} />
			</section>
		)}

		<section className="about-part" aria-label="Elsewhere">
			<h3 className="about-heading">Elsewhere</h3>
			<ul className="elsewhere">
				{LINKS.map((link) => (
					<li key={link.href}>
						<a href={link.href} target="_blank" rel="noreferrer">
							<span className="elsewhere__label">{link.label}</span>
							<span className="elsewhere__handle">{link.handle} ↗</span>
						</a>
					</li>
				))}
			</ul>
		</section>

		<p className="muted about-hello">
			This site's colours come from a painting that runs:{" "}
			<Link to={ROUTES.PAINTING}>watch it say hello ↺</Link>
		</p>
	</div>
);

export default About;
