# ReelTalk (TS) — TypeScript in AI Development bonus lecture

Frontend companion to `sample_code/typescript-ai/reeltalk-api`. A TypeScript port of `sample_code/lecture20/reeltalk`'s AI-summary slice — most of the app is untouched `.jsx`/`.js` from L20; only the files that touch the AI summary contract were converted, on purpose, to keep the diff focused on what this lecture is actually about.

## Run it

```bash
# Terminal 1
cd sample_code/typescript-ai/reeltalk-api
npm install && npm run dev   # http://localhost:4003

# Terminal 2
cd sample_code/typescript-ai/reeltalk
npm install && npm run dev   # http://localhost:5173
```

## What's new here (vs. L20)

- **`src/schema/movieSummary.ts`**: the client's copy of the zod contract (deliberately duplicated, not imported, from the backend's schema — see the file comment; this repo keeps frontend/backend fully independent).
- **`src/hooks/useAiSummary.ts`**: rewritten around a **discriminated union** (`AiSummaryState`) instead of a bare `{ text, status }` pair. `status` is the discriminant — TypeScript will not let you read `.rating` or `.tags` unless `status === 'done'`. The `done` event's JSON payload is `JSON.parse`'d, then re-validated with `MovieSummaryTailSchema.safeParse()` — the client does not trust "the server already checked this."
- **`src/components/AiSummary.tsx`**: renders the rating (as stars) and tags once the union has narrowed to `'done'`.
- Everything else — `MovieList`, `MovieDetail`, `ReviewForm`, `ReviewList`, `useReviewSocket`, `appendReviewToCache`, theming — is the unchanged L20 `.jsx`/`.js`, still fully interoperable with the new `.ts`/`.tsx` files via `allowJs` in `tsconfig.json`.

## Type-checking

```bash
npx tsc --noEmit
```

This project uses Vite's default transpile-only dev server (no separate type-check step in `dev`), same as `graphql-demo/client` — run `tsc --noEmit` yourself, or wire it into `build`, to actually enforce types before shipping.
