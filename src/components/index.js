// Component exports for cleaner imports
// Only what the home page needs: anything listed here lands in the main bundle.
// ArtView (/hello) and PietGrid/PietReadout load on demand, so import those directly.
export { default as ErrorBoundary } from "./ErrorBoundary";
export { default as Composition } from "./Composition";
