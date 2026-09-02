import { WebSocketServer, type WebSocket } from 'ws';
import type { Review } from './types.js';

// A raw WebSocket, typed. `ws.movieId` isn't part of the `ws` package's
// WebSocket type, so we extend it — the same "stash app data on the
// socket" trick from L20, now caught by the compiler if we typo the field.
interface ReviewSocket extends WebSocket {
  movieId?: string | null;
}

export const reviewsWss = new WebSocketServer({ noServer: true });

reviewsWss.on('connection', (ws: ReviewSocket, request) => {
  ws.movieId = new URL(request.url ?? '', `http://${request.headers.host}`).searchParams.get(
    'movieId',
  );
});

export function broadcastReview(review: Review): void {
  const message = JSON.stringify(review);
  for (const ws of reviewsWss.clients as Set<ReviewSocket>) {
    if (ws.readyState === ws.OPEN && ws.movieId === review.movieId) {
      ws.send(message);
    }
  }
}
