import { z } from 'zod';

// The single source of truth for what an "AI summary" looks like. Everyone
// downstream — the server that builds it, the client that renders it —
// derives their TypeScript type from THIS schema via z.infer, instead of
// hand-writing a matching interface that can drift out of sync.
export const MovieSummarySchema = z.object({
  rating: z.number().min(1).max(5).describe('Overall rating out of 5'),
  verdict: z.string().min(1).describe('One-sentence spoiler-free verdict'),
  tags: z.array(z.string()).min(1).max(5).describe('Short mood/genre tags'),
});

// The type is INFERRED, not hand-written — if the schema changes, this
// type changes with it automatically. No second place to keep in sync.
export type MovieSummary = z.infer<typeof MovieSummarySchema>;
