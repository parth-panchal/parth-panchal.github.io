# Parth Panchal

> Tech | Movies | Quizzing | Photography

## 🎨 Portfolio Site

An interactive Mondrian/De Stijl-inspired portfolio built with React and Framer Motion.

### ✨ Features

- **One Mondrian**: the home page is a single composition; every section opens inside it
- **A painting that runs** (`/hello`): Thomas Schoch's Piet "Hello, world!", executed by a real Piet interpreter, then folded into De Stijl colours
- **One composition**: opening a section re-proportions the Mondrian instead of changing pages; colour blocks re-compose it
- **Studio**: paint your own Piet program and run it
- **Writing & Films**: latest Substack posts and Letterboxd watches, refreshed daily
- **Photographs**: drop images into `public/photos/`
- **Now** and **Uses** pages
- **Projects**: live from GitHub

Personal content lives in `src/constants/content.js`; Substack and Letterboxd handles in `src/constants/feeds.json`.

### 🛠️ Development

```bash
npm install
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the development build.

---

*Built with React • Framer Motion • CSS Grid • a Piet interpreter*
