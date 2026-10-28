# Parth Panchal

> Tech | Movies | Quizzing | Photography

## 🎨 Portfolio Site

An interactive Mondrian/De Stijl-inspired portfolio built with React and Framer Motion.

### ✨ Features

- **One Mondrian**: the home page is a single composition; opening a section re-proportions it instead of changing pages, and the colour blocks re-compose it
- **A painting that runs** (`/hello`): Thomas Schoch's Piet "Hello, world!", executed by a real Piet interpreter, then folded into De Stijl colours
- **Studio**: paint your own Piet program and run it
- **Writing & Films**: latest Substack posts and Letterboxd watches, refreshed daily
- **Photographs**: drop images into `public/photos/`
- **About**: an introduction, plus what I've been up to lately, pulled from the feeds
- **Quizzing** and **Kit**: questions I like, and what I shoot and work with
- **Projects**: live from GitHub

Personal content lives in `src/constants/content.js`; Substack and Letterboxd handles in `src/constants/feeds.json`.

### 🛠️ Development

```bash
npm install
npm start          # development server on localhost:3000
npm run preview    # production build on localhost:4173
npm run deploy     # publish to GitHub Pages
```

---

*Built with React • Framer Motion • CSS Grid • a Piet interpreter*
