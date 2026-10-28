// Fetches Substack posts and Letterboxd watches, and indexes public/photos.
// Runs before every build (npm "prebuild"), so `npm run deploy` ships fresh data.
// Neither feed allows cross-origin requests, which is why this happens at build
// time instead of in the browser.
//
// Writes src/data/feeds.json (everything, loaded only by the Writing and Films
// sections), src/data/feeds-summary.json (the little the home page needs) and
// src/data/photos.json. A feed that fails keeps its previous data, so a network
// hiccup never breaks a deploy.

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = path.join(ROOT, "src/constants/feeds.json");
const DATA_DIR = path.join(ROOT, "src/data");
const FEEDS_OUT = path.join(DATA_DIR, "feeds.json");
const SUMMARY_OUT = path.join(DATA_DIR, "feeds-summary.json");
const PHOTOS_DIR = path.join(ROOT, "public/photos");
const PHOTOS_OUT = path.join(DATA_DIR, "photos.json");

const MAX_POSTS = 12;
const MAX_FILMS = 24;

// ---- tiny RSS helpers (both feeds are well-formed and flat) ----

const decode = (s = "") =>
	s
		.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1")
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&")
		.trim();

const tag = (xml, name) => {
	const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
	return m ? decode(m[1]) : "";
};

const attr = (xml, name, attribute) => {
	const m = xml.match(new RegExp(`<${name}\\s[^>]*${attribute}="([^"]*)"`));
	return m ? decode(m[1]) : "";
};

const items = (xml) => xml.match(/<item>[\s\S]*?<\/item>/g) || [];

const stripHtml = (html) => decode(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));

// ---- parsers ----

export const parseSubstack = (xml) => ({
	title: tag(xml.split("<item>")[0], "title"),
	posts: items(xml)
		.slice(0, MAX_POSTS)
		.map((item) => ({
			title: tag(item, "title"),
			url: tag(item, "link"),
			date: new Date(tag(item, "pubDate")).toISOString(),
			subtitle: stripHtml(tag(item, "description")).slice(0, 220),
			image: attr(item, "enclosure", "url") || null,
		})),
});

export const parseLetterboxd = (xml) =>
	items(xml)
		// Skip list entries; only diary items carry a film title
		.filter((item) => item.includes("<letterboxd:filmTitle>"))
		.slice(0, MAX_FILMS)
		.map((item) => {
			const description = tag(item, "description");
			const rating = tag(item, "letterboxd:memberRating");
			// Review paragraphs, minus the poster and Letterboxd's own boilerplate lines
			const paragraphs = (description.match(/<p>[\s\S]*?<\/p>/g) || [])
				.filter((p) => !/^<p><img/.test(p))
				.map(stripHtml)
				.filter(Boolean);
			const spoilers = paragraphs.some((p) => /^This review may contain spoilers/i.test(p));
			const review = paragraphs.filter(
				(p) => !/^Watched on /.test(p) && !/^This review may contain spoilers/i.test(p)
			);
			return {
				title: tag(item, "letterboxd:filmTitle"),
				year: tag(item, "letterboxd:filmYear"),
				rating: rating ? Number(rating) : null,
				liked: tag(item, "letterboxd:memberLike") === "Yes",
				rewatch: tag(item, "letterboxd:rewatch") === "Yes",
				watched: tag(item, "letterboxd:watchedDate"),
				poster: (description.match(/<img src="([^"]+)"/) || [])[1] || null,
				review: review.length ? review : null,
				spoilers,
				url: tag(item, "link"),
			};
		});

// ---- image dimensions (JPEG and PNG headers) ----

export const imageSize = (buf) => {
	// PNG: width/height are in the IHDR chunk
	if (buf.readUInt32BE(0) === 0x89504e47) {
		return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
	}
	// JPEG: walk markers until a start-of-frame
	if (buf[0] === 0xff && buf[1] === 0xd8) {
		let i = 2;
		while (i < buf.length) {
			if (buf[i] !== 0xff) return null;
			const marker = buf[i + 1];
			const length = buf.readUInt16BE(i + 2);
			if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
				return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
			}
			i += 2 + length;
		}
	}
	return null;
};

// ---- main ----

const readJson = async (file, fallback) => {
	try {
		return JSON.parse(await readFile(file, "utf8"));
	} catch {
		return fallback;
	}
};

const fetchText = async (url) => {
	const res = await fetch(url, { headers: { "user-agent": "parth-panchal.github.io feed builder" } });
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
	return res.text();
};

