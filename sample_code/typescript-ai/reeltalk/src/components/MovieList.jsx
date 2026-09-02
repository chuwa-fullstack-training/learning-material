import { useQuery } from '@apollo/client';
import { MOVIES_QUERY } from '../queries';
import styles from './MovieList.module.css';

export default function MovieList({ selectedMovieId, onSelect }) {
  const { data, loading, error, fetchMore } = useQuery(MOVIES_QUERY, {
    variables: { first: 6 },
  });

  if (loading && !data) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { edges, pageInfo } = data.movies;

  function handleLoadMore() {
    fetchMore({ variables: { after: pageInfo.endCursor } });
  }

  return (
    <div>
      <ul className={styles.list}>
        {edges.map(({ node: movie }) => (
          <li
            key={movie.id}
            // CSS Modules classnames are just strings on an object — no
            // extra library needed to combine two of them conditionally.
            className={movie.id === selectedMovieId ? `${styles.card} ${styles.active}` : styles.card}
            onClick={() => onSelect(movie.id)}
          >
            <img className={styles.poster} src={movie.posterUrl} alt="" width={60} height={90} />
            <div>
              <strong>{movie.title}</strong>
              <div className={styles.meta}>
                {movie.releaseYear} · {movie.genres.join(', ')}
              </div>
              <div className={styles.stats}>
                🍿 {movie.reviewStats.count} reviews
                {movie.reviewStats.count > 0 && ` · ⭐ ${movie.reviewStats.averageRating.toFixed(1)}`}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {pageInfo.hasNextPage && (
        <button type="button" className={styles.loadMore} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}
