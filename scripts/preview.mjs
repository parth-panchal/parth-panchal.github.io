// Serve the production build locally, as visitors get it: `npm run preview`
// (builds first). The dev server (`npm start`) runs React in development mode,
// which is much slower, so judge speed and smoothness here, not there.
// Unknown paths fall back to index.html, like GitHub Pages' 404 redirect.

import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../build");
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".txt": "text/plain",
	".map": "application/json",
};

http
	.createServer(async (req, res) => {
		const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
		const file = path.join(ROOT, urlPath);
		// Stay inside build/
		if (!file.startsWith(ROOT)) {
			res.writeHead(403).end();
			return;
		}
		try {
			const body = await readFile(file);
			res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
			res.end(body);
		} catch {
			res.writeHead(200, { "content-type": TYPES[".html"] });
			res.end(await readFile(path.join(ROOT, "index.html")));
		}
	})
	.listen(PORT, () => console.log(`Production preview: http://localhost:${PORT}`));
