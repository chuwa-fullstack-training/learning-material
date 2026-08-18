# ReelTalk API — L18 backend

Standalone GraphQL backend for App C (Lecture 18: GraphQL). See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

Decoupled from `sample_code/graphql-demo` — no shared code, own schema, own port. `graphql-demo` remains untouched as a separate reference project.

## Run it

```bash
cd sample_code/lecture18/reeltalk-api
npm install
npm start   # http://localhost:4002/graphql
```

## What this demonstrates

- **Cursor pagination** (`resolvers/index.js`, `Query.movies`): Relay-style `edges`/`node`/`pageInfo`, `after`/`first` args.
- **The N+1 problem, for real** (`resolvers/reviewStatsLoader.js`): `Movie.reviewStats` needs each movie's review count/average rating. `reviewStatsNaive()` is the "before" version — one query per movie. It's exported but not wired into the resolver; swap it into `Movie.reviewStats` in `resolvers/index.js` during class to show the query count blow up. The shipped resolver uses `createReviewStatsLoader()` instead: a per-request `DataLoader` that batches all requested movie IDs into a single call. Watch the console — querying a page of movies logs exactly one `[DataLoader] batched reviewStats for N movies in ONE call` line, not N individual lookups.
- **Mutation + Subscription** (`resolvers/index.js`, `context.js`): `createReview` publishes to a per-movie PubSub channel (`REVIEW_ADDED_${movieId}`), and `reviewAdded(movieId)` subscribes to it — same channel-per-argument pattern used in `graphql-demo/server`, just written fresh.

## Data source

In-memory arrays (`src/data/movies.js`, `src/data/reviews.js`) — no database. Restarting the server resets everything to the seed data. Movie titles/directors are entirely fictional (no real film titles/posters, to avoid any copyright concerns); poster art is generated via [Picsum](https://picsum.photos/) placeholder images, not bundled in this repo.
