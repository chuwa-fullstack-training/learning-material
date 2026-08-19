import { PubSub } from 'graphql-subscriptions';
import { createReviewStatsLoader } from './resolvers/reviewStatsLoader.js';

// Shared across all requests/connections — this is what pubsub.publish()
// in one mutation needs to reach subscribers connected via a different
// WebSocket connection.
export const pubsub = new PubSub();

// Called fresh for every HTTP request AND every WebSocket connection.
// The DataLoader instance must be per-request: it caches by key for the
// lifetime of one request, and reusing it across requests would return
// stale reviewStats to a later, unrelated query.
export function createContext() {
  return {
    reviewStatsLoader: createReviewStatsLoader(),
    pubsub,
  };
}
