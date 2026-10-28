import React, { useState } from "react";
import Timeline from "./Timeline";
import { QUIZZING } from "../constants/content";

/**
 * A favourite question, answer hidden until the visitor asks for it.
 */
const QuestionCard = ({ item, number }) => {
	const [revealed, setRevealed] = useState(false);
	return (
		<article className={`quiz-card${revealed ? " is-revealed" : ""}`}>
			<span className="quiz-card__number">Q{number}</span>
			<p className="quiz-card__question">{item.question}</p>
			{revealed ? (
				<div className="quiz-card__answer">
					<strong>{item.answer}</strong>
					{item.note && <p>{item.note}</p>}
				</div>
			) : (
				<button type="button" className="btn btn--solid" onClick={() => setRevealed(true)}>
					Reveal answer
				</button>
			)}
		</article>
	);
};

/**
 * Quizzing: what it means to me, where I've played, questions I like, and
 * what I've built for it. Each part appears once it has content.
 */
const Quizzing = () => (
	<div className="quizzing">
		{QUIZZING.intro.map((paragraph) => (
			<p key={paragraph} className="prose quizzing__intro">
				{paragraph}
			</p>
		))}

		{QUIZZING.highlights.length > 0 && (
			<section className="quizzing__part">
				<h3 className="about-heading">Highlights</h3>
				<Timeline items={QUIZZING.highlights} />
			</section>
		)}

		{QUIZZING.questions.length > 0 && (
			<section className="quizzing__part">
				<h3 className="about-heading">Questions I like</h3>
				<div className="quiz-cards">
					{QUIZZING.questions.map((item, i) => (
						<QuestionCard key={item.question} item={item} number={i + 1} />
					))}
				</div>
			</section>
		)}

		{QUIZZING.projects.length > 0 && (
			<section className="quizzing__part">
				<h3 className="about-heading">Built for quizzing</h3>
				<ul className="contact-blocks">
					{QUIZZING.projects.map((project) => (
						<li key={project.href}>
							<a
								className="contact-block contact-block--paper"
								href={project.href}
								target="_blank"
								rel="noreferrer"
							>
								<span className="contact-block__label">{project.name}</span>
								<span className="contact-block__handle">{project.description} ↗</span>
							</a>
						</li>
					))}
				</ul>
			</section>
		)}
	</div>
);

export default Quizzing;
