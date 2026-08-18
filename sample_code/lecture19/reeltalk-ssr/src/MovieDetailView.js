import { createElement as h } from 'react';

// No JSX in this project, on purpose: the server entry point (server.js)
// runs directly under plain `node`, with no build/transform step in front
// of it. Adding JSX here would mean either transforming the server code
// too, or maintaining two versions of this component — either way, more
// moving parts than the SSR mechanism itself calls for. `h(...)` is just
// `React.createElement(...)`, the thing JSX compiles down to anyway.
//
// This same function runs in two places: `server.js` calls it to produce
// the initial HTML, and `client.js` calls it again (with the exact same
// props) to hydrate that HTML in the browser. That's the whole SSR
// contract — same component, same props, twice.
export function MovieDetailView({ movie }) {
  return h(
    'div',
    { className: 'movie-detail' },
    h(
      'div',
      { className: 'movie-detail__header' },
      h('img', { src: movie.posterUrl, width: 160, height: 240, alt: '' }),
      h(
        'div',
        null,
        h('h1', null, movie.title),
        h(
          'p',
          { className: 'movie-detail__meta' },
          `${movie.releaseYear} · ${movie.runtimeMinutes} min · dir. ${movie.director}`,
        ),
        h('p', { className: 'movie-detail__genres' }, movie.genres.join(', ')),
        h('p', null, movie.synopsis),
      ),
    ),
    h(
      'h2',
      null,
      `Reviews (${movie.reviewStats.count})`,
      movie.reviewStats.count > 0
        ? ` · average ⭐ ${movie.reviewStats.averageRating.toFixed(1)}`
        : null,
    ),
    movie.reviews.length === 0
      ? h('p', { className: 'movie-detail__empty' }, 'No reviews yet.')
      : h(
          'ul',
          { className: 'review-list' },
          movie.reviews
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((review) =>
              h(
                'li',
                { key: review.id, className: 'review' },
                h(
                  'div',
                  { className: 'review__header' },
                  h('strong', null, review.reviewerName),
                  h('span', null, '⭐'.repeat(review.rating)),
                ),
                h('p', null, review.body),
              ),
            ),
        ),
  );
}
