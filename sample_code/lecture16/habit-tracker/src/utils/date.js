// Small date helpers so mock data is always generated relative to "today",
// instead of hardcoded dates that would look stale a month from now.
export function toDateKey(date) {
  return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export function todayKey() {
  return toDateKey(new Date());
}

export function daysAgoKey(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return toDateKey(date);
}
