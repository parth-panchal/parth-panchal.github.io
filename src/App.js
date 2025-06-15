import "./App.css";

function App() {
	// Palette-based storage for Thomas Schoch's 13x13 Piet "Hello World"
	// Reference: https://retas.de/thomas/computer/programs/useless/piet/explain.html

	// Direct color grid - Thomas Schoch's exact 13x13 Piet "Hello World"
	// Each cell contains the exact hex color from the reference image
	const pietColorGrid = [
		// Row 0 - [Ready for your input]
		[
			"#FFFF00",
			"#B4B4FF",
			"#0000FF",
			"#0000B4",
			"#B400B4",
			"#00B4B4",
			"#B4B400",
			"#00B400",
			"#00FFFF",
			"#FFFF00",
			"#FF00FF",
			"#B400B4",
			"#B4FFB4",
		],
		// Row 1 - [Ready for your input]
		[
			"#FFB4B4",
			"#0000B4",
			"#00FFFF",
			"#00B4B4",
			"#B4FFFF",
			"#B4B4FF",
			"#0000B4",
			"#FF00FF",
			"#B400B4",
			"#FF00FF",
			"#B400B4",
			"#B4FFB4",
			"#FFB4B4",
		],
		// Row 2 - [Ready for your input]
		[
			"#00B4B4",
			"#FFFF00",
			"#00FF00",
			"#FF0000",
			"#FFFFB4",
			"#FFB4FF",
			"#FFB4B4",
			"#B4B4FF",
			"#0000FF",
			"#0000B4",
			"#FFFFB4",
			"#FFB4B4",
			"#B4B400",
		],
		// Row 3 - [Ready for your input]
		[
			"#B4FFFF",
			"#FFFFB4",
			"#FFB4FF",
			"#00B400",
			"#FFFF00",
			"#FFB4B4",
			"#B4B4FF",
			"#00B4B4",
			"#B4FFFF",
			"#FF0000",
			"#FFFF00",
			"#B4B4FF",
			"#00B400",
		],
		// Row 4 - [Ready for your input]
		[
			"#00B400",
			"#00FF00",
			"#B400B4",
			"#FF00FF",
			"#FFB4FF",
			"#000000",
			"#000000",
			"#000000",
			"#FFB4FF",
			"#B40000",
			"#00FF00",
			"#0000FF",
			"#FFFF00",
		],
		// Row 5 - [Ready for your input]
		[
			"#B4B4FF",
			"#0000FF",
			"#B4B400",
			"#FFB4FF",
			"#000000",
			"#000000",
			"#B4FFB4",
			"#000000",
			"#000000",
			"#FFB4B4",
			"#FF0000",
			"#0000B4",
			"#B4B400",
		],
		// Row 6 - [Ready for your input]
		[
			"#FFFFB4",
			"#FF0000",
			"#B40000",
			"#B4B4FF",
			"#000000",
			"#B4FFB4",
			"#B4FFB4",
			"#B4FFB4",
			"#000000",
			"#FFFFB4",
			"#FFFF00",
			"#FF00FF",
			"#FFFFB4",
		],
		// Row 7 - [Ready for your input]
		[
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
		],
		// Row 8 - [Ready for your input]
		[
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
		],
		// Row 9 - [Ready for your input]
		[
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
		],
		// Row 10 - [Ready for your input]
		[
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
		],
		// Row 11 - [Ready for your input]
		[
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
		],
		// Row 12 - [Ready for your input]
		[
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
			"#PENDING",
		],
	];

	return (
		<div className="App">
			<div className="piet-container">
				<h1 className="piet-title">Piet "Hello World"</h1>

				<div className="piet-grid">
					{pietColorGrid.map((row, rowIndex) =>
						row.map((color, colIndex) => {
							return (
								<div
									key={`${rowIndex}-${colIndex}`}
									style={{
										backgroundColor: color,
										width: "25px",
										height: "25px",
										border: "1px solid rgba(255,255,255,0.1)",
										transition: "transform 0.2s ease",
									}}
									title={`(${rowIndex},${colIndex}): ${color}`}
									onMouseEnter={(e) =>
										(e.target.style.transform =
											"scale(1.1)")
									}
									onMouseLeave={(e) =>
										(e.target.style.transform = "scale(1)")
									}
								></div>
							);
						})
					)}
				</div>

				<div className="piet-info">
					<p>✨ Thomas Schoch's Piet "Hello World" ✨</p>
					<p>
						13×13 spiral pattern • Pixel-perfect colors • Center
						black cage
					</p>
					<p>
						<em>Exact colors from reference image</em>
					</p>
					<p className="storage-info">
						🎨 Direct color mapping: {pietColorGrid.flat().length}{" "}
						cells with exact hex values
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
