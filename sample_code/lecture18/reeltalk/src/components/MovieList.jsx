import { useQuery } from '@apollo/client';
import { MOVIES_QUERY } from '../queries';

export default function MovieList({ selectedMovieId, onSelect }) {
  const { data, loading, error, fetchMore } = useQuery(MOVIES_QUERY, {
    variables: { first: 6 },
  });

  if (loading && !data) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { edges, pageInfo } = data.movies;

  function handleLoadMore() {
    // The `after` variable is what makes this a fetchMore, not a fresh
    // query — the cache's merge() for `movies` (apolloClient.js) appends
    // these edges instead of replacing the existing page.
    fetchMore({ variables: { after: pageInfo.endCursor } });
  }

  return (
    <div className="movie-list">
      <ul>
        {edges.map(({ node: movie }) => (
          <li
            key={movie.id}
            className={movie.id === selectedMovieId ? 'movie-card active' : 'movie-card'}
            onClick={() => onSelect(movie.id)}
          >
            <img src={movie.posterUrl} alt="" width={60} height={90} />
            <div>
              <strong>{movie.title}</strong>
              <div className="movie-card__meta">
                {movie.releaseYear} · {movie.genres.join(', ')}
              </div>
              <div className="movie-card__stats">
                🍿 {movie.reviewStats.count} reviews
                {movie.reviewStats.count > 0 && ` · ⭐ ${movie.reviewStats.averageRating.toFixed(1)}`}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {pageInfo.hasNextPage && (
        <button type="button" onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}
