import { GraphQLError } from 'graphql';
import { movies } from '../data/movies.js';
import { reviews, nextReviewMeta } from '../data/reviews.js';
import { broadcastReview } from '../reviewsSocket.js';
import type { Context } from '../context.js';
import type { Movie, Review } from '../types.js';

interface MoviesArgs {
  first?: number;
  after?: string | null;
}

interface CreateReviewArgs {
  movieId: string;
  reviewerName: string;
  rating: number;
  body: string;
}

export const resolvers = {
  Query: {
    // Relay-style cursor pagination: `after` is the id of the last movie
    // the client already has, `first` caps how many to return next.
    movies: (_parent: unknown, { first = 6, after }: MoviesArgs) => {
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

    movie: (_parent: unknown, { id }: { id: string }) => movies.find((m) => m.id === id) ?? null,
  },

  Mutation: {
    createReview: (_parent: unknown, args: CreateReviewArgs, context: Context): Review => {
      const { movieId, reviewerName, rating, body } = args;
      const movie = movies.find((m) => m.id === movieId);
      if (!movie) {
        throw new GraphQLError(`Movie not found: ${movieId}`);
      }
      if (rating < 1 || rating > 5) {
        throw new GraphQLError('rating must be between 1 and 5');
      }

      const { id, createdAt } = nextReviewMeta();
      const review: Review = { id, movieId, reviewerName, rating, body, createdAt };
      reviews.push(review);

      // Two push mechanisms fire for the same event, on purpose — same
      // contrast as L20, unrelated to the TS conversion.
      context.pubsub.publish(`REVIEW_ADDED_${movieId}`, { reviewAdded: review });
      broadcastReview(review);

      return review;
    },
  },

  Subscription: {
    reviewAdded: {
      subscribe: (_parent: unknown, { movieId }: { movieId: string }, context: Context) =>
        context.pubsub.asyncIterator([`REVIEW_ADDED_${movieId}`]),
    },
  },

  Movie: {
    reviews: (movie: Movie) => reviews.filter((r) => r.movieId === movie.id),
    reviewStats: (movie: Movie, _args: unknown, context: Context) =>
      context.reviewStatsLoader.load(movie.id),
  },
};
