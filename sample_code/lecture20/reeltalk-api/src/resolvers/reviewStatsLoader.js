import DataLoader from 'dataloader';
import { reviews } from '../data/reviews.js';

function computeStats(movieReviews) {
  const count = movieReviews.length;
  const averageRating = count
    ? movieReviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;
  return { count, averageRating };
}

// --- The naive version (kept for live teaching contrast) ---------------
// This is what Movie.reviewStats looked like before DataLoader: one query
// per movie, every time. Swap this in for the batched resolver below (see
// resolvers/index.js) to show, live, that a 14-movie list triggers 14
// separate lookups — the classic N+1 problem. Not used in the shipped
// resolver; kept here only as the "before" half of the demo.
let naiveQueryCount = 0;
export function reviewStatsNaive(movieId) {
  naiveQueryCount += 1;
  console.log(`[naive] queried reviews for movie ${movieId} (query #${naiveQueryCount})`);
  return computeStats(reviews.filter((r) => r.movieId === movieId));
}

// --- The DataLoader-backed version (what actually ships) ---------------
// One instance per request (created fresh in context.js) — DataLoader
// caches per-instance, and sharing one across requests would leak stale
// data between unrelated requests.
export function createReviewStatsLoader() {
  return new DataLoader(async (movieIds) => {
    console.log(`[DataLoader] batched reviewStats for ${movieIds.length} movies in ONE call`);
    return movieIds.map((movieId) =>
      computeStats(reviews.filter((r) => r.movieId === movieId)),
    );
  });
}
