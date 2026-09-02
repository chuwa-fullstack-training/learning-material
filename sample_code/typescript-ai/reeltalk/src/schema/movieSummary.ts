import { z } from 'zod';

// The CLIENT's copy of the contract — deliberately identical to
// reeltalk-api/src/schema/movieSummary.ts. In a real monorepo this schema
// would live in one shared package imported by both sides; this repo keeps
// frontend and backend as fully independent projects (see CLAUDE.md), so
// the schema is duplicated on purpose to keep that boundary intact.
//
// The point still holds even duplicated: the CLIENT validates the payload
// again on arrival. It does not trust "the server already checked this" —
// the network is a trust boundary in both directions.
export const MovieSummarySchema = z.object({
  rating: z.number().min(1).max(5),
  verdict: z.string().min(1),
  tags: z.array(z.string()).min(1).max(5),
});

export type MovieSummary = z.infer<typeof MovieSummarySchema>;

// The `done` event's payload is the summary MINUS the verdict (which
// streamed in token by token as plain SSE data). This schema validates
// just that tail shape.
export const MovieSummaryTailSchema = MovieSummarySchema.omit({ verdict: true });
export type MovieSummaryTail = z.infer<typeof MovieSummaryTailSchema>;
