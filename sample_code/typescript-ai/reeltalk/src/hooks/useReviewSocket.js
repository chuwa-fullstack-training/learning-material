import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { appendReviewToCache } from '../cache/appendReview';
import { WS_BASE } from '../config';

// The hand-written replacement for L18/L19's `useSubscription`. Everything
// Apollo did for you automatically, you now do by hand:
//   - open the connection (and pass the "subscription scope" — movieId —
//     as a query-string param, since a raw socket has no argument concept)
//   - parse each incoming message from a string into an object
//   - close the connection on unmount / when movieId changes
// The payload the server sends over this socket is the same review object
// the GraphQL subscription delivered, so appendReviewToCache is reused
// unchanged — including its dedupe, which still matters because the
// mutation's own `update` callback also appends for the submitter.
export function useReviewSocket(movieId) {
  const client = useApolloClient();

  useEffect(() => {
    if (!movieId) return undefined;

    const socket = new WebSocket(`${WS_BASE}/ws/reviews?movieId=${movieId}`);

    socket.addEventListener('message', (event) => {
      const review = JSON.parse(event.data);
      // The raw socket delivers plain JSON — no `__typename`. When this
      // same review arrived via the GraphQL subscription (L18/L19), Apollo
      // tagged it `__typename: "Review"` automatically; the cache needs
      // that tag to normalize the object, so we add it back by hand here.
      // (One more thing graphql-ws was quietly doing for you.)
      appendReviewToCache(client.cache, { __typename: 'Review', ...review });
    });

    // Without this cleanup, switching movies would leak an open socket per
    // switch — the raw-socket equivalent of forgetting to unsubscribe.
    return () => socket.close();
  }, [movieId, client]);
}
