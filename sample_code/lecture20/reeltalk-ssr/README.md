# ReelTalk SSR — hand-rolled Express + React 18 SSR (unchanged since L19)

Standalone SSR harness for App C's movie detail page, introduced in Lecture 19 (Rendering Strategies, RSC & Styling). **Identical to `sample_code/lecture19/reeltalk-ssr`** — Lecture 20's new content (SSE + WebSocket) doesn't touch SSR. It's copied into `sample_code/lecture20/` so that folder is a self-contained snapshot, same convention as App A/B. See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

No SSR framework (no Next.js) — this is deliberately hand-rolled so the mechanism itself is visible, not hidden behind a framework. The only build step is bundling the client hydration script with esbuild; the server itself runs directly under plain `node`.

## Run it

You need `reeltalk-api` running first (same one from Lecture 18/19/20, port 4002):

```bash
# Terminal 1
cd sample_code/lecture19/reeltalk-api
npm install
npm start

# Terminal 2
cd sample_code/lecture19/reeltalk-ssr
npm install
npm start   # builds public/client.js, then starts the server
```

Visit `http://localhost:4003/movies/m1` (or any movie id from `reeltalk-api`'s seed data, `m1`–`m14`).

## What this demonstrates

- **Real server-side rendering** (`src/server.js`): on `GET /movies/:id`, the server calls `fetchMovie()` (a plain `fetch()` POST to `reeltalk-api`'s GraphQL endpoint — no Apollo Client here, see `fetchMovie.js`), then renders `<MovieDetailView>` to a stream with `renderToPipeableStream`. Run `curl http://localhost:4003/movies/m1` and look at the response — the movie title, synopsis, and every review are already in the raw HTML, before any client JS has run.
- **No wasted network round-trip on hydration** (`src/server.js` → `src/client.js`): the same data the server fetched is embedded in the page as `window.__INITIAL_DATA__`. `client.js` reads it directly and calls `hydrateRoot` — no second fetch to re-derive what the server already knew.
- **The exact same component, twice** (`src/MovieDetailView.js`): `server.js` and `client.js` both call this one function with the same props. This is the actual SSR contract — mismatched output between server and client render is what causes the classic "hydration mismatch" warning.
- **Why no JSX**: this file uses `createElement` directly. The server entry point runs under plain `node` with no transform step in front of it; adding JSX would mean introducing a build step for the server too (or maintaining two versions of this component). `h(...)` is exactly what JSX compiles to — same output, one less moving part for this demo specifically.

## Scoping decisions (read before assuming these are best practices)

- **`<MovieDetailView>` here is a separate copy from `reeltalk`'s CSR components**, not a shared package. Setting up a monorepo/shared-package structure for one component would add more teaching overhead than it saves — but it's a real tradeoff, not a recommendation. A production app with an actual SSR need would very likely use a framework (Next.js, Remix, etc.) that solves this for you.
- **No Apollo Server-side rendering machinery** (`getDataFromTree`, etc.) — one plain `fetch()` call keeps the focus on the SSR mechanism itself, not on a second layer of GraphQL-specific SSR tooling.
- **Styling is plain global CSS** (`public/styles.css`), independent of `reeltalk`'s CSS Modules setup — see that project's README for the styling architecture discussion.

## Relationship to React Server Components

RSC is **not implemented here** — Lecture 19's RSC coverage is concept + code-snippet only (see `pre_slides/lecture19.md`), contrasted against this hand-written SSR harness: a Server Component could `await` the GraphQL query directly and return JSX, with no `window.__INITIAL_DATA__` hand-off step and no data-fetching JS shipped to the client at all. What you're looking at in this project is the manual version of what RSC automates.
