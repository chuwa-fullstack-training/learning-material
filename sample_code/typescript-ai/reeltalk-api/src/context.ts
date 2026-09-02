import { PubSub } from 'graphql-subscriptions';
import { createReviewStatsLoader, type ReviewStats } from './resolvers/reviewStatsLoader.js';
import type DataLoader from 'dataloader';

// The per-request context shape — resolvers/index.ts imports this type
// instead of accepting `context: any`, so a typo like `context.pubsbu`
// is a compile error, not a runtime crash mid-mutation.
export interface Context {
  reviewStatsLoader: DataLoader<string, ReviewStats>;
  pubsub: PubSub;
}

// Shared across all requests/connections — what pubsub.publish() in one
// mutation needs to reach subscribers connected via a different socket.
export const pubsub = new PubSub();

export function createContext(): Context {
  return {
    reviewStatsLoader: createReviewStatsLoader(),
    pubsub,
  };
}
