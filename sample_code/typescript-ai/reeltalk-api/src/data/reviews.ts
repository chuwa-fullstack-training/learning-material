import type { Review } from '../types.js';

// In-memory review store — mutated at runtime via the createReview mutation.
// Resets to this seed data whenever the server restarts.
function daysAgoIso(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString();
}

let nextReviewId = 1;
function makeId(): string {
  const id = `r${nextReviewId}`;
  nextReviewId += 1;
  return id;
}

export const reviews: Review[] = [
  { id: makeId(), movieId: 'm1', reviewerName: 'Dana K.', rating: 5, body: 'Quietly devastating. The final ten minutes stayed with me for days.', createdAt: daysAgoIso(12) },
  { id: makeId(), movieId: 'm1', reviewerName: 'Marcus T.', rating: 4, body: 'A bit slow in the middle act, but the payoff is worth it.', createdAt: daysAgoIso(9) },
  { id: makeId(), movieId: 'm1', reviewerName: 'Ines P.', rating: 5, body: 'Helena Vance at her best. Nine Winters is good too but this is her real masterpiece.', createdAt: daysAgoIso(3) },
  { id: makeId(), movieId: 'm2', reviewerName: 'Owen R.', rating: 3, body: 'Interesting premise, but it never quite commits to its own rules.', createdAt: daysAgoIso(20) },
  { id: makeId(), movieId: 'm2', reviewerName: 'Sasha L.', rating: 4, body: 'That mid-film twist genuinely got me.', createdAt: daysAgoIso(5) },
  { id: makeId(), movieId: 'm4', reviewerName: 'Priya N.', rating: 5, body: 'Every performance in this is doing something interesting. Rewatched twice already.', createdAt: daysAgoIso(15) },
  { id: makeId(), movieId: 'm4', reviewerName: 'Yusuf B.', rating: 4, body: 'Dellucci really understands how families actually argue.', createdAt: daysAgoIso(11) },
  { id: makeId(), movieId: 'm4', reviewerName: 'Grace W.', rating: 2, body: 'Wanted to love this but it drags hard in the second half.', createdAt: daysAgoIso(6) },
  { id: makeId(), movieId: 'm4', reviewerName: 'Tomas H.', rating: 5, body: 'The scrapyard set alone deserves an award.', createdAt: daysAgoIso(2) },
  { id: makeId(), movieId: 'm6', reviewerName: 'Elif A.', rating: 5, body: 'Genuinely unsettling without ever showing you anything explicit. Rare.', createdAt: daysAgoIso(8) },
  { id: makeId(), movieId: 'm7', reviewerName: 'Ben C.', rating: 4, body: 'Warm, funny, and a little sad in exactly the right amounts.', createdAt: daysAgoIso(30) },
  { id: makeId(), movieId: 'm9', reviewerName: 'Ravi S.', rating: 5, body: 'One of the best "one night" premises I have seen in years.', createdAt: daysAgoIso(4) },
  { id: makeId(), movieId: 'm10', reviewerName: 'Lena F.', rating: 3, body: 'Fun action but the emotional beats feel unearned.', createdAt: daysAgoIso(17) },
  { id: makeId(), movieId: 'm13', reviewerName: 'Noor J.', rating: 5, body: 'Harvest Moon Protocol is the best "AI wakes up alone" film since Ironroot, and I mean that as high praise for both.', createdAt: daysAgoIso(1) },
];

export function nextReviewMeta(): { id: string; createdAt: string } {
  return { id: makeId(), createdAt: new Date().toISOString() };
}
