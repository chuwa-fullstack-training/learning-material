# SSR, RSC & Styling Architecture

> 🟢 **Use AI freely — focus on understanding, not on wiring.** The classroom demo (ReelTalk) shows hand-written SSR and a CSS Modules theme; **apply the ideas to your own app.** Submit an AI Usage Log.

Continue from your L18 Todo Boards app. Three parts: hand-write SSR for one page, reason about RSC in writing, and rebuild your styling with CSS Modules + theming.

## Part A — Hand-written SSR (one page)

Pick one **read-heavy** page (e.g., a public "view board" page) and server-render it **without a framework** (no Next.js).

- [ ] Express route that fetches the page's data on the server, then `renderToPipeableStream` → HTML
- [ ] Embed the fetched data as `window.__INITIAL_DATA__`
- [ ] Client uses `hydrateRoot` and reads `__INITIAL_DATA__` — **no second fetch** on hydration
- [ ] Prove it: `curl` (or view-source) shows the content already in the HTML, not an empty `<div id="root">`
- [ ] In a comment or note, identify one thing that would cause a **hydration mismatch** and how you avoided it

## Part B — RSC (written, no code required)

- [ ] In `rsc.md`, sketch (pseudo-code is fine) the same page as a **React Server Component**, and answer:
  - Which parts would need `'use client'`, and why?
  - Which specific step from your Part A SSR does RSC remove? (Hint: the `__INITIAL_DATA__` hand-off.)
  - What can a Server Component NOT do, and why?

## Part C — Styling architecture

- [ ] Migrate your app's styles to **CSS Modules** (`*.module.css` per component)
- [ ] Extract **design tokens** as CSS custom properties (colors, spacing, radii)
- [ ] Add a **dark/light theme toggle** that works by flipping a `data-theme` attribute on `<html>` — the color change must NOT require any component to re-render (verify in DevTools: only the attribute changes)

## AI Usage Log

Submit `ai-usage-log.md` covering: SSR wiring, the RSC write-up, and the styling migration — noting what you delegated vs decided yourself.
