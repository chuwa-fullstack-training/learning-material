import { TRACKS } from '../data/tracks';

// Simulates a network call (real API call would just be `fetch(...)`).
// Supports an AbortSignal so components can cancel the request on unmount,
// mirroring the AbortController pattern used with real fetch calls.
export function fetchTracks({ signal } = {}) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => resolve(TRACKS), 600);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        const abortError = new Error('Aborted');
        abortError.name = 'AbortError';
        reject(abortError);
      });
    }
  });
}
