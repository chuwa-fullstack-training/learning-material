import { movies } from './data/movies.js';

// Builds a deterministic, spoiler-free "AI summary" from the movie's own
// fields. No real LLM / API key involved — the point of the lecture is the
// STREAMING transport (SSE), not the text generation. The text is derived
// per-movie so each one streams something coherent and different.
function buildSummary(movie) {
  return [
    `Spoiler-free take on ${movie.title}, released in ${movie.releaseYear}.`,
    `Directed by ${movie.director}, this ${movie.genres.join(' / ')} film runs about ${movie.runtimeMinutes} minutes.`,
    `The premise, without giving anything away: ${movie.synopsis}`,
    `If you enjoy ${movie.genres[0]} films, this one is worth a look.`,
  ].join(' ');
}

// Express handler for GET /movies/:id/summary.
// Streams the summary token by token over Server-Sent Events — the same
// "one word at a time" effect you see in AI chat UIs, which is the whole
// reason SSE is worth knowing.
export function streamSummary(req, res) {
  const movie = movies.find((m) => m.id === req.params.id);
  if (!movie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  // The three headers that make a response an SSE stream instead of a
  // normal one. `text/event-stream` is what the browser's EventSource
  // looks for; without it, EventSource errors out.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const tokens = buildSummary(movie).split(' ');
  let i = 0;

  const interval = setInterval(() => {
    if (i < tokens.length) {
      // SSE wire format: each message is `data: <payload>\n\n`. The blank
      // line is the delimiter — miss it and the client never sees the event.
      res.write(`data: ${tokens[i]}\n\n`);
      i += 1;
    } else {
      // A named event lets the client distinguish "done" from a data token.
      res.write('event: done\ndata: end\n\n');
      clearInterval(interval);
      res.end();
    }
  }, 80);

  // If the client navigates away / closes the tab mid-stream, stop the
  // timer so we don't keep writing to a dead socket. SSE connections are
  // long-lived, so this cleanup actually matters.
  req.on('close', () => clearInterval(interval));
}
