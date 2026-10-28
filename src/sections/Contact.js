import React from "react";
import { LINKS as links } from "./meta";

/**
 * Contact links, each one a block in the composition.
 */
const Contact = () => (
	<div className="contact">
		<p className="prose">The best way to reach me:</p>
		<ul className="contact-blocks">
			{links.map((link) => (
				<li key={link.href}>
					<a
						className={`contact-block contact-block--${link.color}`}
						href={link.href}
						target="_blank"
						rel="noreferrer"
					>
						<span className="contact-block__label">{link.label}</span>
						<span className="contact-block__handle">{link.handle} ↗</span>
					</a>
				</li>
			))}
		</ul>
	</div>
);

export default Contact;
