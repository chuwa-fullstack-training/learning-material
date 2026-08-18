# ReelTalk — L18 (v0.1)

Course demo App C for Lecture 18 (GraphQL), pairing with `sample_code/lecture18/reeltalk-api`. See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

This is the **starting point** of App C. Lecture 19 continues from this code (`sample_code/lecture19/reeltalk`), adding SSR for the movie detail page and a styling overhaul.

## Run it

You need the backend running first:

```bash
# Terminal 1
cd sample_code/lecture18/reeltalk-api
npm install
npm start   # http://localhost:4002/graphql

# Terminal 2
cd sample_code/lecture18/reeltalk
npm install
npm run dev   # http://localhost:5173
```

## What this demonstrates

- **Cursor pagination** (`components/MovieList.jsx`): `fetchMore` with an `after` cursor; the `movies` field's `merge()` policy in `apolloClient.js` appends pages instead of replacing them (compare to `graphql-demo/client`'s equivalent `posts` policy).
- **N+1 → DataLoader** (backend-side, but visible from here): open the backend's terminal while browsing the movie list — you'll see one `[DataLoader] batched reviewStats for N movies in ONE call` log line per page load, not N individual queries.
- **Mutation + Subscription working together** (`components/ReviewForm.jsx`, `components/MovieDetail.jsx`): posting a review updates the UI **twice** in principle — once immediately via the mutation's own cache update, and once via the `reviewAdded` subscription (which every viewer of that movie, including the submitter, is subscribed to). `cache/appendReview.js` dedupes so it only actually applies once. Open the movie detail page in two browser tabs and post a review in one — it appears live in the other via the subscription.
- **Precise cache updates, not `refetchQueries`** (`cache/appendReview.js`): compare this to `graphql-demo/client/src/components/CreatePost.tsx`, which refetches the whole query after every mutation. Here, `cache.modify` + `cache.writeFragment` surgically append the one new review and recompute `reviewStats`, no network round-trip.

## Data source

Talks to `reeltalk-api` (in-memory data, no database). No mock data lives in this frontend project — everything comes from the GraphQL API.
