import { WebSocketServer } from 'ws';

// A raw WebSocket server for broadcasting new reviews — the hand-written
// counterpart to the graphql-ws subscription that ReelTalk already has
// (see resolvers/index.js `Subscription.reviewAdded`). Both stay wired up
// on purpose so the lecture can contrast them side by side.
//
// `noServer: true`: this server does NOT attach its own 'upgrade' listener
// to an HTTP server. index.js owns a single upgrade handler that routes by
// path — necessary because the graphql-ws server also needs the same HTTP
// server, and two { server, path } WebSocketServers on one HTTP server
// fight over the upgrade event. Routing upgrades by path ourselves is one
// of the things graphql-ws / Apollo does for you under the hood.
export const reviewsWss = new WebSocketServer({ noServer: true });

reviewsWss.on('connection', (ws, request) => {
  // A raw socket has no notion of "subscription arguments" — the client
  // has to tell us what it wants some other way. Here it's a query-string
  // param on the connection URL (ws://.../ws/reviews?movieId=m1). We stash
  // it on the socket so broadcast() can filter. This manual scope tracking
  // is exactly what a GraphQL subscription's `subscribe(_, { movieId })`
  // argument handles for you.
  const url = new URL(request.url, `http://${request.headers.host}`);
  ws.movieId = url.searchParams.get('movieId');
});

// Called from the createReview resolver after a review is persisted.
export function broadcastReview(review) {
  const message = JSON.stringify(review);
  for (const ws of reviewsWss.clients) {
    // Manual scope filtering + readyState check + serialization —
    // all of which graphql-ws does automatically per subscriber.
    if (ws.readyState === ws.OPEN && ws.movieId === review.movieId) {
      ws.send(message);
    }
  }
}
