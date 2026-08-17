import { INITIAL_HABITS } from '../data/habits';

// Simulates a network call, same pattern as App A's fetchTracks.js.
// L17 replaces this with a real fetch() against habit-tracker-api.
export function fetchHabits({ signal } = {}) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => resolve(INITIAL_HABITS), 500);

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
