# ReelTalk — L19 (v0.2)

Course demo App C for Lecture 19 (Rendering Strategies, RSC & Styling), continuing from `sample_code/lecture18/reeltalk` (v0.1). Pairs with `sample_code/lecture19/reeltalk-api` (unchanged since Lecture 18) and `sample_code/lecture19/reeltalk-ssr` (new this lecture). See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

No GraphQL/data functionality changed this lecture — this project is the same CSR app from Lecture 18, restyled.

## Run it

```bash
# Terminal 1
cd sample_code/lecture19/reeltalk-api
npm install
npm start   # http://localhost:4002/graphql

# Terminal 2
cd sample_code/lecture19/reeltalk
npm install
npm run dev   # http://localhost:5173
```

## What this demonstrates

- **CSS Modules, not global classnames** (`src/components/*.module.css`): every component's styles live in its own file, scoped automatically — compare `components/MovieList.jsx` here to Lecture 18's version. The JSX barely changes (`className="movie-card"` becomes `className={styles.card}`); what changes is that `.card` in `MovieList.module.css` can never collide with a `.card` class in some other file.
- **Design tokens as CSS custom properties** (`src/styles/tokens.css`): every color, spacing value, and radius is a `var(--...)`, not a hardcoded value repeated across files.
- **Theming with zero component re-renders** (`src/context/ThemeContext.jsx`): toggling the theme button sets `document.documentElement.dataset.theme`, and `tokens.css`'s `:root[data-theme='light']` override does the rest. No component reads a "theme" value from props or context to decide what color to render — the browser repaints based on the CSS variable change alone. Open DevTools' Elements panel while toggling: only the `<html>` element's `data-theme` attribute changes.
- **Context, still doing a UI-preference job, not a data job** (`ThemeContext.jsx`): same `useReducer` + Context shape as App B's `ViewPreferencesContext` (`sample_code/lecture16/habit-tracker`) — simple, synchronous, no async data. The GraphQL data (movies, reviews) still flows through Apollo Client, untouched.

## Relationship to SSR and RSC (see `reeltalk-ssr` and `pre_slides/lecture19.md`)

This CSR app's movie detail page (`components/MovieDetail.jsx`) still fetches client-side via `useQuery` — that hasn't changed. The **actual** SSR implementation for the movie detail page lives in the separate `sample_code/lecture19/reeltalk-ssr` project, deliberately kept independent (see that project's README for why). React Server Components are not implemented anywhere in App C — Lecture 19 covers RSC as a concept + code snippets only, contrasted against `reeltalk-ssr`'s hand-written approach.

## Data source

Talks to `reeltalk-api` (in-memory data, no database) — same backend, unchanged since Lecture 18.
