# ReelTalk API (TS) — TypeScript in AI Development bonus lecture

Standalone backend for the `typescript-ai` bonus lecture (not part of the L1–L20 numbered sequence). A **TypeScript port** of `sample_code/lecture20/reeltalk-api`, with one addition: the SSE "AI summary" endpoint is upgraded from a bare string to a **zod-validated structured output**.

Decoupled from every other `sample_code/` project — own port (`4003`), own `node_modules`, no shared code.

## Run it

```bash
cd sample_code/typescript-ai/reeltalk-api
npm install
npm run dev
```

Endpoints:
- GraphQL (queries/mutations): `http://localhost:4003/graphql`
- GraphQL subscriptions (graphql-ws): `ws://localhost:4003/graphql`
- **Structured SSE summary**: `http://localhost:4003/movies/<id>/summary`
- Raw review WebSocket: `ws://localhost:4003/ws/reviews?movieId=<id>`

## What's new here (vs. L20)

- **`src/schema/movieSummary.ts`**: the single source of truth for what an "AI summary" is — a zod schema (`rating`, `verdict`, `tags`). The TypeScript type (`MovieSummary`) is `z.infer`'d from it, not hand-written.
- **`src/summarySSE.ts`**: the generated summary is treated as `unknown` and run through `MovieSummarySchema.safeParse()` before it's allowed anywhere near the response — the same posture you'd need for a real LLM's JSON output, just with a deterministic template standing in for the model. A validation failure degrades to a `500`, not a crash. The verdict still streams token-by-token over the same SSE wire format as L20; the named `done` event now carries the validated `{ rating, tags }` tail as JSON.
- Everything else (`resolvers`, `context`, `reviewsSocket`, `index.ts`) is the same L20 design, just typed — see `src/types.ts` for the `Movie`/`Review` interfaces threaded through the resolvers, loader, and sockets.

## Also still here from L18–L20

Cursor pagination, DataLoader-backed `reviewStats`, GraphQL subscription + raw WebSocket broadcast running side by side — see `sample_code/lecture18/reeltalk-api/README.md` and `sample_code/lecture20/reeltalk-api/README.md` for the original explanations; unchanged here except for types.

## Data source

In-memory arrays (`src/data/movies.ts`, `src/data/reviews.ts`) — no database, resets on restart.
