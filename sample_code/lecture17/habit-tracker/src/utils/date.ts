export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export function todayKey(): string {
  return toDateKey(new Date());
}
