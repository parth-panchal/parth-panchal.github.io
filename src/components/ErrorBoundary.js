import React from "react";

/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	handleBackToArt = () => {
		this.setState({ hasError: false, error: null });
		window.location.href = "/";
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="error-boundary">
					<div className="error-content">
						<h1>Oops! Something went wrong</h1>
						<p>
							An unexpected error occurred. Don't worry, your
							portfolio is still here.
						</p>
						{this.state.error && (
							<details>
								<summary>Error Details</summary>
								<pre>{this.state.error.toString()}</pre>
							</details>
						)}
						<button
							onClick={this.handleBackToArt}
							className="back-to-art-btn"
						>
							← Back to Art
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