const substackFeedUrl = (value) => {
	const base = value.includes(".") ? value.replace(/\/+$/, "") : `https://${value}.substack.com`;
	return `${base.startsWith("http") ? base : `https://${base}`}/feed`;
};

const buildFeeds = async () => {
	const config = await readJson(CONFIG, {});
	const previous = await readJson(FEEDS_OUT, {});
	const out = { fetchedAt: new Date().toISOString(), substack: null, letterboxd: null, github: null };

	if (config.substack) {
		try {
			const feed = parseSubstack(await fetchText(substackFeedUrl(config.substack)));
			out.substack = { ...feed, home: substackFeedUrl(config.substack).replace(/\/feed$/, "") };
			console.log(`substack: ${feed.posts.length} posts`);
		} catch (err) {
			out.substack = previous.substack || null;
			console.warn(`substack: kept previous data (${err.message})`);
		}
	}

	if (config.letterboxd) {
		const user = config.letterboxd.replace(/^@/, "");
		try {
			const films = parseLetterboxd(await fetchText(`https://letterboxd.com/${user}/rss/`));
			out.letterboxd = { user, profile: `https://letterboxd.com/${user}/`, films };
			console.log(`letterboxd: ${films.length} films`);
		} catch (err) {
			out.letterboxd = previous.letterboxd || null;
			console.warn(`letterboxd: kept previous data (${err.message})`);
		}
	}

	if (config.github?.user) {
		const { user, hidden = [] } = config.github;
		try {
			// The CI token (if any) lifts the rate limit; unauthenticated is plenty for a daily build
			const headers = { "user-agent": "parth-panchal.github.io feed builder" };
			if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
			const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, { headers });
			if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
			// Most recently pushed project, leaving out forks, hidden repos and this site itself
			const latest = (await res.json()).find(
				(r) => !r.fork && !r.archived && !hidden.includes(r.name) && r.name !== `${user}.github.io`
			);
			out.github = {
				user,
				profile: `https://github.com/${user}`,
				latest: latest
					? { name: latest.name, url: latest.html_url, description: latest.description, pushed: latest.pushed_at }
					: null,
			};
			console.log(`github: latest ${latest ? latest.name : "none"}`);
		} catch (err) {
			out.github = previous.github || null;
			console.warn(`github: kept previous data (${err.message})`);
		}
	}

	await writeFile(FEEDS_OUT, JSON.stringify(out, null, "\t") + "\n");

	// Closed tiles, About's Lately strip and Contact only need these few fields
	const summary = {
		substack: out.substack && {
			title: out.substack.title,
			home: out.substack.home,
			count: out.substack.posts.length,
			latest: out.substack.posts[0]?.title || null,
		},
		letterboxd: out.letterboxd && {
			user: out.letterboxd.user,
			profile: out.letterboxd.profile,
			count: out.letterboxd.films.length,
			latest: out.letterboxd.films[0]
				? {
						title: out.letterboxd.films[0].title,
						year: out.letterboxd.films[0].year,
						rating: out.letterboxd.films[0].rating,
						watched: out.letterboxd.films[0].watched,
				  }
				: null,
		},
		substackLatestDate: out.substack?.posts[0]?.date || null,
		github: out.github,
	};
	await writeFile(SUMMARY_OUT, JSON.stringify(summary, null, "\t") + "\n");
};

const buildPhotos = async () => {
	let files = [];
	try {
		files = (await readdir(PHOTOS_DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
	} catch {
		// No photos folder yet
	}
	const captions = await readJson(path.join(PHOTOS_DIR, "captions.json"), {});
	const photos = [];
	for (const file of files) {
		const size = imageSize(await readFile(path.join(PHOTOS_DIR, file)));
		photos.push({
			src: `/photos/${file}`,
			width: size ? size.width : 3,
			height: size ? size.height : 2,
			caption: captions[file]?.caption || "",
			place: captions[file]?.place || "",
			date: captions[file]?.date || "",
		});
	}
	// Newest first when dated, otherwise by file name (descending)
	photos.sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.src.localeCompare(a.src));
	await writeFile(PHOTOS_OUT, JSON.stringify(photos, null, "\t") + "\n");
	console.log(`photos: ${photos.length}`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await mkdir(DATA_DIR, { recursive: true });
	await Promise.all([buildFeeds(), buildPhotos()]);
}
