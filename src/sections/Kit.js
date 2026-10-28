import React from "react";
import { KIT } from "../constants/content";

const TONES = ["red", "blue", "yellow", "ink"];

/**
 * Kit: what I shoot and work with, grouped. Each group is marked with a De Stijl
 * square; empty groups are skipped.
 */
const Kit = () => (
	<div className="uses">
		{KIT.filter((group) => group.items.length).map((group, i) => (
			<section key={group.category} className="uses-group">
				<h3 className="uses-group__title">
					<span
						className={`uses-group__mark uses-group__mark--${TONES[i % TONES.length]}`}
						aria-hidden="true"
					/>
					{group.category}
				</h3>
				<ul className="uses-list">
					{group.items.map((item) => (
						<li key={item.name} className="uses-item">
							{item.href ? (
								<a className="uses-item__name" href={item.href} target="_blank" rel="noreferrer">
									{item.name}
								</a>
							) : (
								<span className="uses-item__name">{item.name}</span>
							)}
							{item.note && <span className="uses-item__note">{item.note}</span>}
						</li>
					))}
				</ul>
			</section>
		))}
	</div>
);

export default Kit;
