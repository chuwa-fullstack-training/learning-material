import { useQuery } from '@apollo/client';
import { MOVIE_QUERY } from '../queries';
import { useReviewSocket } from '../hooks/useReviewSocket';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import AiSummary from './AiSummary';
import styles from './MovieDetail.module.css';

export default function MovieDetail({ movieId }) {
  const { data, loading, error } = useQuery(MOVIE_QUERY, {
    variables: { id: movieId },
    skip: !movieId,
  });

  // L18/L19 used Apollo's useSubscription here. L20 hand-rolls the same
  // "new reviews arrive live" feature over a raw WebSocket instead — see
  // hooks/useReviewSocket.js. Same result, but now you can see the
  // connection/parsing/scope work that graphql-ws was doing for you.
  useReviewSocket(movieId);

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

      <AiSummary movieId={movie.id} />

      <h3>
        Reviews ({movie.reviewStats.count})
        {movie.reviewStats.count > 0 && ` · average ⭐ ${movie.reviewStats.averageRating.toFixed(1)}`}
      </h3>
      <ReviewForm movieId={movie.id} />
      <ReviewList reviews={movie.reviews} />
    </div>
  );
}
