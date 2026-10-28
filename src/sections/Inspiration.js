import React from "react";
import { Link } from "react-router-dom";
import PietGrid from "../components/PietGrid";
import { classifyColor, commandFor } from "../piet/interpreter";
import { PIET_PALETTE, toDeStijl } from "../piet/palette";
import { PIET_COLOR_GRID } from "../constants/pietData";
import { ANIMATION, DE_STIJL } from "../constants/config";
import { INSPIRATION, PROFILE } from "../constants/content";
import { ROUTES } from "../constants/routes";

// Every figure below is drawn from the code that runs the site, so it can't drift from it

const RED = classifyColor("#FF0000");

const SYSTEM_COLORS = [
	{ name: "Red", hex: DE_STIJL.RED, role: "Primary" },
	{ name: "Blue", hex: DE_STIJL.BLUE, role: "Primary" },
	{ name: "Yellow", hex: DE_STIJL.YELLOW, role: "Primary" },
	{ name: "Paper", hex: DE_STIJL.PAPER, role: "Canvas, warmer than screen white" },
	{ name: "Ink", hex: DE_STIJL.INK, role: "The lines" },
];

const Chapter = ({ number, title, tone, children }) => (
	<section className="chapter">
		<h3 className="chapter__title">
			<span className={`chapter__mark chapter__mark--${tone}`} aria-hidden="true">
				{number}
			</span>
			{title}
		</h3>
		{children}
	</section>
);

const Figure = ({ caption, children }) => (
	<figure className="insp-figure">
		{children}
		<figcaption className="muted">{caption}</figcaption>
	</figure>
);

/**
 * The inspiration behind the site and a breakdown of its design system.
 */
