import { gql } from '@apollo/client';

const REVIEW_FRAGMENT = gql`
  fragment NewlyAddedReview on Review {
    id
    movieId
    reviewerName
    rating
    body
    createdAt
  }
`;

// Compare to graphql-demo's CreatePost.tsx, which just calls refetchQueries
// after a mutation — simple, but it means re-fetching the ENTIRE movie
// query every time. Here we surgically append the one new review and
// recompute reviewStats in place, no network round-trip.
//
// This same helper is called from two places that can race each other:
// the mutation's own `update` callback (fires immediately for whoever
// submitted the review) and the subscription's `onData` handler (fires
// for every client watching this movie, including the submitter, once the
// server publishes it). Whichever one runs first wins; the dedupe check
// below makes the second call a no-op instead of double-counting.
//
// The dedupe check is done via an explicit `readFragment` BEFORE calling
// `cache.modify`, not via a shared flag between the `reviews` and
// `reviewStats` field modifiers below — `cache.modify` invokes field
// modifiers in the order fields exist in the normalized store (which
// follows the query's selection order), not the order they're declared in
// this `fields` object, so a cross-field closure flag is not reliable here.
export function appendReviewToCache(cache, review) {
  const movieRef = cache.identify({ __typename: 'Movie', id: review.movieId });
  if (!movieRef) return;

  const existing = cache.readFragment({
    id: movieRef,
    fragment: gql`
      fragment ExistingReviewIds on Movie {
        reviews {
          id
        }
      }
    `,
  });
  const alreadyPresent = existing?.reviews?.some((r) => r.id === review.id);
  if (alreadyPresent) return;

  cache.modify({
    id: movieRef,
    fields: {
      reviews(existingRefs = []) {
        const newRef = cache.writeFragment({ data: review, fragment: REVIEW_FRAGMENT });
        return [...existingRefs, newRef];
      },
      reviewStats(existingStats) {
        if (!existingStats) return existingStats;
        const count = existingStats.count + 1;
        const previousTotal = existingStats.averageRating * existingStats.count;
        return { ...existingStats, count, averageRating: (previousTotal + review.rating) / count };
      },
    },
  });
}
