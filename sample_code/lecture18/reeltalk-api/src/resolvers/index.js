import { GraphQLError } from 'graphql';
import { movies } from '../data/movies.js';
import { reviews, nextReviewMeta } from '../data/reviews.js';

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

      // Channel name is scoped by movieId (same pattern as graphql-demo's
      // `POST_UPDATED_${id}`), so we don't need a withFilter subscribe —
      // only clients subscribed to THIS movie's channel receive it.
      context.pubsub.publish(`REVIEW_ADDED_${movieId}`, { reviewAdded: review });

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
