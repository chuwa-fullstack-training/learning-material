import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../config';

// Consumes the SSE endpoint GET /movies/:id/summary, accumulating tokens
// into a growing string — the "typing" effect of an AI chat reply.
//
// EventSource is the browser's built-in SSE client. Note its key
// limitation: it can ONLY make GET requests, with no custom headers or
// body. That's fine here (the movie id goes in the URL), but it's why apps
// that need to POST a prompt to an LLM often reach for fetch() + a
// ReadableStream reader instead — same SSE wire format, more control over
// the request. See pre_slides/lecture20.md for that contrast.
export function useAiSummary(movieId) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'streaming' | 'done' | 'error'
  const sourceRef = useRef(null);

  function start() {
    if (!movieId) return;
    // Close any previous stream before starting a new one.
    sourceRef.current?.close();
    setText('');
    setStatus('streaming');

    const source = new EventSource(`${API_BASE}/movies/${movieId}/summary`);
    sourceRef.current = source;

    // Default (unnamed) messages carry the tokens.
    source.onmessage = (event) => {
      setText((prev) => (prev ? `${prev} ${event.data}` : event.data));
    };

    // The server sends a named `done` event when the stream is complete —
    // EventSource stays open otherwise (and would even auto-reconnect), so
    // we have to close it explicitly.
    source.addEventListener('done', () => {
      setStatus('done');
      source.close();
    });

    source.onerror = () => {
      setStatus('error');
      source.close();
    };
  }

  // Reset when switching movies, and always close the stream on unmount.
  useEffect(() => {
    setText('');
    setStatus('idle');
    return () => sourceRef.current?.close();
  }, [movieId]);

  return { text, status, start };
}