const Inspiration = () => (
	<div className="inspiration">
		<p className="inspiration__lede">
			This site is built on two Piets: the painter Piet Mondrian, and Piet, the programming
			language named after him.
		</p>
		{INSPIRATION.note.map((paragraph) => (
			<p key={paragraph} className="prose">
				{paragraph}
			</p>
		))}

		<Chapter number="01" title="The painter" tone="red">
			<p className="prose">
				In 1917 Mondrian and Theo van Doesburg started De Stijl, a movement that stripped
				painting down to its parts. Mondrian called his version neoplasticism: straight black
				lines, rectangles of red, yellow and blue, and white. Nothing curved, nothing
				depicted. The balance comes from proportion alone.
			</p>
			<p className="prose">
				His last finished painting, <em>Broadway Boogie Woogie</em> (1942–43), was made after
				he moved to New York. The black lines are gone; the grid is built from small blocks
				of colour, often read as Manhattan's streets and traffic. It is a grid that moves,
				and that is the idea this site borrows.
			</p>
			<Figure caption="The whole vocabulary: three primaries, a canvas and a line.">
				<div className="insp-vocab">
					{SYSTEM_COLORS.map((c) => (
						<div key={c.name} className="insp-vocab__chip" style={{ background: c.hex }} />
					))}
				</div>
			</Figure>
		</Chapter>

		<Chapter number="02" title="The language" tone="blue">
			<p className="prose">
				Piet, designed by David Morgan-Mar, is an esoteric programming language whose
				programs are abstract paintings. It has twenty colours: six hues in three
				lightnesses, plus black and white. A pointer moves across blocks of colour, and the
				instruction it runs depends only on how the colour <em>changes</em> from one block
				to the next. The size of a block becomes a number.
			</p>
			<Figure caption="Stepping from red into each colour, and the instruction that runs. Computed by this site's interpreter.">
				<div className="insp-ops">
					{PIET_PALETTE.flat().map((hex) => {
						const to = classifyColor(hex);
						const op = to.hue === RED.hue && to.light === RED.light ? "from" : commandFor(RED, to);
						return (
							<div key={hex} className="insp-ops__cell" style={{ background: hex }}>
								<span>{op}</span>
							</div>
						);
					})}
				</div>
			</Figure>
		</Chapter>

		<Chapter number="03" title="The painting" tone="yellow">
			<p className="prose">
				The painting behind this site is <em>Hello, world!</em> by Thomas Schoch: 169 codels
				that are both a picture and a program. It isn't decoration. This site has its own Piet interpreter,
				and pressing run executes the painting: 132 steps later it has printed{" "}
				<code>Hello, world!</code> and halts.
			</p>
			<p className="prose">
				Then it folds. Every pale colour becomes canvas, and every other colour collapses to
				its nearest primary: magenta to red, green to yellow, cyan to blue. Black stays
				black. The program becomes a Mondrian, and the Mondrian becomes this site.
			</p>
			<Figure caption="Schoch's painting as written, and after the fold.">
				<div className="insp-fold">
					<PietGrid grid={PIET_COLOR_GRID} className="insp-fold__grid" ariaLabel="Hello, world! in Piet colours" />
					<span className="insp-fold__arrow" aria-hidden="true">
						→
					</span>
					<PietGrid
						grid={PIET_COLOR_GRID}
						colorFor={toDeStijl}
						className="insp-fold__grid insp-fold__grid--folded"
						ariaLabel="The same painting folded into De Stijl colours"
					/>
				</div>
			</Figure>
			<Figure caption="The fold, colour by colour: light, normal and dark of each hue.">
				<div className="insp-map">
					{PIET_PALETTE.flat().map((hex) => (
						<div key={hex} className="insp-map__pair">
							<span style={{ background: hex }} />
							<span style={{ background: toDeStijl(hex) }} />
						</div>
					))}
				</div>
			</Figure>
		</Chapter>

		<Chapter number="04" title="The system" tone="ink">
			<dl className="insp-system">
				<div>
					<dt>Colour</dt>
					<dd>
						<ul className="insp-swatches">
							{SYSTEM_COLORS.map((c) => (
								<li key={c.name}>
									<span className="insp-swatches__chip" style={{ background: c.hex }} />
									<strong>{c.name}</strong> <code>{c.hex}</code>
									<span className="muted">{c.role}</span>
								</li>
							))}
						</ul>
					</dd>
				</div>
				<div>
					<dt>Line</dt>
					<dd className="prose">
						There are no borders. Every black line is the ink background showing through a
						6&nbsp;px gap in the grid (4&nbsp;px on phones).
					</dd>
				</div>
				<div>
					<dt>Type</dt>
					<dd className="prose">
						<span className="insp-type insp-type--display">Archivo, at its heaviest</span>, for
						anything that should feel painted.{" "}
						<span className="insp-type insp-type--mono">JetBrains Mono</span> for anything the
						machine says: the interpreter, dates, labels.
					</dd>
				</div>
				<div>
					<dt>Composition</dt>
					<dd className="prose">
						The site is one painting, not a set of pages. Opening a section never moves a
						block; it re-proportions the lines until that block fills the frame. The plain
						colour blocks cycle through four hand-tuned compositions: the same elements,
						re-balanced.
					</dd>
				</div>
				<div>
					<dt>Motion</dt>
					<dd className="prose">
						Everything moves together, once, in {ANIMATION.LAYOUT_TRANSITION.duration}
						&nbsp;s, with no bounce. Text never resizes mid-move; it rides along with its
						block.
					</dd>
				</div>
			</dl>
		</Chapter>

		<Chapter number="05" title="Built with" tone="paper">
			<p className="prose">
				React, Framer Motion and CSS Grid, plus a Piet interpreter written for this site.
				Writing and films come from Substack and Letterboxd, projects from GitHub.
			</p>
			<p className="muted insp-credits">
				<Link to={ROUTES.PAINTING}>Watch it run ↺</Link> ·{" "}
				<Link to={ROUTES.STUDIO}>Paint your own</Link> ·{" "}
				<a href={PROFILE.repo} target="_blank" rel="noreferrer">
					Source ↗
				</a>
			</p>
		</Chapter>
	</div>
);

export default Inspiration;
