import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../config';
import { MovieSummaryTailSchema } from '../schema/movieSummary';

// A discriminated union models every state the stream can be in. The
// `status` field is the discriminant — narrowing on it (see AiSummary.tsx)
// makes it a compile error to read `.rating` while still `'streaming'`.
export type AiSummaryState =
  | { status: 'idle' }
  | { status: 'streaming'; verdict: string }
  | { status: 'done'; verdict: string; rating: number; tags: string[] }
  | { status: 'error'; message: string };

export function useAiSummary(movieId: string | null) {
  const [state, setState] = useState<AiSummaryState>({ status: 'idle' });
  const sourceRef = useRef<EventSource | null>(null);

  function start(): void {
    if (!movieId) return;
    sourceRef.current?.close();
    setState({ status: 'streaming', verdict: '' });

    const source = new EventSource(`${API_BASE}/movies/${movieId}/summary`);
    sourceRef.current = source;

    source.onmessage = (event: MessageEvent<string>) => {
      setState((prev) =>
        prev.status === 'streaming'
          ? { status: 'streaming', verdict: prev.verdict ? `${prev.verdict} ${event.data}` : event.data }
          : prev,
      );
    };

    // The `done` event's payload is untrusted JSON from the wire — exactly
    // like an LLM response would be. Parse it, THEN validate it, THEN (and
    // only then) let it become typed application state.
    source.addEventListener('done', (event: MessageEvent<string>) => {
      source.close();
      setState((prev) => {
        if (prev.status !== 'streaming') return prev;
        let raw: unknown;
        try {
          raw = JSON.parse(event.data);
        } catch {
          return { status: 'error', message: 'Malformed summary payload (invalid JSON)' };
        }
        const parsed = MovieSummaryTailSchema.safeParse(raw);
        if (!parsed.success) {
          return { status: 'error', message: 'Summary failed shape validation' };
        }
        return { status: 'done', verdict: prev.verdict, rating: parsed.data.rating, tags: parsed.data.tags };
      });
    });

    source.onerror = () => {
      source.close();
      setState((prev) => (prev.status === 'done' ? prev : { status: 'error', message: 'Stream connection failed' }));
    };
  }

  useEffect(() => {
    setState({ status: 'idle' });
    return () => sourceRef.current?.close();
  }, [movieId]);

  return { state, start };
}
