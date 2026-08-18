import { createElement as h } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import express from 'express';
import { fetchMovie } from './fetchMovie.js';
import { MovieDetailView } from './MovieDetailView.js';

const PORT = process.env.PORT || 4003;

// The root element rendered here is the FULL <html> document — React 18's
// streaming renderer is fine with that, and it means bootstrapScripts (the
// client hydration bundle) gets appended automatically right before the
// stream closes, instead of us having to hand-write a closing </body></html>
// after piping (which `pipe()` doesn't leave room for — it ends the
// response itself once the stream is done).
function Document({ movie }) {
  return h(
    'html',
    { lang: 'en' },
    h(
      'head',
      null,
      h('meta', { charSet: 'utf-8' }),
      h('title', null, `${movie.title} · ReelTalk (SSR)`),
      h('link', { rel: 'stylesheet', href: '/styles.css' }),
    ),
    h(
      'body',
      null,
      h('div', { id: 'root' }, h(MovieDetailView, { movie })),
      // Embedding the server-fetched data so the client doesn't have to
      // re-fetch it — this IS the "no second network round-trip" payoff
      // of SSR. `<` is escaped to < so a movie synopsis/review body
      // containing "</script>" can't break out of this script tag.
      h('script', {
        dangerouslySetInnerHTML: {
          __html: `window.__INITIAL_DATA__ = ${JSON.stringify(movie).replace(/</g, '\\u003c')};`,
        },
      }),
    ),
  );
}

const app = express();
app.use(express.static('public'));

app.get('/movies/:id', async (req, res) => {
  let movie;
  try {
    movie = await fetchMovie(req.params.id);
  } catch (err) {
    res.statusCode = 500;
    res.end(`Failed to load movie: ${err.message}`);
    return;
  }

  if (!movie) {
    res.statusCode = 404;
    res.end('Movie not found');
    return;
  }

  const { pipe } = renderToPipeableStream(h(Document, { movie }), {
    bootstrapScripts: ['/client.js'],
    onShellReady() {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      pipe(res);
    },
    onShellError() {
      res.statusCode = 500;
      res.end('Failed to render');
    },
    onError(err) {
      console.error('SSR stream error:', err);
    },
  });
});

app.listen(PORT, () => {
  console.log(`ReelTalk SSR ready at http://localhost:${PORT}/movies/m1`);
});
