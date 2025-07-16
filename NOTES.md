# Developer Notes

> A living document capturing known issues, bug-fixes, performance tweaks and troubleshooting tips for the Terminal-Style Portfolio.

---

## 1. Common Issues & Fixes

| # | Issue | Root Cause | Fix / Mitigation |
|---|-------|------------|------------------|
| 1 | **`404` for content files** | Wrong filename or path case-sensitivity on macOS vs Linux. | Always use `decodeURIComponent(params.filename)` in route handlers and verify paths with `path.join(process.cwd(), …)`. Scripts throw descriptive errors and `NextResponse` status codes. |
| 2 | **Gallery images load slowly** | Large RAW files (`.dng`) transferred on first load. | Added `/api/content/gallery/thumb` endpoint that generates **WebP** thumbnails with `sharp` (quality 75, max-width 800 px) and caches them (`max-age=31536000`). UI requests thumbs first, full image on demand. |
| 3 | **Meta lists (blogs/notes) out of order** | Array not sorted. | Server-side sort by date descending before JSON response. |
| 4 | **Vim keys not working on mobile** | Mobile virtual keyboards don’t send physical key codes. | Added clickable menu items & swipe support while keeping keyboard shortcuts for desktop. |
| 5 | **Theme flashes on initial load** | CSS variables applied after hydration. | Persist `theme` in `localStorage` and set `<html data-theme>` via an inline script in `layout.tsx` **before** React renders. |
| 6 | **ESLint memory leak on large content dir** | ESLint scanning `content/` | `.eslintignore` excludes `content/` and `public/` to limit scope. |
| 7 | **Build fails on case-sensitive CI** | `AboutClient.tsx` vs `about/` path mismatch. | Renamed files / imports to kebab-case (`about/`), enabled `forceConsistentCasingInFileNames` in `tsconfig.json`. |

## 2. Performance Optimisations

1. **Virtualised Lists** – Utilise `react-window` for Blogs, Notes & Gallery to only render visible rows.
2. **Edge-ready Caching** – All API routes return appropriate `Cache-Control` headers. Static assets are served from `public/` and receive immutable caching from the hosting platform.
3. **Turbopack Dev Server** – `next dev --turbopack` gives sub-second HMR during development.
4. **Minimal JS** – Pure CSS CRT effect (no runtime shaders), ASCII art delivered as plain-text, not base64 images.
5. **Tree-Shakable Icons** – `lucide-react` imports are per-icon to keep bundle small.

## 3. Debugging Workflow

```bash
# 1. Reproduce
npm run dev                         # start local server

# 2. Inspect API
curl -v http://localhost:3000/api/content/blogs

# 3. Lint & Type-check
npm run lint && npx tsc --noEmit

# 4. Profile performance (Chrome DevTools > Performance tab)
```

*Always commit with `git commit -S -m "msg"` to sign and push to a feature branch. PR must pass CI (lint, test, build) before merge.*

## 4. Testing Checklist

- [ ] All keyboard shortcuts work across pages
- [ ] API endpoints return 200 & correct content-type
- [ ] Light/Dark toggle persists across reloads
- [ ] Gallery thumbnails <= 100 kB
- [ ] Build succeeds on macOS & Linux runners

## 5. Future Improvements

- Integrate automated visual regression tests (Playwright)
- Offload image thumbnail generation to edge-functions
- Add Service-Worker for full offline support
- Progressive loading of RAW files via `<link rel="preload">`

---

_Last updated: {{DATE}}_ 