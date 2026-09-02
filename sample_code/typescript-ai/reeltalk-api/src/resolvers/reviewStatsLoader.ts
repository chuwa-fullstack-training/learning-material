import DataLoader from 'dataloader';
import { reviews } from '../data/reviews.js';

export interface ReviewStats {
  count: number;
  averageRating: number;
}

function computeStats(movieReviews: { rating: number }[]): ReviewStats {
  const count = movieReviews.length;
  const averageRating = count
    ? movieReviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;
  return { count, averageRating };
}

// One DataLoader instance per request — see context.ts. Batches all
// `Movie.reviewStats` lookups triggered while resolving one query into a
// single pass over `reviews`, instead of one scan per movie (N+1).
export function createReviewStatsLoader(): DataLoader<string, ReviewStats> {
  return new DataLoader<string, ReviewStats>(async (movieIds) => {
    console.log(`[DataLoader] batched reviewStats for ${movieIds.length} movies in ONE call`);
    return movieIds.map((movieId) =>
      computeStats(reviews.filter((r) => r.movieId === movieId)),
    );
  });
}
