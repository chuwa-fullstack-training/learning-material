import type { Request, Response } from 'express';
import { movies } from './data/movies.js';
import { MovieSummarySchema, type MovieSummary } from './schema/movieSummary.js';

// Builds a deterministic "AI summary" from the movie's own fields — same
// policy as L20: no real LLM/API key, the point is the transport AND (new
// here) the validation, not the text generation.
//
// The important part: this function's return type is `unknown`, on
// purpose. A real integration would replace this with
// `JSON.parse(llmResponseText)` — and an LLM's JSON output is UNTYPED at
// the language boundary no matter how confidently the SDK types the call.
// `unknown` forces every caller to validate before using it.
function buildRawSummary(movie: (typeof movies)[number]): unknown {
  const idNumber = Number(movie.id.replace('m', '')) || 1;
  return {
    rating: (idNumber % 5) + 1,
    verdict: `Spoiler-free take on ${movie.title}: a ${movie.genres.join('/')} film that earns its ${movie.runtimeMinutes} minutes.`,
    tags: movie.genres,
  };
}

// Express handler for GET /movies/:id/summary.
// Same SSE wire format as L20 (streams the verdict token by token), but
// the payload is now a zod-validated STRUCTURED object, not a bare string.
export function streamSummary(req: Request, res: Response): void {
  const movie = movies.find((m) => m.id === req.params.id);
  if (!movie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  // The trust boundary: treat the "generated" object as untrusted input
  // and run it through the schema before it goes anywhere near a client.
  // safeParse never throws — it returns a discriminated result, so a
  // malformed generation degrades to a 500, not a crashed process.
  const parsed = MovieSummarySchema.safeParse(buildRawSummary(movie));
  if (!parsed.success) {
    res.status(500).json({ message: 'AI summary failed validation', issues: parsed.error.issues });
    return;
  }
  const summary: MovieSummary = parsed.data;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const tokens = summary.verdict.split(' ');
  let i = 0;

  const interval = setInterval(() => {
    if (i < tokens.length) {
      res.write(`data: ${tokens[i]}\n\n`);
      i += 1;
    } else {
      // The named `done` event now carries the REST of the validated,
      // structured payload (rating + tags) as its data — the client
      // re-validates it on arrival (see useAiSummary.ts) instead of
      // trusting that "the server said so" is enough.
      res.write(`event: done\ndata: ${JSON.stringify({ rating: summary.rating, tags: summary.tags })}\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 80);

  req.on('close', () => clearInterval(interval));
}
