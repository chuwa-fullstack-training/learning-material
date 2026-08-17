import { toDateKey } from '../utils/date';
import type { Habit } from '../types';

export function daysAgo(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return toDateKey(date);
}

export function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'h1',
    name: 'Drink Water',
    category: 'health',
    checkIns: [],
    ...overrides,
  };
}
