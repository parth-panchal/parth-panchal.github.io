import React from "react";
import { SECTIONS } from "../constants/config";

/**
 * Section Page Component
 * Displays content for individual portfolio sections
 */
const SectionPage = ({ section }) => {
	const renderContent = () => {
		switch (section) {
			case SECTIONS.PROJECTS:
				return (
					<div className="section-content projects-content">
						<h1>Projects</h1>
						<div className="coming-soon-message">
							<h2>Coming Soon</h2>
							<p>
								Portfolio projects are currently being curated
								and will be available soon.
							</p>
						</div>
					</div>
				);

			case SECTIONS.SKILLS:
				return (
					<div className="section-content skills-content">
						<h1>Skills & Expertise</h1>
						<div className="coming-soon-message">
							<h2>Under Development</h2>
							<p>Skills showcase coming soon.</p>
						</div>
					</div>
				);

			case SECTIONS.ABOUT:
				return (
					<div className="section-content about-content">
						<h1>About Me</h1>
						<div className="about-layout">
							<div className="about-text">
								<h2>Hello, I'm Parth Panchal</h2>
								<div className="coming-soon-message">
									<p>
										More details about my background and
										experience coming soon.
									</p>
								</div>
							</div>
						</div>
					</div>
				);

			case SECTIONS.CONTACT:
				return (
					<div className="section-content contact-content">
						<h1>Get In Touch</h1>
						<div className="contact-layout">
							<div className="contact-info">
								<h2>Let's connect</h2>
								<div className="coming-soon-message">
									<p>
										Contact information and form coming soon.
									</p>
								</div>
							</div>
						</div>
					</div>
				);

			case SECTIONS.EXPERIENCE:
				return (
					<div className="section-content experience-content">
						<h1>Experience</h1>
						<div className="coming-soon-message">
							<h2>Under Development</h2>
							<p>
								Professional experience and background coming
								soon.
							</p>
						</div>
					</div>
				);

			case SECTIONS.MISC:
				return (
					<div className="section-content misc-content">
						<h1>Misc</h1>
						<div className="coming-soon-message">
							<h2>Coming Soon</h2>
							<p>
								Miscellaneous content and extras coming soon.
							</p>
						</div>
					</div>
				);

			default:
				return (
					<div className="section-content">
						<h1>Section Not Found</h1>
						<p>The requested section could not be found.</p>
					</div>
				);
		}
	};

	return renderContent();
};

export default SectionPage;
