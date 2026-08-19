# ReelTalk API — L20 backend (GraphQL + SSE + raw WebSocket)

Standalone backend for App C. See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

Extends the Lecture 18/19 GraphQL backend with two new real-time transports for Lecture 20 — a Server-Sent Events endpoint and a raw WebSocket broadcast — added **alongside** the existing GraphQL layer (which is unchanged), so the lecture can contrast all three.

Decoupled from `sample_code/graphql-demo` — no shared code, own schema, own port.

## Run it

```bash
cd sample_code/lecture20/reeltalk-api
npm install
npm start
```

Endpoints:
- GraphQL (queries/mutations): `http://localhost:4002/graphql`
- GraphQL subscriptions (graphql-ws): `ws://localhost:4002/graphql`
- **SSE summary (new)**: `http://localhost:4002/movies/<id>/summary`
- **Raw review WebSocket (new)**: `ws://localhost:4002/ws/reviews?movieId=<id>`

## What this demonstrates (new in L20)

- **Server-Sent Events** (`src/summarySSE.js`): `GET /movies/:id/summary` streams a spoiler-free "AI summary" token by token over `text/event-stream` — the same word-by-word effect as an AI chat UI. The text is a deterministic template built from the movie's own fields; **no real LLM / API key** is involved, the point is the streaming transport. Note the three SSE headers, the `data: <token>\n\n` wire format, the named `done` event, and the `req.on('close')` cleanup for when a client disconnects mid-stream.
- **Raw WebSocket broadcast** (`src/reviewsSocket.js`): the hand-written counterpart to the GraphQL subscription. `createReview` now fires **both** the GraphQL `pubsub.publish` (from L18, still there) **and** `broadcastReview()` (new). The raw version makes visible everything graphql-ws does for you automatically:
  - **Subscription scope**: the client passes `?movieId=` on the connection URL; the server stashes it on the socket and filters broadcasts by it (a GraphQL subscription's `subscribe(_, { movieId })` argument handles this for you).
  - **Connection registry, readyState checks, and JSON serialization**: all manual in `broadcastReview()`.
- **Upgrade routing by path** (`src/index.js`): both WebSocket servers use `noServer: true`, and a single `httpServer.on('upgrade', ...)` handler routes by pathname (`/graphql` → graphql-ws, `/ws/reviews` → raw). Two `{ server, path }` WebSocketServers on one HTTP server would clash over the upgrade event — routing upgrades ourselves is another thing graphql-ws hides.

## Also still here from L18

- **Cursor pagination** (`Query.movies`), **N+1 → DataLoader** (`resolvers/reviewStatsLoader.js`, with the naive version kept for live contrast), and the **GraphQL subscription** (`Subscription.reviewAdded`) — see `sample_code/lecture18/reeltalk-api/README.md` for details.

## Data source

In-memory arrays (`src/data/movies.js`, `src/data/reviews.js`) — no database, resets on restart. Fictional movie titles/directors; poster art via [Picsum](https://picsum.photos/).
