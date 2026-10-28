import React from "react";

/**
 * A dated list: About's timeline and Quizzing's highlights.
 * items: [{ when, what, where?, detail? }]
 */
const Timeline = ({ items }) => (
	<ol className="timeline">
		{items.map((item) => (
			<li key={`${item.when}-${item.what}`} className="timeline__row">
				<span className="timeline__when">{item.when}</span>
				<span className="timeline__what">
					{item.what}
					{(item.where || item.detail) && (
						<span className="timeline__detail">{item.where || item.detail}</span>
					)}
				</span>
			</li>
		))}
	</ol>
);

export default Timeline;
