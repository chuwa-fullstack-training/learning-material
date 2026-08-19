import { GraphQLError } from 'graphql';
import { movies } from '../data/movies.js';
import { reviews, nextReviewMeta } from '../data/reviews.js';
import { broadcastReview } from '../reviewsSocket.js';

export const resolvers = {
  Query: {
    // Relay-style cursor pagination: `after` is the id of the last movie
    // the client already has, `first` caps how many to return next.
    movies: (_parent, { first = 6, after }) => {
      let startIndex = 0;
      if (after) {
        const afterIndex = movies.findIndex((m) => m.id === after);
        if (afterIndex === -1) {
          throw new GraphQLError(`Invalid cursor: ${after}`);
        }
        startIndex = afterIndex + 1;
      }

      const page = movies.slice(startIndex, startIndex + first);
      const edges = page.map((movie) => ({ cursor: movie.id, node: movie }));

      return {
        edges,
        pageInfo: {
          hasNextPage: startIndex + first < movies.length,
          endCursor: edges.length ? edges[edges.length - 1].cursor : null,
        },
      };
    },

    movie: (_parent, { id }) => movies.find((m) => m.id === id) ?? null,
  },

  Mutation: {
    createReview: (_parent, { movieId, reviewerName, rating, body }, context) => {
      const movie = movies.find((m) => m.id === movieId);
      if (!movie) {
        throw new GraphQLError(`Movie not found: ${movieId}`);
      }
      if (rating < 1 || rating > 5) {
        throw new GraphQLError('rating must be between 1 and 5');
      }

      const { id, createdAt } = nextReviewMeta();
      const review = { id, movieId, reviewerName, rating, body, createdAt };
      reviews.push(review);

      // Two push mechanisms fire for the same event, on purpose:
      // 1. GraphQL subscription (from L18) — Apollo clients using
      //    useSubscription receive it via graphql-ws.
      context.pubsub.publish(`REVIEW_ADDED_${movieId}`, { reviewAdded: review });
      // 2. Raw WebSocket broadcast (new in L20) — clients connected to
      //    /ws/reviews receive it. This is the hand-written equivalent of
      //    #1; the L20 frontend uses this one instead of the subscription.
      broadcastReview(review);

      return review;
    },
  },

  Subscription: {
    reviewAdded: {
      subscribe: (_parent, { movieId }, context) =>
        context.pubsub.asyncIterator([`REVIEW_ADDED_${movieId}`]),
    },
  },

  Movie: {
    reviews: (movie) => reviews.filter((r) => r.movieId === movie.id),

    // The DataLoader-backed version — see resolvers/reviewStatsLoader.js
    // for the naive "one query per movie" version this replaces.
    reviewStats: (movie, _args, context) => context.reviewStatsLoader.load(movie.id),
  },
};
