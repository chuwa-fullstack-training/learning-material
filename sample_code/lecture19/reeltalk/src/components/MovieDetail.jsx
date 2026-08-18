import { useQuery, useSubscription } from '@apollo/client';
import { MOVIE_QUERY, REVIEW_ADDED_SUBSCRIPTION } from '../queries';
import { appendReviewToCache } from '../cache/appendReview';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import styles from './MovieDetail.module.css';

export default function MovieDetail({ movieId }) {
  const { data, loading, error } = useQuery(MOVIE_QUERY, {
    variables: { id: movieId },
    skip: !movieId,
  });

  useSubscription(REVIEW_ADDED_SUBSCRIPTION, {
    variables: { movieId },
    skip: !movieId,
    onData: ({ client, data: subscriptionData }) => {
      const review = subscriptionData.data?.reviewAdded;
      if (review) appendReviewToCache(client.cache, review);
    },
  });

  if (!movieId) return <p className={styles.placeholder}>Select a movie to see reviews.</p>;
  if (loading && !data) return <p>Loading movie...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const movie = data.movie;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div>
      <div className={styles.header}>
        <img className={styles.poster} src={movie.posterUrl} alt="" width={120} height={180} />
        <div>
          <h2>{movie.title}</h2>
          <p>
            {movie.releaseYear} · {movie.runtimeMinutes} min · dir. {movie.director}
          </p>
          <p className={styles.genres}>{movie.genres.join(', ')}</p>
          <p>{movie.synopsis}</p>
        </div>
      </div>

      <h3>
        Reviews ({movie.reviewStats.count})
        {movie.reviewStats.count > 0 && ` · average ⭐ ${movie.reviewStats.averageRating.toFixed(1)}`}
      </h3>
      <ReviewForm movieId={movie.id} />
      <ReviewList reviews={movie.reviews} />
    </div>
  );
}
