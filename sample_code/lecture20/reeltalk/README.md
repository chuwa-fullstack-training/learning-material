# ReelTalk — L20 (v0.3)

Course demo App C for Lecture 20 (Server-Sent Events & WebSocket), continuing from `sample_code/lecture19/reeltalk` (v0.2). Pairs with `sample_code/lecture20/reeltalk-api` (extended with SSE + raw WebSocket this lecture) and `sample_code/lecture20/reeltalk-ssr` (unchanged since L19). See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

This is App C's **final** version.

## Run it

```bash
# Terminal 1
cd sample_code/lecture20/reeltalk-api
npm install
npm start   # http://localhost:4002

# Terminal 2
cd sample_code/lecture20/reeltalk
npm install
npm run dev   # http://localhost:5173
```

## What this demonstrates (new in L20)

- **Server-Sent Events via `EventSource`** (`hooks/useAiSummary.js`, `components/AiSummary.jsx`): the "✨ Generate AI summary" button opens an `EventSource` to the backend's SSE endpoint and accumulates tokens into a growing string — the word-by-word "typing" effect of an AI chat reply. Note the named `done` event handling (EventSource stays open, and even auto-reconnects, unless you close it explicitly) and `EventSource`'s GET-only limitation (fine here; the file comments point to the `fetch` + `ReadableStream` alternative for when you need to POST).
- **Raw WebSocket, replacing `useSubscription`** (`hooks/useReviewSocket.js`): the "new reviews arrive live" feature — done with Apollo's `useSubscription` in L18/L19 — is now hand-rolled over a raw `WebSocket`. Open the movie detail in two tabs, post a review in one, watch it appear in the other. What you now do by hand (and what graphql-ws did for you before):
  - open the socket and pass the movie id as a **query-string param** (a raw socket has no "subscription arguments")
  - **parse** each message from a string, and **re-attach `__typename`** — the raw payload is plain JSON, whereas Apollo auto-tagged the subscription response so its cache could normalize it (this exact omission is a real bug you'll hit if you forget it)
  - **close** the socket on unmount / movie change
- **The mutation cache update + live push still coexist** (`cache/appendReview.js`, unchanged): the submitter's own mutation `update` callback and the incoming WS push both call `appendReviewToCache`, which dedupes by review id — same as L18/L19, just with the "other clients" transport swapped from graphql-ws to raw WS.

## Note on the GraphQL subscription

The backend still supports the `reviewAdded` GraphQL subscription (`queries.js` still exports `REVIEW_ADDED_SUBSCRIPTION`), but this frontend no longer uses it — L20 deliberately hand-writes the raw-WebSocket equivalent to show what the subscription abstracts. You can still exercise the subscription from Apollo Sandbox to compare.

## Data source

Talks to `reeltalk-api` (in-memory data, no database).
