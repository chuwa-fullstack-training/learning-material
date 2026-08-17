import { daysAgoKey } from '../utils/date';

// Mock habit catalog with check-in history generated relative to "today",
// so the demo always looks current no matter when class runs.
// No backend involved yet — L17 replaces this with a real API.
function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => daysAgoKey(i));
}

export const INITIAL_HABITS = [
  {
    id: 'h1',
    name: 'Drink 8 Glasses of Water',
    category: 'health',
    checkIns: lastNDays(10), // 10-day streak ending today
  },
  {
    id: 'h2',
    name: 'Read 20 Minutes',
    category: 'mindfulness',
    checkIns: [daysAgoKey(4), daysAgoKey(5), daysAgoKey(6)], // streak broken a few days ago, current streak is 0
  },
  {
    id: 'h3',
    name: 'Morning Run',
    category: 'health',
    checkIns: [daysAgoKey(0)], // just started today
  },
  {
    id: 'h4',
    name: 'No Sugar',
    category: 'health',
    checkIns: [daysAgoKey(1), daysAgoKey(2), daysAgoKey(3), daysAgoKey(4), daysAgoKey(5)], // 5-day streak, not checked in yet today
  },
  {
    id: 'h5',
    name: 'Journal',
    category: 'mindfulness',
    checkIns: [daysAgoKey(1), daysAgoKey(4), daysAgoKey(5), daysAgoKey(8)], // sparse
  },
  {
    id: 'h6',
    name: 'Study Spanish',
    category: 'productivity',
    checkIns: lastNDays(4), // 4-day streak ending today
  },
];

export const CATEGORIES = ['health', 'mindfulness', 'productivity'];

