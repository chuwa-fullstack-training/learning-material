import { toDateKey } from './date';

// Counts consecutive check-in days ending today or yesterday. A gap of 2+
// days breaks the streak. Missing "today" doesn't zero it out immediately —
// you still have until the end of today to keep the streak alive.
export function computeStreak(checkIns) {
  const days = new Set(checkIns);
  const cursor = new Date();

  // If today isn't checked in yet, start counting from yesterday instead —
  // otherwise a habit not yet done today would incorrectly show streak 0.
  if (!days.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
