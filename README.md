# Terminal-Style Portfolio Website

A retro, keyboard-first personal portfolio built with **Next.js 15**, **TypeScript** and **Tailwind CSS**. The interface emulates a UNIX terminal complete with Vim-style navigation, scan-lines and a CRT-like glow.

**Live demo →** <https://portfolio.strikeraryu.com>

## Table of Contents
1. [Features](#-features)
2. [Keyboard Navigation](#-keyboard-navigation)
3. [Quick Start](#-quick-start)
4. [Content Model](#-content-model)
5. [REST API](#-rest-api)
6. [Project Structure](#-project-structure)
7. [Configuration & Theming](#-configuration--theming)
8. [Scripts](#-scripts)
9. [Deployment](#-deployment)
10. [Contributing](#-contributing)
11. [License](#-license)
12. [Author](#author)

## 🚀 Features

- Vim-inspired shortcuts & keyboard-first UX
- Fully configurable content stored as Markdown / plain-text – **no databases**
- Dynamic Markdown rendering (blogs, notes, about)
- Photo gallery with pagination & on-the-fly WebP thumbnails (powered by `sharp`)
- Lazy-loaded, virtualised lists for ⚡ lightning-fast navigation
- Light/Dark themes with authentic CRT scan-line effects
- Modern **Next.js 15** (App Router, Streaming, Route Handlers)
- Type-safe codebase with ESLint & strict TypeScript
- Accessible & fully responsive design

## ⌨️ Keyboard Navigation

```
H   Home            G   Gallery
B   Blogs           A   About
N   Notes           L   Links
P   Projects        T   Toggle Theme
J/K  ↑/↓   Scroll   [ ] Previous/Next item
1-9  Quick select   /   Focus search
Q / ESC  Exit to Home
```

## ⚡ Quick Start

1. **Clone & install**
   ```bash
   git clone https://github.com/aryamaanjain/portfolio.git
   cd portfolio
   npm install
   ```
2. **Run the dev server**
   ```bash
   npm run dev
   ```
3. Open <http://localhost:3000> and start typing!

> Requires **Node 20+**.

## 🗂️ Content Model

All user-editable content lives under the `content/` folder and can be updated without touching the code-base.

```
content/
├── home.txt                  # ASCII splash screen
├── logo.txt                  # ASCII logo
├── about/
│   ├── 1.md                  # Short bio
│   ├── 2.md                  # Medium bio
│   ├── 3.md                  # Long bio
│   └── 4.md                  # CV-style bio
├── blogs/
│   ├── meta.json             # Blog metadata (title, subtitle, date)
│   └── *.md                  # Blog posts
├── notes/
│   ├── meta.json
│   └── *.md                  # Quick notes & snippets
└── gallery/
    ├── *.jpg|png|webp|dng    # Raw photos
    └── story/                # Image essays in Markdown
```

Editing any file triggers hot-reloading – changes are reflected instantly.

## 🧩 REST API

Every piece of content is exposed through read-only HTTP endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content/home` | ASCII for home page |
| GET | `/api/content/logo` | ASCII logo |
| GET | `/api/content/about/{id}` | Bio where **id** ∈ `1-4` |
| GET | `/api/content/blogs` | List of blog metadata |
| GET | `/api/content/blogs/{filename}` | Raw Markdown of a blog |
| GET | `/api/content/notes` | List of notes metadata |
| GET | `/api/content/notes/{filename}` | Raw Markdown of a note |
| GET | `/api/content/gallery/images?offset=0&limit=24` | Paginated list of image filenames |
| GET | `/api/content/gallery/{filename}` | Original image / RAW file |
| GET | `/api/content/gallery/thumb?filename=<file>&w=400` | WebP thumbnail (resized on-the-fly) |

All endpoints send appropriate **Cache-Control** headers for optimal performance.

## 🏗️ Project Structure

```
portfolio/
├── config.json               # Global configuration & theming
├── content/                  # Markdown & media (see above)
├── public/                   # Static assets (favicons, SVGs, etc.)
└── src/
    ├── app/                  # Next.js App Router pages
    │   ├── api/              # Route Handlers (REST API)
    │   ├── components/       # Client components (home, gallery, etc.)
    │   ├── blogs/[filename]/ # Dynamic blog route
    │   ├── notes/[filename]/ # Dynamic notes route
    │   └── ...               # Other sections (about, projects, links)
    ├── components/           # Re-usable shared components
    └── types/                # Global TS types & shims
```

## 🎨 Configuration & Theming

Everything from your name to the colour palette lives in **`config.json`**.

```json
{
  "personal": { "name": "Aryamaan Jain", "site": "https://..." },
  "navigation": {
    "sections": [ { "name": "Blogs", "shortcut": "B", "path": "/blogs" } ]
  },
  "theme": {
    "current": "dark",
    "colors": { "dark": { "background": "#000000", "accent": "#C7D274" } }
  }
}
```

Tweak the `theme.colors.dark` and `theme.colors.light` objects to craft your own vibe. Fonts are defined under `theme.fonts`.

## 📜 Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (**Turbopack**) |
| `npm run build` | Production build |
| `npm run start` | Start built app |
| `npm run lint` | ESLint check |

## ☁️ Deployment

The site is 100 % static + edge-friendly (no databases), making deployment painless.

### Vercel
```bash
vercel deploy --prod
```

### Netlify
```bash
npm run build
netlify deploy --dir .next
```

## 🙋 Contributing

Pull requests are welcome! Please open an issue first to discuss what you would like to change.

## 📝 License

[MIT](LICENSE) © Aryamaan Jain

---

Made with ❤️ & a healthy dose of nostalgia.
